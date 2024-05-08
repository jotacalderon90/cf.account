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