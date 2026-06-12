# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

---

## Proyecto

**¿Puedo Pasar?** — utilidad web pública, visual y multilingüe que responde si la zona del Estadio Ciudad de México está bajo el "Operativo Última Milla" en un día dado. App efímera para el torneo internacional de fútbol de verano 2026. Sin auth, sin base de datos, sin persistencia de estado del usuario.

Desplegada en `puedopasar.hckr.mx` vía Vercel (auto-deploy en git push).

---

## Stack

- **Vite + React** — framework
- **Tailwind CSS** — estilos
- **Google Fonts** — tipografía
- **shadcn/ui** — componentes base
- **mapcn (MapLibre GL)** — mapa interactivo
- **TanStack Router** — routing
- **TanStack Query** — fetching / estado asíncrono
- **nuqs** — estado en URL (query params)
- **i18next + react-i18next** — i18n (es, en, fr, ja)

---

## Comandos

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Preview del build
pnpm preview

# Lint
pnpm lint
```

---

## Convenciones de código

### Archivos y exports
- Filenames: kebab-case (`weather-widget.jsx`, `use-weather.js`)
- `export const` para todo — `export default` solo en `app.jsx`
- Sin TypeScript, sin JSDoc, sin type annotations
- Variables `useRef` con prefijo `$` (e.g. `const $map = useRef(null)`)

### CSS y Tailwind
- **Siempre usar `cn()`** de `@/helpers/utils.js` para clases. Nunca template literals ni concatenación de strings para construir clases — Tailwind no puede escanear strings dinámicos y los purga.
- **Opacidad en texto**: `text-white/90`+ para labels principales, `text-white/70`+ secundarios, `text-white/50`+ hints. Por debajo de `/50` solo elementos decorativos/disabled.
- **Sin opacidad en iconos o texto**: nunca sufijos de opacidad en iconos/texto (e.g. `text-white/25`). Los iconos stroke tienen paths superpuestos — la transparencia crea artefactos visuales en las juntas. Usar colores sólidos de la paleta Tailwind (e.g. `text-zinc-500`).
- **Tamaño de iconos**: usar `[&>svg]:size-X` en el contenedor, nunca la prop `size` en Lucide.
- **Sizing cuadrado**: cuando `w-X` y `h-X` tienen el mismo valor, usar `size-X` (e.g. `w-4 h-4` → `size-4`). Excepción: clases de orientación condicional.
- **Unidades**: preferir `rem` sobre `px` en inline styles, CSS custom properties y CSS raw. `px` solo para valores que no deben escalar (e.g. bordes de 1px).
- **Escala Tailwind**: usar la escala built-in. Solo usar valores arbitrarios `[X]` cuando no haya equivalente en la escala.
- **Valores dinámicos de Tailwind**: pasar como CSS custom properties vía `style` y referenciar con sintaxis de variable de Tailwind. Ejemplo: `<div className="w-(--panel-width)" style={{ '--panel-width': '22.5rem' }} />`.
- **Sombras**: siempre acompañar un tamaño de sombra con color explícito — `shadow-lg shadow-black/30`. En Tailwind v4 las sombras no tienen color por defecto.

### Documentación
`AGENTS.md` y `CLAUDE.md` se mantienen en sincronía — mismo contenido, uno para otros asistentes IA y el otro para Claude Code. Al actualizar uno, aplicar los mismos cambios al otro. Las únicas diferencias intencionales son: el título, la línea de intro, y la auto-referencia en esta tabla (`AGENTS.md` vs `CLAUDE.md`).

---

## Fuente de datos

Los datos vienen de un JSON estático. No hay fetch a ninguna API en runtime:

```js
import statusData from '@/data/status.json';
```

El archivo `src/data/status.json` es generado por el pipeline IA → demon → git y **nunca se edita a mano**. El demon escribe aquí y hace git push → Vercel rebuilds → el JSON queda bundleado en el cliente. Para desarrollo local, usar los datos de ejemplo del plan (sección 5).

### Schema de `status.json`

```json
{
  "today": true,
  "dates": [
    { "date": "2026-06-11", "partialClosure": "23:00", "totalClosure": "05:00", "prevDay": true },
    { "date": "2026-06-17", "partialClosure": "10:00", "totalClosure": "14:00" }
  ],
  "affectedStreets": {
    "total": ["San Gabriel – Santa Úrsula", "..."],
    "partial": ["Acoxpa y Las Torres", "..."]
  },
  "perimeter": {
    "type": "Feature",
    "geometry": { "type": "Polygon", "coordinates": [[...]] },
    "properties": { "radiusKm": 1.6, "center": { "lat": 19.3029, "lng": -99.1505 } }
  },
  "lastChecked": "2026-06-11T08:00:00Z",
  "source": "https://ssc.cdmx.gob.mx/...",
  "confidence": "high",
  "fallback": false
}
```

---

## Arquitectura de la app

Single page con scroll. Sin rutas múltiples (TanStack Router se usa para query params vía nuqs, no para navegación entre páginas).

### Secciones (en orden)
1. **Hero** — respuesta principal SÍ/NO + CTA de geolocalización + indicador de proximidad
2. **MapCard** — mapa con polígono del perímetro y marker del usuario
3. **ClosureList** — lista de fechas con badges HOY / PASADO + horarios
4. **WhyClosed** — qué es el Operativo Última Milla y fuentes oficiales
5. **HowToPass** — guía por tipo de usuario (entrada, residente, trabajo/estudio, transporte público)
6. **Footer** — timestamp, fuente, badge de confianza, selector de idioma

### Lógica de proximidad (color coding)
Distancia haversine entre ubicación del usuario y centroide `19.3029, -99.1505`:

| Situación | Color |
|---|---|
| Dentro del perímetro | Rojo |
| < 500m del borde | Naranja |
| 500m – 1.5km del borde | Amarillo |
| > 1.5km del borde | Verde |

### Hooks y utilidades propias
```
src/hooks/
  useGeolocation.js     — solicita y devuelve coords del browser
  useProximity.js       — calcula distancia y nivel de afectación
src/lib/
  geo.js                — haversine distance, punto en polígono
```

### i18n
- Detección automática del idioma del browser, fallback: `es`
- `es` y `en` se escriben durante el desarrollo
- `fr` y `ja` se generan con IA una vez estables `es`/`en`
- Archivos en `src/locales/{lang}/translation.json`

---

## Terminología legal — OBLIGATORIO

> Research completado y verificado contra FIFA IP Guidelines (junio 2024, v2.0). Estas reglas aplican a **todo el copy**: JSX, strings de i18n, meta tags, OG tags, `<title>`, comentarios públicos.

### NUNCA usar
`FIFA`, `World Cup`, `World Cup 26`, `WC26`, `Copa Mundial`, `Copa Mundial de la FIFA`, `MUNDIAL`, `Coupe du Monde`, `COUPE DU MONDE`, logos/emblemas/mascota/tipografía oficial del torneo.

### Usar en su lugar
| Referencia | Copy seguro |
|---|---|
| El torneo | "el torneo", "el evento deportivo", "torneo internacional de fútbol" |
| Los partidos | "días de partido", "partido de fútbol" |
| El estadio | "Estadio Ciudad de México" o "Estadio Banorte" |
| El operativo | "Operativo Última Milla", "Polígono Última Milla" |
| Fuentes | "SSC CDMX", "Alcaldía Coyoacán", "SEMOVI" |

La app califica como uso editorial/descriptivo (sección A3 de las guidelines) porque informa sobre un operativo **gubernamental**, no sobre el torneo.
