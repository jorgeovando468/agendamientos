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
- Backend: Express + Sequelize (MySQL con XAMPP o SQLite fallback)
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

## MySQL con XAMPP
1. Inicia MySQL en XAMPP.
2. Crea la base `agendamiento` (o ajusta `DB_NAME`).
3. Configura `.env` con `DB_DIALECT=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_USER=root`, `DB_PASSWORD` si aplica.
4. Ejecuta `npm run db:sync` para crear tablas.

Si prefieres SQLite (sin MySQL), usa `DB_DIALECT=sqlite` en `.env` y vuelve a correr `npm run db:sync`.

## Notas
- La integración de WhatsApp utiliza la API Cloud de Meta. Configure `WHATSAPP_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID`.
- La disponibilidad por defecto es de 09:00 a 17:00 con intervalos de 30 minutos.
