output "ec2_public_ip" {
  description = "IP pública QA"
  value       = aws_eip.app.public_ip
}

output "ec2_public_dns" {
  description = "DNS público QA"
  value       = aws_instance.app.public_dns
}

output "ssh_connection" {
  description = "Comando SSH"
  value       = "ssh -i ./modulo5-key.pem ec2-user@${aws_eip.app.public_ip}"
}

output "internship_service_url" {
  description = "URL Internship Service"
  value       = "http://${aws_eip.app.public_ip}/api/docs"
}

output "document_service_url" {
  description = "URL Document Service"
  value       = "http://${aws_eip.app.public_ip}:81/api/docs"
}

output "grafana_url" {
  description = "URL Grafana"
  value       = "http://${aws_eip.app.public_ip}:3000"
}

output "rabbitmq_url" {
  description = "URL RabbitMQ Management"
  value       = "http://${aws_eip.app.public_ip}:15672"
}