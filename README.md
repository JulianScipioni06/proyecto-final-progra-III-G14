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
**Descripción:** Desarrollo de una API RESTful aplicando el patrón de Arquitectura MVC (Model-View-Controller) orientada a la gestión financiera personal. Está desarrollada con Node.js y Typescript, utilizando Sequelize como ORM para la persistencia de datos en una base de datos PostgreSQL. El entorno de la base de datos está dockerizado para garantizar la portabilidad. El sistema incluye un sistema de autenticación seguro mediante JWT y Bcrypt, permitiendo a los usuarios gestionar sus ingresos, gastos y calcular su balance en tiempo real.
> **Links del Proyecto**
> * **Documentación en Postman:** https://documenter.getpostman.com/view/50291970/2sBXwvKoiL
> * **API en Render:** https://proyecto-final-progra-iii-g14.onrender.com


---

## ➢ Metodología de trabajo con Git y GitHub
Se adoptó un flujo de trabajo basado en **Ramas (Git Flow)** para mantener un historial limpio y evitar conflictos durante el desarrollo:
1. **Rama `main`**: Rama de producción, bloqueada para commits directos. Contiene la versión estable y final.
2. **Rama `dev`**: Rama principal de integración para el entorno de desarrollo. Todas los *Pull Requests* se evalúan aquí antes de pasar a producción.
3. **Ramas individuales**: Cada integrante trabajó en su propia rama clonada desde `dev`.

---

## ➢ Tareas que realizo cada Integrante
* **Pozo Bautista:**  Registro y Lógica de Transacciones, Controlador y Rutas de Transacciones, Interfaces, editar y eliminar de categoria y corrigio algunos errores.
* **Ripa Julian:** Filtros e Historial de Transacciones. Construyo los endpoints para que el usuario pueda pedir su historial de gastos, filtrar por categoría o por tipo ('ingreso'/'gasto').
* **Scipioni Julian:** Estructuracion del Proyecto, Conexiones a la Base de Datos y Render, Dockerizar el proyecto, creación de los Modelos en Sequelize, configuración de relaciones/cardinalidades de la base de datos, logica de obtenerBalance, implementación de seguridad (encriptación de contraseñas con Bcrypt y middleware de JWT) y Documentancion en Postman y el Readme.
* **Strizzi Guido:** Crear y Listar Categorias. Creo los endpoints básicos en categoria.controller.js (Crear categoría, listar categorías disponibles para los gastos).
* **Wener Joaquin:** CRUD y Controladores de Usuarios. Creo la lógica en usuario.controller.js para registrar usuarios y loguearlos. Conecto el middleware validateInputUsuario en las rutas de usuario.routes.js para proteger la entrada de datos.

---

## ➢ Distribución de los archivos y carpetas
El proyecto respeta la Arquitectura MVC y está distribuido de la siguiente manera, integrando tipado estricto con TypeScript para las interfaces y modelos, y orquestación con Docker:

```text
/
├── /.husky                  # Hooks de Git (ej: validaciones pre-commit)
├── /config                  # Configuración de base de datos
│   ├── config.json          # Credenciales de Sequelize
│   └── database.config.js   # Lógica de conexión a PostgreSQL
├── /controllers             # Lógica de negocio y peticiones (req, res)
│   ├── categoria.controller.js
│   ├── transaccion.controller.js
│   └── usuario.controller.js
├── /core                    # Configuración e instanciación del servidor Express
│   └── server.js
├── /interfaces              # Tipado estricto y contratos (TypeScript)
│   ├── categoria.interface.ts
│   ├── transaccion.interface.ts
│   └── usuario.interface.ts
├── /middleware              # Validadores e interceptores de seguridad
│   ├── error-handler.middleware.js
│   ├── usuario-validator.middleware.js
│   └── validar-jwt.middleware.js
├── /migrations              # Scripts de creación de tablas en la base de datos
│   ├── 20260622005438-crear-tabla-usuarios.js
│   ├── 20260622005447-crear-tabla-categorias.js
│   └── 20260622005457-crear-tabla-transacciones.js
├── /models                  # Modelos de Sequelize y configuración de relaciones
│   ├── cardinalidades.model.ts
│   ├── categoria.model.ts
│   ├── index.js
│   ├── index.model.ts
│   ├── transaccion.model.ts
│   └── usuario.model.ts
├── /routes                  # Definición de los endpoints de la API
│   ├── categoria.routes.js
│   ├── transaccion.routes.js
│   └── usuario.routes.js
├── /seeders                 # Datos iniciales para la DB (Categorías por defecto)
│   └── 20260622011110-demo-categorias.js
├── .dockerignore            # Archivos excluidos del contenedor Docker
├── .env                     # Variables de entorno (Secret Key, DB URL, Port)
├── .gitignore               # Archivos a ignorar por Git (node_modules, .env)
├── .npmrc                   # Configuración del gestor de paquetes
├── app.js                   # Punto de entrada principal de la aplicación
├── docker-compose.yml       # Orquestación del contenedor de PostgreSQL
├── Dockerfile               # Configuración para la creación de la imagen de la API
├── package.json             # Dependencias y scripts del proyecto
├── pnpm-lock.yaml           # Árbol exacto de dependencias usando pnpm
├── pnpm-workspace.yaml      # Configuración del entorno de trabajo de pnpm
├── settings.json            # Configuración local del entorno de desarrollo (VS Code)
├── tsconfig.json            # Configuración del compilador de TypeScript
└── README.md                # Documentación principal
```

## ➢ Configuración e Instalación Local

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