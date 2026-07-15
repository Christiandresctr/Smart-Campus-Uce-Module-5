# Generar llave SSH con Terraform
resource "tls_private_key" "modulo5" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Crear Key Pair en AWS
resource "aws_key_pair" "modulo5" {
  key_name   = var.key_name
  public_key = tls_private_key.modulo5.public_key_openssh
}

# Guardar la llave privada en tu computadora
resource "local_file" "private_key" {
  content  = tls_private_key.modulo5.private_key_pem
  filename = "${path.module}/modulo5-key.pem"
  file_permission = "0600"
}

# Crear VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "modulo5-vpc-${var.environment}"
  }
}

# Subnet pública
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "modulo5-subnet-public-${var.environment}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "modulo5-igw-${var.environment}"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "modulo5-rt-public-${var.environment}"
  }
}

# Asociar subnet con route table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "ec2" {
  name        = "modulo5-sg-${var.environment}"
  description = "Permitir SSH, HTTP y puertos de servicios"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH, HTTP y servicios"
    from_port   = 22
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Redis, RabbitMQ, Monitoreo"
    from_port   = 3000
    to_port     = 15672
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "modulo5-sg-${var.environment}"
  }
}

# EC2 Instance
resource "aws_instance" "app" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.modulo5.key_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  user_data_replace_on_change   = false
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

    mkdir -p /home/ec2-user/docker
    curl -o /home/ec2-user/docker/docker-compose.yml \
      https://raw.githubusercontent.com/Christiandresctr/Smart-Campus-Uce-Module-5/dev/docker/docker-compose.yml
    cd /home/ec2-user/docker
    docker-compose pull
    docker-compose up -d

    # === modulo5 systemd service ===
    sudo tee /etc/systemd/system/modulo5.service <<'SYS'
    [Unit]
    Description=Smart Campus UCE Modulo 5
    Requires=docker.service
    After=docker.service

    [Service]
    Type=oneshot
    RemainAfterExit=yes
    WorkingDirectory=/home/ec2-user/docker
    ExecStart=/usr/local/bin/docker-compose up -d
    ExecStop=/usr/local/bin/docker-compose down
    StandardOutput=journal

    [Install]
    WantedBy=multi-user.target
    SYS

    sudo systemctl enable modulo5.service
    sudo systemctl start modulo5.service

    # === cron: limpiar Docker semanalmente ===
    echo "0 3 * * 0 docker system prune -af --volumes" | crontab -u ec2-user -
  EOF

  tags = { Name = "modulo5-ec2-${var.environment}" }
}

# Elastic IP
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"
  tags     = { Name = "modulo5-eip-${var.environment}" }
  lifecycle { prevent_destroy = true }  # NUNCA pierde la IP
}