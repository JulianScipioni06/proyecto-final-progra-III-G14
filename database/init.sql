-- Script de inicialización de PostgreSQL (Ejecutado por Docker al crear el contenedor)

-- NOTA: La base de datos principal 'db_gastos' ya es creada automáticamente 
-- por la variable de entorno POSTGRES_DB definida en el docker-compose.yml.

-- La creación de las tablas (usuarios, categorias, transacciones) y sus 
-- relaciones está delegada al ORM (Sequelize) mediante el sistema de migraciones.
-- Para generar la estructura, ejecutar en el backend: pnpm dlx sequelize-cli db:migrate

-- Este archivo queda reservado para futuras configuraciones a nivel de servidor,
-- como la instalación de extensiones (ej. uuid-ossp) o esquemas adicionales.