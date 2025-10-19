# Arquitectura

- Backend: API REST en Express, con Sequelize a PostgreSQL.
- Frontend: React (Vite) consumiendo la API del backend.
- Servicios externos: WhatsApp Cloud API para envío de mensajes.
- Docker Compose: orquesta PostgreSQL y el backend en desarrollo.

## Flujo básico
1. Cliente consulta disponibilidad (`GET /api/availability`).
2. Cliente crea una reserva (`POST /api/appointments`).
3. El sistema puede enviar confirmación y recordatorios por WhatsApp.

## Modelos principales
- User: administradores/propietarios (y opcionalmente clientes registrados).
- Appointment: cita con `startTime`, `endTime`, `customerName`, `customerPhone`, `status`.

## Seguridad
- API Key simple por encabezado `x-api-key`.
- No exponer tokens de WhatsApp; usar variables de entorno.
