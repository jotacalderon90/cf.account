# Análisis de Estructura y Funcionalidad del Backend

## 1. Visión General
El proyecto funciona bajo un enfoque altamente modular y guiado por convenciones utilizando el marco dinámico propio **`cl.jotacalderon.cf.framework`**. El punto de entrada principal (`app.js`) es extremadamente simplificado (consta de casi una sola línea) encargándose de invocar al empaquetador subyacente que se ocupa de registrar automáticamente las rutas y módulos situados en la carpeta `backend`.

## 2. Definición de Rutas (`/backend/`)
Los endpoints y servicios disponibles se declaran de forma ordenada en archivos nombrados bajo un índice numérico (`router.NN.<modulo>.js`). Estos ficheros actúan como manifestos de rutas, utilizando tags de `@swagger` para configurar ruta, métodos y roles, garantizando documentación estándar integrada.

## 3. Lógica de N-Capas (`/backend/lib/`)
Con el fin de separar responsabilidades, un módulo en `lib/` (ej. `/backend/lib/*/`) implementa un patrón tradicional en capas que evita un fuerte acople, usualmente segmentado en:
*   **`controller.js`**: Capa de entrada, manipula fuertemente las solicitudes entrantes (`req`) y respuestas salientes (`res`). Extrae e inyecta parámetros hacia los servicios.
*   **`constants.js`**: Tipografías estandarizadas, mensajes de error y/o códigos devueltos para el mismo módulo.
*   **`validator.js`**: Encargado de filtrar y validar las estructuras e integridad de datos enviadas antes de que entren a la capa comercial/negocio (mediado por `zod`).
*   **`service.js`**: Alberga la lógica de negocio, validaciones complejas de dominio y los orquestadores que invocan a la infraestructura o repositorios de datos de terceras librerías.
*   **`repository.js`**: Abstracción del sistema de almacenamiento o base de datos.

## 4. Utilitarios Compartidos / Infraestructura Global
Finalmente ubicados en la raíz de `lib/`, se ubican utilitarios de propósito común y cross-domain que son consumidos transversalmente por todos los módulos citados arriba:

*   **`constants.js`**: Variables o strings absolutos globales.
