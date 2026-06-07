# Espacio Resiliente - Backend API

## Stack
- **NestJS** (TypeScript) - Framework backend
- **PostgreSQL** - Base de datos
- **Prisma 6** - ORM
- **Culqi** - Pasarela de pagos (Perú)
- **Resend** - Emails transaccionales
- **Google Calendar API** - Gestión de citas
- **JWT + Passport** - Autenticación

## Estructura de Módulos
- `auth/` - Registro, login, JWT
- `psychologists/` - CRUD psicólogos (público: listado, perfil)
- `services/` - Servicios y paquetes de sesiones
- `appointments/` - Gestión de citas
- `payments/` - Integración Culqi (cobros)
- `contact/` - Formulario de contacto
- `email/` - Servicio de emails (Resend)
- `intranet/` - Zona exclusiva para pacientes con paquete
- `prisma/` - Servicio global de base de datos
- `common/` - Decoradores, guards, filtros compartidos

## Endpoints API (prefijo /api)
- `POST /api/auth/register` - Registro paciente
- `POST /api/auth/login` - Login
- `GET /api/psychologists` - Listar psicólogos
- `GET /api/psychologists/:slug` - Perfil psicólogo
- `GET /api/services` - Listar servicios
- `GET /api/services/packages` - Listar paquetes
- `POST /api/appointments` - Crear cita (auth)
- `GET /api/appointments/my` - Mis citas (auth)
- `POST /api/payments/charge` - Procesar pago (auth)
- `POST /api/contact` - Enviar mensaje (público)

## Convenciones
- Puerto: 3001
- Frontend: puerto 3000
- Prisma schema en `prisma/schema.prisma`
- Variables de entorno en `.env` (no commitear)
