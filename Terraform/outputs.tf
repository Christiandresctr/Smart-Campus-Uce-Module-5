output "ec2_public_ip" {
  description = "IP pública de la EC2"
  value       = aws_eip.app.public_ip
}

output "ec2_public_dns" {
  description = "DNS público de la EC2"
  value       = aws_instance.app.public_dns
}

output "ssh_connection" {
  description = "Comando para conectarse por SSH"
  value       = "ssh -i ./modulo5-key.pem ec2-user@${aws_eip.app.public_ip}"
}

output "internship_service_url" {
  description = "URL del internship-service"
  value       = "http://${aws_eip.app.public_ip}:3001/api/docs"
}

output "document_service_url" {
  description = "URL del document-service"
  value       = "http://${aws_eip.app.public_ip}:3002/api/docs"
}

output "ssh_key_file" {
  description = "Archivo de la llave privada"
  value       = "modulo5-key.pem (en la carpeta terraform/)"
}