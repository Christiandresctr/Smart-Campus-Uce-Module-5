# Changelog

Todas las cambios notables en este proyecto seran documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto adherirse a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-07-14

### Added

#### Microservicios (10 servicios)

- **internship-service** (NestJS + PostgreSQL): Gestion de practicas preprofesionales y registro de horas diarias con coordenadas GPS
- **document-service** (NestJS + MongoDB): Subida, validacion con SHA-256, almacenamiento y versionado de documentos institucionales
- **approval-workflow** (NestJS + PostgreSQL + RabbitMQ + PDFKit): Flujo de aprobacion multinivel (tutor → coordinador → decano) con firmas digitales
- **report-hours** (Python FastAPI + PostgreSQL + Redis): Consolidacion de horas, validacion de cedula ecuatoriana, generacion de certificados PDF
- **notification-service** (NestJS + MongoDB + RabbitMQ + WebSocket): Notificaciones en tiempo real via REST, WebSocket y RabbitMQ
- **company-service** (NestJS + PostgreSQL): Catalogo de empresas con RUC y gestion de cupos
- **audit-log-service** (NestJS + MongoDB): Registro de auditoria del sistema
- **scheduling-service** (NestJS + PostgreSQL + Redis): Gestion de horarios con cache Redis
- **evaluation-service** (Python FastAPI + PostgreSQL): Evaluaciones de desempeno de estudiantes
- **compliance-service** (Python FastAPI + MongoDB): Control de cumplimiento de requisitos

#### Infraestructura

- Docker Compose con 21 contenedores (10 servicios + 9 bases de datos + Redis + RabbitMQ + API Gateway)
- API Gateway Nginx con reverse proxy a los 10 microservicios
- Terraform para 3 ambientes: Dev (EC2 t3.small), QA (EC2 t2.micro), Prod (ALB + ASG + EC2)
- VPC, Subnets, Internet Gateway, Security Groups, Elastic IPs

#### CI/CD

- GitHub Actions CI: Build + Test automatico en push/PR
- GitHub Actions CD: Build Docker → Push Docker Hub → Deploy SSH a EC2
- GitHub Actions Test: Pipeline dedicado para NestJS y Python
- Integracion con Jira: Transicion automatica de tickets

#### Documentacion

- README principal con diagrama de arquitectura Mermaid
- Documentacion de arquitectura con diagramas de secuencia
- Diagramas UML: casos de uso, clases, despliegue, estados
- Analisis de costos AWS por ambiente
- Guia de contribution
- Convenciones de commits
- CHANGELOG

#### Bases de Datos

- PostgreSQL 16 (5 instancias): internship_db, approval_db, report_hours_db, company_db, scheduling_db, evaluation_db
- MongoDB 7 (3 instancias): document_db, audit_db, notification_db
- Redis 7: Cache para scheduling-service y report-hours
- RabbitMQ 3: Comunicacion asincrona para notificaciones

### Features

- CRUD completo en los 10 microservicios
- Flujo de aprobacion multinivel con 3 pasos
- Validacion de cedula ecuatoriana (algoritmo modulo 10)
- Generacion de certificados PDF con ReportLab
- Generacion de PDFs con PDFKit (Chromium)
- Notificaciones en tiempo real via WebSocket
- Eventos asincronos via RabbitMQ
- Cache Redis con TTL de 300 segundos
- Documentacion Swagger/OpenAPI en todos los servicios NestJS
- FastAPI auto-docs en servicios Python
- Multi-stage Docker builds optimizados
- Health checks en API Gateway
