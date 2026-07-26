# Usamos la imagen oficial de pgAdmin 4 como base
FROM dpage/pgadmin4:latest

# Copiamos nuestro archivo de configuración al directorio que lee pgAdmin
COPY servers.json /pgadmin4/servers.json

# (Opcional) Cambiamos el usuario a root un segundo para asegurar permisos, 
# y volvemos al usuario pgadmin por seguridad
USER root
RUN chown pgadmin:pgadmin /pgadmin4/servers.json
USER pgadmin