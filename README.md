# ¿Puedo Pasar?

Utilidad web pública, visual y multilingüe que responde si la zona del **Estadio Ciudad de México** está bajo el **Operativo Última Milla** en un día dado.

App efímera para el torneo internacional de fútbol de verano 2026. Sin auth, sin base de datos, sin persistencia de estado del usuario.

**Sitio en vivo:** [puedopasar.hckr.mx](https://puedopasar.hckr.mx)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vite + React 19 |
| Estilos | Tailwind CSS v4 |
| Mapa | MapLibre GL |
| Routing / Estado URL | TanStack Router + nuqs |
| Datos asíncronos | TanStack Query |
| i18n | i18next + react-i18next |
| Componentes base | shadcn/ui |
| Deploy | Vercel (auto-deploy en git push) |

---

## Comandos

```bash
pnpm dev        # Servidor de desarrollo
pnpm build      # Build de producción
pnpm preview    # Preview del build
pnpm lint       # Lint
```

---

## Arquitectura

Single page con scroll. TanStack Router se usa para estado en query params (vía nuqs), no para navegación entre páginas.

### Secciones (en orden)

1. **Hero** — respuesta principal SÍ/NO + CTA de geolocalización + indicador de proximidad
2. **MapCard** — mapa con polígono del perímetro y marker del usuario
3. **ClosureList** — lista de fechas con badges HOY / PASADO + horarios
4. **WhyClosed** — qué es el Operativo Última Milla y fuentes oficiales
5. **HowToPass** — guía por tipo de usuario (portador de entrada, residente, trabajo/estudio, transporte público)
6. **Footer** — timestamp, fuente, badge de confianza, selector de idioma

### Lógica de proximidad

Distancia haversine entre la ubicación del usuario y el centroide `19.3029, -99.1505`:

| Situación | Color |
|---|---|
| Dentro del perímetro | Rojo |
| < 500 m del borde | Naranja |
| 500 m – 1.5 km del borde | Amarillo |
| > 1.5 km del borde | Verde |

---

## Fuente de datos

Los datos vienen de un JSON estático — no hay fetch a ninguna API en runtime:

```js
import statusData from '@/data/status.json';
```

`src/data/status.json` es generado por un pipeline IA → daemon → git push. **Nunca se edita a mano.** El daemon escribe aquí, hace push, Vercel rebuilds, y el JSON queda bundleado en el cliente.

### Schema de `status.json`

```json
{
  "today": true,
  "dates": [
    { "date": "2026-06-17", "partialClosure": "10:00", "totalClosure": "14:00" },
    { "date": "2026-06-11", "partialClosure": "23:00", "totalClosure": "05:00", "prevDay": true }
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

## Estructura del proyecto

```
src/
├── app.jsx               # Raíz de la app, orquesta secciones y estado global
├── main.jsx              # Entry point
├── i18n.js               # Configuración de i18next
├── index.css             # Estilos globales + variables CSS
│
├── components/           # Secciones de la página
│   ├── hero.jsx
│   ├── map-card.jsx
│   ├── closure-list.jsx
│   ├── streets-list.jsx
│   ├── why-closed.jsx
│   ├── how-to-pass.jsx
│   ├── relief-card.jsx
│   └── footer.jsx
│
├── hooks/
│   ├── use-geolocation.js    # Browser geolocation API
│   ├── use-proximity.js      # Distancia haversine + nivel de afectación
│   ├── use-settings.js       # Persistencia de settings
│   └── use-ntfy.js           # Integración con servicio de notificaciones
│
├── helpers/
│   ├── geo.js                # Haversine, punto en polígono
│   ├── closure.js            # Lógica de estado de cierre
│   └── utils.js              # cn() y utilidades generales
│
├── services/
│   ├── settings.js           # Servicio de settings + devtools
│   └── ntfy.js               # Cliente ntfy
│
├── data/
│   └── status.json           # Datos de cierres (generado por daemon)
│
├── locales/
│   ├── es.json               # Español (fuente de verdad)
│   ├── en.json               # Inglés
│   ├── fr.json               # Francés (generado con IA)
│   └── ja.json               # Japonés (generado con IA)
│
└── ui/
    ├── icons.jsx             # Iconos custom
    └── map.jsx               # Wrapper de MapLibre
```

---

## i18n

Detección automática del idioma del browser, fallback: `es`. Los strings de `es` y `en` se escriben a mano; `fr` y `ja` se generan con IA una vez que `es`/`en` están estables.

---

## Variables de entorno

```bash
# .env.example
VITE_UMAMI_WEBSITE_ID=   # Analytics Umami (opcional)
VITE_UMAMI_URL=          # URL de la instancia Umami (opcional)
VITE_NTFY_URL=           # Endpoint ntfy para notificaciones (opcional)
```

---

## Terminología — aviso legal

Este proyecto **no usa** nombres, logos ni términos registrados de FIFA. Todo el copy hace referencia al operativo gubernamental, no al torneo:

| En lugar de… | Usar… |
|---|---|
| FIFA / World Cup / Copa Mundial | "el torneo", "el evento deportivo" |
| Los partidos | "días de partido", "partido de fútbol" |
| El estadio | "Estadio Ciudad de México" / "Estadio Banorte" |

La app califica como uso editorial/descriptivo (§A3 FIFA IP Guidelines) porque informa sobre un operativo **gubernamental**.

---

## Licencia

[MIT](LICENSE)
