# Plataforma de Agendamiento y Recordatorios por WhatsApp

Una plataforma para gestionar citas, permitir reservas según disponibilidad y enviar recordatorios por WhatsApp.

## Requisitos
- Node.js 18+
- Docker (opcional) y Docker Compose

## Instalación (monorepo)
```bash
cd agendamiento-plataforma
cp .env.example .env
npm install
```

## Desarrollo
- Backend: Express + Sequelize (PostgreSQL)
- Frontend: React + Vite

### Scripts comunes
```bash
# levantar backend en desarrollo
npm run dev:backend

# levantar frontend en desarrollo
npm run dev:frontend

# levantar todo con Docker (DB + backend)
npm run docker:up
```

## Estructura
Consulte la carpeta `docs/` y el árbol de directorios en este README.

## Variables de entorno
Ver `.env.example`.

## Docker
```bash
npm run docker:up   # inicia db + backend
npm run docker:down # detiene servicios
```

## Notas
- La integración de WhatsApp utiliza la API Cloud de Meta. Configure `WHATSAPP_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID`.
- La disponibilidad por defecto es de 09:00 a 17:00 con intervalos de 30 minutos.
