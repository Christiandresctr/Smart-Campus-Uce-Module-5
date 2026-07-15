variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nombre del ambiente (dev, qa, prod)"
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.small"
}

variable "key_name" {
  description = "Nombre del Key Pair"
  type        = string
  default     = "modulo5-key"
}

variable "ami_id" {
  description = "AMI Amazon Linux 2023 us-east-1"
  type        = string
  default     = "ami-06067086cf86c58e6"
}
