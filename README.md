# PetCare Frontend

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

- Autenticación con refresh de tokens y roles (ADMINISTRADOR, VETERINARIO, ASISTENTE, DUENO)
- Dashboard con resumen del negocio
- CRUD completo de servicios
- Gestión de citas con reprogramación y cancelación
- Administración de mascotas con vinculación a dueños
- Gestión de dueños y contactos de emergencia
- Diseño responsive con sidebar colapsable
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
│   ├── citas/      #   Módulo de citas
│   ├── common/     #   Componentes reutilizables
│   ├── duenos/     #   Módulo de dueños
│   ├── layout/     #   Header, Footer
│   └── mascotas/   #   Módulo de mascotas
├── constants/      # Constantes del dominio
├── contexts/       # Contextos de React
├── css/            # Estilos
│   ├── componentes/#   Estilos por componente
│   └── paginas/    #   Estilos por página
├── hooks/          # Custom hooks
├── layouts/        # Layout principal
├── pages/          # Páginas de la aplicación
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
