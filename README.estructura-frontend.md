# Análisis de Estructura y Funcionalidad del Frontend

## 1. Visión General
El frontend utiliza un sistema de plantillas basado en etiquetas personalizadas (ej. `<!--define:xxx-->`) que permite la composición dinámica de páginas. La base de todas las vistas reside en `main.html`, que define la estructura HTML5, importa las dependencias críticas (Bootstrap, Vue.js, FontAwesome) y establece el punto de montaje para la aplicación reactiva.

## 2. Motor de Visualización (Templating)
El sistema emplea un motor de renderizado propio que permite:
*   **Herencia de Plantillas**: `<!--use:main-->` indica que el archivo actual rellena los huecos definidos en `main.html`.
*   **Definiciones y Placeholders**: `<!--define:title-->`, `<!--define:main-->`, `<!--define:script-->`, etc., permiten inyectar contenido en secciones específicas.
*   **Lógica en Plantilla**: Soporte para condicionales `<!--if:...-->` y carga de fragmentos con `<!--include:xxx-->`.
*   **Inyección de Datos**: Uso de `{{data:xxx}}` para imprimir variables del entorno o del objeto `doc` enviado desde el backend.

## 3. Tipos de Vistas y Flujo de Datos

*   **Tecnología**: Hace uso intensivo de **Vue.js** para el manejo del DOM.
*   **Estructura**:
    *   `_.html`: Define vista del modulo
    *   `_.js`: Define una "clase" u objeto de módulo que se registra en `app.modules.object`. Este objeto gestiona el estado de los datos y la comunicación con la API.

## 4. Componentes y Recursos Globales
*   `header.html`, `menu.html`, `message.html`: Fragmentos reutilizables en diferentes contextos de la aplicación.
*   `main.html`: El esqueleto global.
*   `controladorV.js`: (Cargado en `main.html`) el orquestador que inicializa Vue y monta el módulo JS correspondiente a la vista actual.
*   `global.js`: Contiene utilidades transversales.
