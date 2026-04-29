# Sistema de Cuentas

`cf.account` es el segundo componente del **proyecto Trascender**, encargado de la **gestión de identidad, autenticación y control de acceso** dentro del ecosistema.

Su propósito es centralizar el manejo de cuentas de usuario, permitiendo que múltiples aplicaciones compartan un sistema unificado de autenticación, autorización y gestión de sesiones.

---

## Rol dentro del ecosistema

Mientras `cf.archivospublicos` gestiona recursos públicos, `cf.account` gestiona **identidad**.

Este servicio actúa como una capa común que permite:

* Autenticación centralizada
* Reutilización de cuentas entre aplicaciones
* Control de acceso desacoplado
* Consistencia en la gestión de usuarios

De esta forma, las aplicaciones del ecosistema no implementan su propio sistema de autenticación, sino que delegan esta responsabilidad en un servicio especializado.

---

## Propósito

Este sistema busca:

* Centralizar la gestión de usuarios
* Evitar duplicación de mecanismos de autenticación
* Facilitar la integración entre múltiples aplicaciones
* Permitir escalabilidad en arquitecturas distribuidas
* Establecer una base sólida para control de acceso

---

## Principios

* **Desacoplamiento:** Las aplicaciones no gestionan usuarios directamente
* **Centralización:** Una única fuente de verdad para la identidad
* **Seguridad:** Control unificado de autenticación y sesiones
* **Reutilización:** Una cuenta puede ser utilizada en múltiples sistemas

---

## Capacidades

Este servicio contempla:

* Registro y gestión de usuarios
* Inicio de sesión
* Gestión de sesiones
* Roles y permisos
* Integración con otros servicios del ecosistema
* APIs para autenticación externa

---

## Tecnologías

### Backend

* Node.js
* Express (a través de `cf.framework`)
* Zod (validaciones)
* JSON Web Token (JWT)
* Argon2 (hash de contraseñas)
* Express Recaptcha
* Integración OAuth2 (Google, opcional)

---

## Base de datos

Actualmente utiliza:

* MongoDB

### Servicio Docker (referencial)

```yaml
mongodb_service:
  image: mongo
  container_name: mongodb_service
  volumes:
    - ./_mongodb:/data/db
  ports:
    - "172.27.16.1:27017:27017"
  restart: always
```

> Asegúrate de ajustar la IP según tu configuración de red local.

---

## Ejecución local

> Si vienes desde `cf.archivospublicos`, ya deberías tener configurada la red local.

---

### Con Node.js

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run start
```

---

### Con Docker

Modo desarrollo:

```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

Modo producción:

```bash
docker-compose build
docker-compose up
```

---

## Integración

Las aplicaciones del ecosistema pueden conectarse a `cf.account` para:

* Validar credenciales
* Obtener información de usuario
* Gestionar sesiones
* Aplicar reglas de autorización

---

## Notas

* Este repositorio es un servicio central dentro del ecosistema
* Contiene lógica específica para la gestión de identidad y accesos
* Está diseñado para ser consumido por múltiples sistemas

---

## Continuidad del ecosistema

Este servicio se apoya en la infraestructura de recursos públicos:

[https://github.com/jotacalderon90/cf.archivospublicos](https://github.com/jotacalderon90/cf.archivospublicos)

El siguiente componente del ecosistema corresponde a la gestión de archivos privados:

[https://github.com/jotacalderon90/cf.archivosprivados](https://github.com/jotacalderon90/cf.archivosprivados)
