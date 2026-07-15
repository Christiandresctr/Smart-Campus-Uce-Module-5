# Analisis de Costos AWS — Smart Campus UCE Modulo 5

## Resumen de Costos Mensuales Estimados

| Ambiente | Instancia | Costo EC2/mes | Costo EIP/mes | Costo Data/mes | **Total/mes** |
|---|---|---|---|---|---|
| Dev | t3.small | ~$15.18 | ~$3.65 | ~$1.00 | **~$19.83** |
| QA | t2.micro | ~$7.59 | ~$3.65 | ~$0.50 | **~$11.74** |
| Prod | t2.micro x2 + ALB | ~$15.18 | ~$7.30 | ~$2.00 | **~$24.48** |
| **Total** | | | | | **~$56.05** |

## Desglose por Servicio AWS

### EC2 Instances

| Ambiente | Tipo | Cantidad | Precio/hora | Horas/mes | Costo/mes |
|---|---|---|---|---|---|
| Dev | t3.small | 1 | $0.0208 | 730 | $15.18 |
| QA | t2.micro | 1 | $0.0104 | 730 | $7.59 |
| Prod (ASG) | t2.micro | 1 (min) | $0.0104 | 730 | $7.59 |
| Prod (Deploy) | t2.micro | 1 | $0.0104 | 730 | $7.59 |

### Elastic IP

| Ambiente | Cantidad | Precio/hora (asociada) | Precio/hora (sin asociar) | Costo/mes |
|---|---|---|---|---|
| Dev | 1 | $0.00 | $0.005 | ~$3.65 |
| QA | 1 | $0.00 | $0.005 | ~$3.65 |
| Prod | 2 | $0.00 | $0.005 | ~$7.30 |

> **Nota**: Elastic IP no tiene costo mientras este asociada a una instancia EC2 en estado running.

### Application Load Balancer (Solo Prod)

| Componente | Costo/mes |
|---|---|
| ALB horario | ~$16.20 (0.0225 x 730h) |
| LCU (Load Balancer Units) | ~$5.00 (estimado) |
| **Total ALB** | **~$21.20** |

> **Nota**: El ALB se incluye en el costo total de Prod.

### Data Transfer

| Concepto | Costo |
|---|---|
| Primeros 100 GB/mes | Gratis (Free Tier) |
| Transferencia entre AZ | $0.01/GB |
| Transferencia a Internet | $0.09/GB (despues de 100GB) |
| **Estimado mensual** | **~$1.00 - $2.00** |

## Costos Gratis (No generan carga)

| Servicio | Costo |
|---|---|
| Docker Hub (pulls publicos) | $0 |
| GitHub Actions (2000 min/mes) | $0 |
| PostgreSQL (software) | $0 |
| MongoDB (software) | $0 |
| Redis (software) | $0 |
| RabbitMQ (software) | $0 |
| Nginx (software) | $0 |
| Terraform (software) | $0 |
| Swagger/OpenAPI (runtime) | $0 |

## Free Tier AWS (12 meses)

AWS Free Tier incluye:
- **750 horas/mes** de t2.micro o t3.micro (12 meses)
- **30 GB** de almacenamiento EBS gp2/gp3
- **100 GB** de transferencia a Internet
- **200 solicitudes** de Elastic IP por mes

### Aplicacion al Proyecto

| Recurso | Free Tier | Sin Free Tier |
|---|---|---|
| EC2 Dev (t3.small) | No aplica (t3.small) | $15.18/mes |
| EC2 QA (t2.micro) | $0 (750h incluidas) | $7.59/mes |
| EC2 Prod (t2.micro x2) | 750h incluidas, 1 sobrante | $15.18/mes |
| EIP x4 | 200 incluidas | $14.60/mes |

### Costo Real con Free Tier (12 meses)

| Ambiente | Costo con Free Tier |
|---|---|
| Dev | ~$15.18 (t3.small no cubierto) |
| QA | ~$3.65 (solo EIP) |
| Prod | ~$10.95 (1 EC2 extra + EIPs) |
| **Total** | **~$29.78/mes** |

## Optimizacion de Costos

### Estrategias Implementadas
1. **Auto Scaling Group**: Escala automaticamente entre 1-2 instancias en produccion
2. **Elastic IP**: Sin costo cuando esta asociada a instancia running
3. **Docker Hub**: Imagenes publicas sin costo de pull
4. **Monorepo**: CI/CD compartido, reduciendo tiempo de build

### Recomendaciones
1. **Reserved Instances**: 1 ano de compromiso reduce ~30% el costo de EC2
2. **Spot Instances**: Para QA/Dev, reduccion de ~70%
3. **Consolidar QA/Dev**: Usar una sola instancia para ambos ambientes
4. **监控监控**: Usar AWS Cost Explorer para alertas de presupuesto

## Comparativa con Alternativas

| Alternativa | Costo estimado/mes | Notas |
|---|---|---|
| **AWS (actual)** | ~$56 | EC2 + EIP + ALB |
| AWS Lambda | ~$10-30 | Pay per request, pero complejo para 10 servicios |
| Heroku | ~$50-100 | Dynos + add-ons |
| Railway | ~$20-40 | Simpler pero menos control |
| DigitalOcean | ~$40-60 | Droplets + LB |

## Costo Total del Proyecto (12 meses)

| Concepto | Costo |
|---|---|
| AWS (12 meses con Free Tier) | ~$357.36 |
| Dominio (opcional) | ~$12.00 |
| **Total estimado** | **~$369.36** |

> **Costo promedio mensual**: ~$30.78
