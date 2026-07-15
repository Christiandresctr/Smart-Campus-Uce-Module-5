variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nombre del ambiente"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.small"
}

variable "key_name" {
  description = "Nombre del Key Pair"
  type        = string
  default     = "modulo5-prod-key"
}