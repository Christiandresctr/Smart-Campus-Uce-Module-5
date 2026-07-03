output "alb_dns_name" {
  description = "DNS del ALB (URL de entrada)"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Zone ID del ALB"
  value       = aws_lb.main.zone_id
}

output "internship_service_url" {
  description = "URL Internship Service vía ALB"
  value       = "http://${aws_lb.main.dns_name}/api/docs"
}

output "document_service_url" {
  description = "URL Document Service vía ALB"
  value       = "http://${aws_lb.main.dns_name}:81/api/docs"
}

output "grafana_url" {
  description = "URL Grafana vía ALB"
  value       = "http://${aws_lb.main.dns_name}:3000"
}

output "ssh_command" {
  description = "SSH no directo con ASG, usar Session Manager"
  value       = "Usar AWS Systems Manager Session Manager para conectar a instancias del ASG"
}

output "deploy_public_ip" {
  description = "IP pública para SSH deploy"
  value       = aws_eip.deploy.public_ip
}

output "deploy_ssh_connection" {
  value = "ssh -i ./modulo5-key.pem ec2-user@${aws_eip.deploy.public_ip}"
}