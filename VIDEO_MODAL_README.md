# Modal de Video de Bienvenida

## Descripción
Se ha agregado un modal de video que aparece automáticamente cuando los usuarios entran al sitio web. El modal incluye controles para minimizar, cerrar y restaurar el video.

## Características
- ✅ Aparece automáticamente 1 segundo después de cargar la página
- ✅ Video con controles nativos (play, pause, volumen, etc.)
- ✅ Botón para minimizar el modal
- ✅ Botón para cerrar completamente el modal
- ✅ Modal minimizado que flota en la esquina inferior derecha
- ✅ Botón para restaurar el video desde el estado minimizado
- ✅ Cierre con tecla Escape
- ✅ Cierre al hacer clic fuera del modal
- ✅ Diseño responsive para móviles
- ✅ Animaciones suaves y modernas

## Configuración del Video

### 1. Agregar tu video
Coloca tu archivo de video en la carpeta `public/videos/` con el nombre `video2.mp4`.

### 2. Cambiar la ruta del video
Si quieres usar un video diferente, edita el archivo `src/components/VideoModal.astro` y cambia las rutas en estas líneas:

```html
<source src="/videos/tu-video.mp4" type="video/mp4">
```

### 3. Personalizar el título
Cambia el título del modal editando esta línea en `VideoModal.astro`:

```html
<h3 class="video-modal-title">Tu Título Personalizado</h3>
```

## Personalización

### Cambiar el delay de aparición
Para cambiar cuándo aparece el modal, modifica el valor en milisegundos:

```javascript
setTimeout(() => {
  modal?.classList.add('show');
}, 1000); // Cambia 1000 por el valor deseado
```

### Desactivar autoplay
Para que el video no se reproduzca automáticamente, quita el atributo `autoplay`:

```html
<video id="modalVideo" controls muted>
```

### Cambiar colores
Los colores del modal se pueden personalizar en la sección de estilos. El gradiente principal está definido aquí:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Archivos Modificados
- ✅ `src/components/VideoModal.astro` - Componente del modal (nuevo)
- ✅ `src/layouts/Layout.astro` - Layout principal (modificado para incluir el modal)

## Uso
El modal aparecerá automáticamente en todas las páginas que usen el layout principal (`Layout.astro`). No requiere configuración adicional.

## Formatos de Video Recomendados
- **MP4**: Mejor compatibilidad general
- **Resolución recomendada**: 1280x720 (720p) o 1920x1080 (1080p)
- **Duración recomendada**: 30-60 segundos para videos de bienvenida

## Notas Técnicas
- El modal usa `z-index: 9999` para aparecer sobre todo el contenido
- El video se pausa automáticamente cuando se minimiza o cierra
- El modal es completamente responsive y se adapta a dispositivos móviles
- Usa `backdrop-filter` para el efecto de desenfoque del fondo