# PetCare Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

Aplicación web para la gestión de una clínica veterinaria. Permite administrar citas, mascotas, dueños, servicios y usuarios del sistema.

**Despliegue:** [https://petcare-frontend-alpha.vercel.app/](https://petcare-frontend-alpha.vercel.app/)

## Tecnologías

- **React 19** con TypeScript
- **Vite 8** como bundler
- **React Router v7** para enrutamiento
- **Axios** para consumo de API
- **pnpm** como gestor de paquetes
- **Bootstrap 5** + **Bootstrap Icons** para grid e iconos
- **CSS Modules** con tokens de diseño personalizados
- **React Compiler** habilitado

## Características

- Autenticación con refresh de tokens y control de acceso por rol (ADMINISTRADOR, VETERINARIO, ASISTENTE, DUENO)
- Dashboard con resumen del negocio
- CRUD completo de servicios
- Gestión de citas con reprogramación y cancelación
- Administración de mascotas con vinculación a dueños y cambio de dueño principal
- Gestión de dueños y contactos de emergencia
- Sala de espera con registro de llegada y cambio de estado
- Triaje clínico con signos vitales y nivel de urgencia
- Atención clínica con diagnóstico, tratamiento y seguimiento
- Administración de veterinarios con gestión de horarios y estado activo/inactivo
- Bloqueos de disponibilidad de veterinarios
- Historial de transferencias de mascotas entre dueños
- Diseño responsive con sidebar colapsable y scroll interno
- Sistema de notificaciones toast

## Requisitos

- Node.js >= 18
- pnpm >= 9

## Instalación

```bash
pnpm install
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_URL_API` | URL base del backend | `http://localhost:8080` |

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia servidor de desarrollo con HMR |
| `pnpm build` | Compila TypeScript y empaqueta con Vite |
| `pnpm preview` | Previsualiza la build de producción |
| `pnpm lint` | Ejecuta ESLint sobre el código |

## Estructura del proyecto

```
src/
├── api/            # Cliente HTTP (Axios)
├── assets/         # Recursos estáticos (logos, imágenes)
├── components/     # Componentes React
│   ├── auth/       #   Protección de rutas
│   ├── citas/      #   Módulo de citas (formulario, tabla, reprogramar)
│   ├── common/     #   Componentes reutilizables (DataTable, modales, etc.)
│   ├── duenos/     #   Módulo de dueños
│   ├── layout/     #   Header, sidebar, Footer
│   └── mascotas/   #   Módulo de mascotas (tabla, modal, vincular)
├── constants/      # Constantes del dominio
├── contexts/       # Contextos de React
├── css/            # Estilos
│   ├── componentes/#   Estilos por componente
│   └── paginas/    #   Estilos por página
├── hooks/          # Custom hooks
├── layouts/        # Layout principal
├── pages/          # Páginas de la aplicación
│   ├── AtencionPage        # Atención clínica
│   ├── CitasPage           # Gestión de citas
│   ├── DashboardPage       # Panel principal
│   ├── DuenosPage          # Dueños
│   ├── LoginPage           # Inicio de sesión
│   ├── MascotasPage        # Mascotas
│   ├── SalaEsperaPage      # Sala de espera
│   ├── ServiciosPage       # Servicios
│   ├── TriajePage          # Triaje clínico
│   └── VeterinariosPage    # Administración de veterinarios
├── providers/      # Providers de React
├── routers/        # Configuración de rutas
├── services/       # Servicios de API
├── types/          # Tipos TypeScript
└── utils/          # Utilidades
```

## Despliegue

La aplicación está desplegada en Vercel:
[https://petcare-frontend-alpha.vercel.app/](https://petcare-frontend-alpha.vercel.app/)

Configurado mediante `vercel.json` con rewrites SPA para manejo de rutas del cliente.
