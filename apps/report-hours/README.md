# Report Hours Service - SUM5-10

Microservicio para consolidación de horas de pasantías y generación de certificados.

## Tecnologías
- Python 3.12
- FastAPI
- PostgreSQL
- SQLAlchemy
- ReportLab (PDF)
- Docker

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /students | Registrar estudiante (cédula ecuatoriana) |
| GET | /students/{cedula} | Obtener estudiante por cédula |
| POST | /hours | Registrar horas laboradas |
| GET | /report/hours/{cedula} | Reporte consolidado de horas |
| POST | /report/certificate | Generar certificado PDF |
| GET | /health | Health check |

## Estructura
app/ ├── main.py # Endpoints FastAPI ├── models.py # Modelos SQLAlchemy ├── schemas.py # Esquemas Pydantic ├── services.py # Lógica de negocio ├── database.py # Conexión PostgreSQL └── init.py


## Ejecución local
```bash
docker compose -f docker/docker-compose.yml up -d report-hours
Swagger: http://localhost:83/docs

Validación
Cédula ecuatoriana validada con algoritmo módulo 10. Mínimo 320 horas para certificación.


Ese es el contenido completo para el README.md. Cópialo exactamente así.