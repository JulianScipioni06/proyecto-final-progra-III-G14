# Proyecto Final - Programación III: Control de Gastos Personales

## ➢ Número de grupo e integrantes
**Grupo 14**
* Pozo Bautista
* Ripa Julian
* Scipioni Julian
* Strizzi Guido
* Wener Joaquin

---

## ➢ Nombre del proyecto y su descripción
**Nombre:** Control de Gastos Personales
**Descripción:** Desarrollo de una aplicación Full-Stack orientada a la gestión financiera personal. El backend consiste en una API RESTful aplicando el patrón de Arquitectura MVC (Model-View-Controller), desarrollada con Node.js y Typescript, utilizando Sequelize como ORM para la persistencia de datos en una base de datos PostgreSQL. El entorno de la base de datos está dockerizado para garantizar la portabilidad. 

El frontend es una Single Page Application (SPA) construida con React, diseñada con componentes modulares e interfaces dinámicas que consumen la API para gestionar ingresos, gastos, filtrar históricos por mes y calcular el balance del usuario en tiempo real. El sistema incluye autenticación segura mediante JWT y Bcrypt.

> **Links del Proyecto**
> * **Documentación en Postman:** https://documenter.getpostman.com/view/50291970/2sBXwvKoiL[cite: 5]
> * **API en Render:** https://proyecto-final-progra-iii-g14.onrender.com[cite: 5]

---

## ➢ Metodología de trabajo con Git y GitHub
Se adoptó un flujo de trabajo basado en **Ramas (Git Flow)** para mantener un historial limpio y evitar conflictos durante el desarrollo[cite: 5]:
1. **Rama `main`**: Rama de producción, bloqueada para commits directos. Contiene la versión estable y final[cite: 5].
2. **Rama `dev`**: Rama principal de integración para el entorno de desarrollo. Todas los *Pull Requests* se evalúan aquí antes de pasar a producción[cite: 5].
3. **Ramas individuales**: Cada integrante trabajó en su propia rama clonada desde `dev`[cite: 5].

---

## ➢ Tareas que realizó cada Integrante
**Backend & Base de Datos:**
* **Pozo Bautista:**  Registro y Lógica de Transacciones, Controlador y Rutas de Transacciones, Interfaces, editar y eliminar de categoría y corrigió algunos errores[cite: 5].
* **Ripa Julian:** Filtros e Historial de Transacciones. Construyó los endpoints para que el usuario pueda pedir su historial de gastos, filtrar por categoría o por tipo ('ingreso'/'gasto')[cite: 5].
* **Scipioni Julian:** Estructuración del Proyecto, Conexiones a la Base de Datos y Render, Dockerizar el proyecto, creación de los Modelos en Sequelize, configuración de relaciones/cardinalidades de la base de datos, lógica de obtenerBalance, implementación de seguridad (encriptación de contraseñas con Bcrypt y middleware de JWT) y Documentación en Postman y el Readme[cite: 5].
* **Strizzi Guido:** Crear y Listar Categorías. Creó los endpoints básicos en categoria.controller.js (Crear categoría, listar categorías disponibles para los gastos)[cite: 5].
* **Wener Joaquin:** CRUD y Controladores de Usuarios. Creó la lógica en usuario.controller.js para registrar usuarios y loguearlos. Conectó el middleware validateInputUsuario en las rutas de usuario.routes.js para proteger la entrada de datos[cite: 5].

**Frontend (React UI):**
* **Implementación de Vistas y Componentes:** Desarrollo del layout principal (`Dashboard.jsx`, `Navbar.jsx`), sistema de modales para nuevas transacciones y configuraciones (`ModalConfiguracion.jsx`), e integración de endpoints para el CRUD visual de transacciones. 
* **Modularización y Filtros:** Creación de componentes aislados (`ExpensesCard.jsx`, `TransaccionesList.jsx`) y lógica de estados para el filtrado de gastos mensuales y listado de categorías.

---

## ➢ Distribución de los archivos y carpetas
El proyecto está dividido en dos grandes bloques (Backend y Frontend), integrando tipado estricto con TypeScript para el servidor, y una arquitectura basada en componentes para la interfaz de usuario:

