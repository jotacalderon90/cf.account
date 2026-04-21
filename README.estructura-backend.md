# Análisis de Estructura y Funcionalidad del Backend (`cf.account`)

## 1. Visión General
El proyecto funciona bajo un enfoque altamente modular y guiado por convenciones utilizando el marco dinámico propio **`cl.jotacalderon.cf.framework`**. El punto de entrada principal (`app.js`) es extremadamente simplificado (consta de casi una sola línea) encargándose de invocar al empaquetador subyacente que se ocupa de registrar automáticamente las rutas y módulos situados en la carpeta `backend`.

El ecosistema principal utiliza librerías modernas como **`zod`** (validación de datos), **`argon2`** (hashing de contraseñas de alta seguridad) y **`jsonwebtoken`** (manejo de sesiones apátridas).

## 2. Definición de Rutas (`/backend/`)
Los endpoints y servicios disponibles se declaran de forma ordenada en archivos nombrados bajo un índice numérico (`router.NN.<modulo>.js`). Estos ficheros actúan como manifestos de rutas, utilizando comentarios enlazados metadatos como `//@route`, `//@method` y `//@roles` para configurar autorizaciones, métodos y caminos automágicamente, también emplean tags de `@swagger` garantizando documentación estándar integrada.

*   `router.01.default.js`: Rutas por defecto del sistema y estáticos (ej: `/favicon.ico`, `/robots.txt`).
*   `router.02.views.js`: Controladores para entregar el SPA web o las vistas de frontend (accede a `/`, `/login`, vistas de administrador, de olvido de correos, acuerdos legales, etc.).
*   `router.03.user.js`: Núcleo de operaciones de la API para usuarios (creación de cuenta, login, logout, activación, recargo de contraseñas, olvidó de clave, etc).
*   `router.04.admin.js`: Servicios exclusivos para los roles de `root` o `admin`. Manejo total sobre las identidades: creación arbitraria, listado total, trackers y conteos demográficos del uso del software.
*   `router.05.google.js`: Endpoints y callbacks dedicados a la autorización delegada vía OAuth2 con Google y pruebas de envío de comunicaciones de los servicios APIs de este.

## 3. Lógica de N-Capas (`/backend/lib/`)
Con el fin de separar responsabilidades, un módulo en `lib/` (ej. `/backend/lib/03.user/`) implementa un patrón tradicional en capas que evita un fuerte acople, usualmente segmentado en:
*   **`controller.js`**: Capa de entrada, manipula fuertemente las solicitudes entrantes (`req`) y respuestas salientes (`res`). Extrae e inyecta parámetros hacia los servicios.
*   **`validator.js`**: Encargado de filtrar y validar las estructuras e integridad de datos enviadas antes de que entren a la capa comercial/negocio (mediado por `zod`).
*   **`service.js`**: Alberga la lógica de negocio, validaciones complejas de dominio y los orquestadores que invocan a la infraestructura o repositorios de datos de terceras librerías.
*   **`repository.js`**: Abstracción del sistema de almacenamiento o base de datos.
*   **`constants.js`**: Tipografías estandarizadas, mensajes de error y/o códigos devueltos para el mismo módulo.

## 4. Utilitarios Compartidos / Infraestructura Global
Finalmente ubicados en la raíz de `lib/`, se ubican utilitarios de propósito común y cross-domain que son consumidos transversalmente por todos los módulos citados arriba:

*   **`googleapis.js`**: Wrapper de funcionalidades para la integración de componentes con Google.
*   **`jwt.js` & `password.js`**: Lógica de encriptado y desencriptado, emisión de tokens y la capa de criptografía con `argon2` para hashes indescifrables de passwords en DB.
*   **`session.js`**: Comprobación constante e integridad de la vida del token, el usuario, si está activo y sus roles requeridos.
*   **`hooks.js`**: Ciclos de vida o escuchadores asíncronos que corren transversalmente para reaccionar o reportar comportamientos en la API global.
*   **`constants.js`**: Variables o strings absolutos globales.
