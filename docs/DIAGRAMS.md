# Diagramas UML — Smart Campus UCE Modulo 5

## Diagrama de Casos de Uso

```mermaid
graph TB
    subgraph "Actores"
        EST[Estudiante]
        TUT[Tutor]
        COORD[Coordinador]
        DEC[Decano]
        ADMIN[Administrador]
    end

    subgraph "Sistema"
        subgraph "Gestion de Practicas"
            CU1[Crear solicitud de practica]
            CU2[Registrar horas diarias]
            CU3[Ver practicas propias]
            CU4[Subir documentos]
            CU5[Ver documentos propios]
        end

        subgraph "Aprobacion"
            CU6[Revisar solicitud 1er nivel]
            CU7[Revisar solicitud 2do nivel]
            CU8[Revisar solicitud final]
            CU9[Ver estado de aprobacion]
        end

        subgraph "Reportes y Evaluacion"
            CU10[Ver reporte de horas]
            CU11[Generar certificado PDF]
            CU12[Evaluar estudiante]
            CU13[Ver evaluaciones]
        end

        subgraph "Gestion Administrativa"
            CU14[Gestionar empresas]
            CU15[Ver auditoria]
            CU16[Gestionar horarios]
            CU17[Ver cumplimiento]
        end

        subgraph "Notificaciones"
            CU18[Recibir notificaciones]
            CU19[Marcar como leida]
        end
    end

    EST --> CU1 & CU2 & CU3 & CU4 & CU5 & CU9 & CU10 & CU18 & CU19
    TUT --> CU6 & CU9 & CU13
    COORD --> CU7 & CU9 & CU10 & CU13
    DEC --> CU8 & CU9 & CU10 & CU13
    ADMIN --> CU14 & CU15 & CU16 & CU17 & CU10
```

## Diagrama de Clases (Simplificado)

```mermaid
classDiagram
    class Internship {
        +UUID id
        +String student_id
        +String company_name
        +String company_address
        +Date start_date
        +Date end_date
        +Int total_hours_required
        +Decimal total_hours_completed
        +String status
        +Date created_at
        +Date updated_at
    }

    class HourLog {
        +UUID id
        +UUID internship_id
        +Date log_date
        +Decimal hours
        +String description
        +Float location_lat
        +Float location_lng
        +Boolean approved
    }

    class Document {
        +ObjectId _id
        +String internship_id
        +String document_type
        +String file_name
        +String file_url
        +Int file_size
        +String file_hash
        +Int version
        +String uploaded_by
    }

    class Approval {
        +UUID id
        +UUID internship_id
        +String current_step
        +String status
        +JSONB signatures
        +JSONB metadata
    }

    class Company {
        +Int id
        +String name
        +String address
        +String ruc
        +String phone
        +String email
        +Boolean isActive
        +Int availableSlots
    }

    class Notification {
        +ObjectId _id
        +String userId
        +String title
        +String message
        +String type
        +Boolean read
    }

    class Schedule {
        +UUID id
        +String studentId
        +Int companyId
        +Date startDate
        +Date endDate
        +Int dayOfWeek
        +String startTime
        +String endTime
        +String status
    }

    class Evaluation {
        +Int id
        +String studentId
        +Int companyId
        +Int internshipId
        +Int score
        +String comments
    }

    class Compliance {
        +ObjectId _id
        +String studentId
        +String type
        +String status
        +String notes
    }

    class Audit {
        +ObjectId _id
        +String action
        +String entity
        +String entityId
        +String userId
        +Object details
    }

    Internship "1" --> "*" HourLog : tiene
    Internship "1" --> "*" Document : genera
    Internship "1" --> "1" Approval : requiere
    Internship "*" --> "1" Company : asociada a
    Schedule "*" --> "1" Company : programada en
    Evaluation "*" --> "1" Internship : evalua
    Compliance "*" --> "1" Student : verifica
```

## Diagrama de Despliegue