```text
/
├── /backend                 # API REST (Node.js, Express, Sequelize)
│   ├── /.husky              # Hooks de Git (validaciones pre-commit)
│   ├── /config              # Configuración de BD
│   ├── /controllers         # Lógica de negocio
│   ├── /core                # Configuración del servidor
│   ├── /interfaces          # Tipado estricto (TypeScript)
│   ├── /middleware          # Validadores y JWT
│   ├── /migrations          # Scripts de creación de tablas
│   ├── /models              # Modelos y cardinalidades
│   ├── /node_modules        # Dependencias de Node instaladas
│   ├── /routes              # Endpoints
│   ├── /seeders             # Datos iniciales (Categorías)
│   ├── .dockerignore        # Archivos excluidos del contenedor Docker
│   ├── .env                 # Variables de entorno locales
│   ├── .npmrc               # Configuración de gestión de paquetes
│   ├── app.js               # Punto de entrada de la API
│   ├── docker-compose.yml   # Orquestación específica del entorno backend
│   ├── Dockerfile           # Configuración para la imagen de la API
│   ├── package.json         # Dependencias y scripts del backend
│   ├── pnpm-lock.yaml       # Árbol de dependencias (pnpm)
│   ├── pnpm-workspace.yaml  # Configuración del espacio de trabajo (pnpm)
│   ├── settings.json        # Ajustes de entorno local (VS Code)
│   └── tsconfig.json        # Configuración del compilador TypeScript
│
├── /database                # Inicialización de la base de datos
│   └── init.sql             # Script SQL de arranque
│
├── /frontend                # Aplicación cliente (React + Vite)
│   ├── /node_modules        # Dependencias de Node instaladas
│   ├── /public              # Archivos estáticos públicos
│   ├── /src                 # Componentes, vistas y estilos
│   ├── Dockerfile.dev       # Configuración de imagen de desarrollo
│   ├── package-lock.json    # Árbol de dependencias npm
│   ├── package.json         # Dependencias y scripts del cliente
│   ├── pnpm-lock.yaml       # Árbol de dependencias pnpm
│   ├── pnpm-workspace.yaml  # Configuración del espacio de trabajo pnpm
│   └── README.md            # Documentación local del frontend
│
├── /pgadmin                 # Configuración del gestor visual de BD (pgAdmin)
│   ├── Dockerfile           # Configuración para la imagen de pgAdmin
│   └── servers.json         # Configuración predefinida de servidores DB
│
├── .gitignore               # Archivos excluidos del control de versiones en la raíz
├── docker-compose.yml       # Orquestación global de todos los servicios dockerizados
└── README.md                # Documentación principal del repositorio
```

## ➢ Configuración e Instalación Local Backend

Para levantar el proyecto en tu entorno local, seguí estos pasos:

1. **Clonar el repositorio e instalar dependencias:**
    ```bash
    pnpm install

2. **Configurar Variables de Entorno:**
   Crear un archivo `.env` en la raíz con la siguiente estructura (reemplazando con tus credenciales reales):

    ```env
    PORT=3001
    SECRET_KEY=TuClaveSegura

    # --- Opción A: Base de Datos Remota (Neon) ---
    PGHOST=ep-tu-host.aws.neon.tech
    PGDATABASE=neondb
    PGUSER=tu_usuario
    PGPASSWORD=tu_password_segura
    PGPORT=5432
    DATABASE_URL=postgresql://tu_usuario:tu_password_segura@ep-tu-host-pooler.aws.neon.tech/neondb?sslmode=require&channel_binding=require

    # --- Opción B: Base de Datos Local (Contenedor Docker) ---
    # Si preferís levantar el motor de forma local y aislada, comentá las 
    # variables de Neon de arriba y descomentá la siguiente línea:
    # DATABASE_URL=postgres://usuario:password@localhost:5432/db_gastos

1. **Levantar la Base de Datos (Docker)**
    ```bash
    docker-compose up -d

1. **Correr Migraciones y Seeders (Sequelize)**
    ```bash
    pnpm dlx sequelize-cli db:migrate
    pnpm dlx sequelize-cli db:seed:all

1. **Iniciar el servidor en modo desarrollo**
    ```bash
    pnpm run dev

## ➢ Levantar el Frontend (React)

1. **Ingresar a la carpeta del frontend y descargar dependencias:**
    ```bash
    pnpm install

2. **Iniciar la vista de desarrollo:**
    Crear un archivo .env en la raíz con la siguiente estructura (reemplazando con tus credenciales reales)[cite: 5]:
    ```bash
        pnpm run dev
