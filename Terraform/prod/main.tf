# Generar llave SSH
resource "tls_private_key" "modulo5" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Buscar AMI Amazon Linux 2023
variable "ami_id" {
  description = "AMI Amazon Linux 2023 us-east-1"
  type        = string
  default     = "ami-06067086cf86c58e6"
}

# Key Pair
resource "aws_key_pair" "modulo5" {
  key_name   = var.key_name
  public_key = tls_private_key.modulo5.public_key_openssh
}

# Guardar llave privada
resource "local_file" "private_key" {
  content         = tls_private_key.modulo5.private_key_pem
  filename        = "${path.module}/modulo5-key.pem"
  file_permission = "0600"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "modulo5-vpc-${var.environment}" }
}

# Subnet pública (necesitamos 2 para ALB en diferentes AZs)
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = { Name = "modulo5-subnet-public-a-${var.environment}" }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}b"

  tags = { Name = "modulo5-subnet-public-b-${var.environment}" }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "modulo5-igw-${var.environment}" }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "modulo5-rt-public-${var.environment}" }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "ec2" {
  name        = "modulo5-sg-${var.environment}"
  description = "Puertos para servicios del modulo 5"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (NGINX - API Gateway)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "modulo5-sg-${var.environment}" }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "modulo5-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ec2.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = { Name = "modulo5-alb-${var.environment}" }
}

# Target Group
resource "aws_lb_target_group" "app" {
  name     = "modulo5-tg-${var.environment}"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = { Name = "modulo5-tg-${var.environment}" }
}

# Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Launch Template
resource "aws_launch_template" "app" {
  name_prefix   = "modulo5-lt-${var.environment}"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = aws_key_pair.modulo5.key_name
  vpc_security_group_ids = [aws_security_group.ec2.id]
  

  user_data = base64encode(<<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker git
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "modulo5-ec2-${var.environment}" }
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name                = "modulo5-asg-${var.environment}"
  vpc_zone_identifier = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"
  min_size            = 1
  max_size            = 2
  desired_capacity    = 1

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "modulo5-ec2-${var.environment}"
    propagate_at_launch = true
  }
}

# EC2 fijo para SSH deploy
resource "aws_instance" "deploy" {
  ami                    = var.ami_id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.modulo5.key_name
  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  user_data_replace_on_change = false
  lifecycle { ignore_changes = [ami, user_data] }

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker git
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  EOF

  tags = { Name = "modulo5-ec2-deploy-${var.environment}" }
}

# Elastic IP para el EC2 de deploy
resource "aws_eip" "deploy" {
  instance = aws_instance.deploy.id
  domain   = "vpc"
  tags     = { Name = "modulo5-eip-deploy-${var.environment}" }
  lifecycle { prevent_destroy = true }
}

# Registrar EC2 fijo en el Target Group del ALB
resource "aws_lb_target_group_attachment" "deploy" {
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = aws_instance.deploy.id
  port             = 80
}