```mermaid
graph TB
    subgraph "AWS Cloud - us-east-1"
        subgraph "VPC modulo5-vpc"
            subgraph "Public Subnet 10.0.1.0/24"
                EIP["Elastic IP"]
                EC2["EC2 Instance<br/>Amazon Linux 2023<br/>Docker + Docker Compose"]
            end
            IGW["Internet Gateway"]
        end
    end

    subgraph "Docker - modulo5-net"
        NGINX["api-gateway<br/>Nginx :80"]

        subgraph "Servicios"
            S1["internship-service:3001"]
            S2["document-service:3002"]
            S3["approval-workflow:3003"]
            S4["report-hours:3004"]
            S5["notification-service:3005"]
            S6["company-service:3006"]
            S7["audit-log-service:3007"]
            S8["scheduling-service:3008"]
            S9["evaluation-service:3009"]
            S10["compliance-service:3010"]
        end

        subgraph "Datos"
            PG["PostgreSQL x5"]
            MG["MongoDB x3"]
            REDIS["Redis"]
            RABBIT["RabbitMQ"]
        end
    end

    EIP --> EC2
    EC2 --> NGINX
    NGINX --> S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10
    S1 & S3 & S4 & S6 & S8 & S9 --> PG
    S2 & S5 & S7 & S10 --> MG
    S5 --> RABBIT
    S8 --> REDIS
    S4 --> REDIS
```

## Diagrama de Flujo — CI/CD

```mermaid
flowchart TD
    A[Developer push/PR] --> B{CI Pipeline}
    B --> C[Discover Services]
    C --> D[Build & Test Matrix]
    D --> E[NestJS: pnpm install + build + test]
    D --> F[Python: pip install + pytest]
    E --> G{Tests Pass?}
    F --> G
    G -->|Yes| H[Jira Transition: En curso]
    G -->|No| I[Fail PR]

    J[PR Merged to dev/test/main] --> K{CD Pipeline}
    K --> L[Run Tests]
    L --> M{Tests Pass?}
    M -->|No| N[Abort Deploy]
    M -->|Yes| O[Build Docker Images]
    O --> P[Push to Docker Hub]
    P --> Q[SSH to EC2]
    Q --> R[docker-compose pull]
    R --> S[docker-compose up -d]
    S --> T[Image Prune]
    T --> U[Jira Transition: Deployed]
```

## Diagrama de Estados — Practica Preprofesional

```mermaid
stateDiagram-v2
    [*] --> draft : Estudiante crea

    draft --> pending_review : Enviar para revision
    pending_review --> approved : Tutor + Coordinador + Decano aprueban
    pending_review --> rejected : Rechazado en cualquier paso

    approved --> in_progress : Iniciar actividades
    in_progress --> completed : Horas completadas (320h)

    rejected --> draft : Corregir y reenviar

    completed --> [*]
```

## Diagrama de Estados — Flujo de Aprobacion

```mermaid
stateDiagram-v2
    [*] --> tutor_pending : Iniciar flujo

    tutor_pending --> coordinator_pending : Tutor aprueba
    tutor_pending --> rejected : Tutor rechaza

    coordinator_pending --> dean_pending : Coordinador aprueba
    coordinator_pending --> rejected : Coordinador rechaza

    dean_pending --> approved : Decano aprueba
    dean_pending --> rejected : Decano rechaza

    rejected --> tutor_pending : Reenviar

    approved --> [*]
```

## Diagrama de Secuencia — Subida de Documentos

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant DS as document-service
    participant S3 as MongoDB
    participant AH as approval-workflow

    E->>DS: POST /document/upload (file + metadata)
    DS->>DS: Generar SHA-256 hash
    DS->>DS: Asignar version = 1
    DS->>S3: Guardar documento
    DS-->>E: 201 Created (document_id)

    E->>AH: POST /approval/start
    AH->>AH: Validar documentos requeridos
    AH-->>E: Flujo iniciado
```

## Diagrama de Paquetes

```mermaid
graph TB
    subgraph "Monorepo: smart-campus-uce-modulo5"
        subgraph "apps/"
            subgraph "NestJS Services"
                P1[internship-service]
                P2[document-service]
                P3[approval-workflow]
                P5[notification-service]
                P6[company-service]
                P7[audit-log-service]
                P8[scheduling-service]
            end

            subgraph "Python Services"
                P4[report-hours]
                P9[evaluation-service]
                P10[compliance-service]
            end
        end

        subgraph "docker/"
            DC[docker-compose.yml]
            NG[nginx/]
        end

        subgraph "Terraform/"
            TF_D[Dev]
            TF_QA[QA]
            TF_P[Prod]
        end

        subgraph ".github/"
            CI[ci.yml]
            CD[deploy.yml]
            TEST[test.yml]
        end
    end
```
