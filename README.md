# Cuentas

cf.account es un código fuente creado a partir de cf.framework. Este sistema es base para otras aplicaciones web ya que gestiona el ingreso de sesión, creación y administración de cuentas de usuario que usará la plataforma web.

## Probar con Node

```bash
npm install
npm run dev
```

Para producción reemplazar `npm run dev` por `npm run start`

## Probar con Docker

```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

Para producción quitar `-f docker-compose.dev.yml`

## Configurar ENVS

```bash
PORT: 2202
HOST: "http://192.168.42.3:2202"

HOST_ARCHIVOSPUBLICOS: "http://192.168.42.3:2201"
HOST_ACCOUNT: "http://192.168.42.3:2202"

SESSION_SECRET: "trascender-con-sso"

MONGO_URL: "mongodb://host.docker.internal:27017"
MONGO_DBNAME: "miscolecciones"

CANCREATEADMIN: "1"
```

Se debe reemplazar la IP por la que tiene su máquina usando el comando ipconfig. 
El resto de atributos son modificables 

PORT: Puerto a utilizar

HOST: Nombre del Host o DNS a utilizar, considerar el http/https

HOST_ARCHIVOSPUBLICOS: Host/DNS del sistema de archivos públicos

HOST_ACCOUNT: Debe ser igual a HOST

SESSION_SECRET: Cualquier string

MONGO_URL: Conexión a MongoDB

MONGO_DBNAME: Nombre de la db en MongoDB

CANCREATE: "1" Permite que usuarios anónimos se registren como usuario

CANRECOVERY: "1" Permite que usuarios puedan recuperar su contraseña (ver más adelante)

CANCREATEADMIN: "1" Para disponibilizar el formulario y crear cuenta de administrador/quitar una vez utilizado

## Crear usuario administrador

La propiedad CANCREATEADMIN permite crear al usuario administrador, se debe evitar su uso en producción por razones lógicas.
La url para configurar es la siguiente (cambie por IP registrada):

http://192.168.42.3:2202/form-admin