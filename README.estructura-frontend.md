# Análisis de Estructura y Funcionalidad del Frontend (`cf.account`)

## 1. Visión General
El frontend utiliza un sistema de plantillas basado en etiquetas personalizadas (ej. `<!--define:xxx-->`) que permite la composición dinámica de páginas. La base de todas las vistas reside en `main.html`, que define la estructura HTML5, importa las dependencias críticas (Bootstrap, Vue.js, FontAwesome) y establece el punto de montaje para la aplicación reactiva.

## 2. Motor de Visualización (Templating)
El sistema emplea un motor de renderizado propio que permite:
*   **Herencia de Plantillas**: `<!--use:main-->` indica que el archivo actual rellena los huecos definidos en `main.html`.
*   **Definiciones y Placeholders**: `<!--define:title-->`, `<!--define:main-->`, `<!--define:script-->`, etc., permiten inyectar contenido en secciones específicas.
*   **Lógica en Plantilla**: Soporte para condicionales `<!--if:...-->` y carga de fragmentos con `<!--include:xxx-->`.
*   **Inyección de Datos**: Uso de `{{data:xxx}}` para imprimir variables del entorno o del objeto `doc` enviado desde el backend.

## 3. Tipos de Vistas y Flujo de Datos

Existen tres patrones distintos en la generación de interfaces dentro de la carpeta `frontend/account/`:

### A. Vistas de Flujo de Autenticación (`login`, `forget`, `recovery`)
Archivos como `03.login/_.html` son predominantemente estáticos con lógica de servidor inyectada.
*   **Mecanismo**: Formularios HTML tradicionales (`<form method="POST">`).
*   **Características**: Integración directa con servicios externos (Google reCAPTCHA v2) y parámetros de redirección dinámicos (`redirectTo`). 
*   **Lógica**: Dependen casi exclusivamente de la respuesta del servidor para redireccionar o mostrar mensajes de error.

### B. Vista de Perfil (`01.perfil`)
Representa un híbrido entre vista estática y dinámica.
*   **Mecanismo**: Envía cambios vía POST (botón `UPDATE`), pero utiliza un pequeño script JS (`_.js`) para helpers de interfaz como la verificación de roles (`hasRole`).
*   **Composición**: Incluye componentes comunes como `header`.

### C. Dashboard de Administración (`admin`)
Es la sección más compleja y puramente reactiva.
*   **Tecnología**: Hace uso intensivo de **Vue.js** para el manejo del DOM.
*   **Estructura**:
    *   `_.html`: Define la tabla de usuarios, filtros por roles (dropdowns reactivos) y acciones (botones con `v-on:click`).
    *   `_.js`: Define una "clase" u objeto de módulo que se registra en `app.modules.object`. Este objeto gestiona el estado de la colección (`this.coll`), la paginación y la comunicación con la API mediante `createService`.
*   **Integración de Promesas**: Utiliza componentes como `promise/prompt.html` para generar cuadros de diálogo (inputs) asíncronos y limpios sin salir de la página actual.

## 4. Componentes y Recursos Globales
*   `header.html`, `menu.html`, `message.html`: Fragmentos reutilizables en diferentes contextos de la aplicación.
*   `main.html`: El esqueleto global.
*   `controladorV.js`: (Cargado en `main.html`) Probablemente el orquestador que inicializa Vue y monta el módulo JS correspondiente a la vista actual.
*   `global.js`: Contiene utilidades transversales como el creador de servicios API.
