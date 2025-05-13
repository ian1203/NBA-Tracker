# 🏀 NBA Tracker — Módulos de Visualización

Este proyecto incluye componentes interactivos para comparar estadísticas de jugadores de la NBA mediante:

- **Gráficos de dispersión (Scatter Plot)** usando **Plotly**
- **Gráficos de radar (Radar Chart)** usando **Recharts**

Ambos componentes son parte de la aplicación **NBA Tracker**, construida con React en el frontend y FastAPI en el backend.

---

## 📁 Archivos principales

- `ScatterPlot.jsx`: Módulo para graficar comparaciones entre dos estadísticas numéricas.
- `CompareChart.jsx`: Módulo para comparar múltiples estadísticas mediante gráficos de radar.

---

## 🔧 Tecnologías utilizadas

- **React**: UI del proyecto.
- **Plotly.js** y `react-plotly.js`: Para los gráficos de dispersión.
- **Recharts**: Para los gráficos tipo radar.
- **TailwindCSS**: Estilos y soporte a modo oscuro.
- **Axios**: Llamadas al backend.
- **FastAPI**: Servidor Python para obtener datos estadísticos.

---

## 🧩 ScatterPlot.jsx — Estructura y características

### 🔹 Estructura

```plaintext
ScatterPlot.jsx
│
├── useEffect / useState
│   ├── Llama a /scatter_data
│   ├── Filtra jugadores duplicados
│   ├── Detecta modo oscuro
│
├── plotOptions
│   ├── Usage % vs Turnover %
│   ├── 3P Attempt Rate vs TS%
│   └── ORB vs DRB
│
├── getPlottedData()
│   └── Filtra y da formato a los datos
│
└── JSX Render
    ├── Selector de estadísticas
    ├── Selector de jugadores
    └── Plotly plot
```

### 🔹 Características

- Interacción tipo hover con etiquetas informativas.
- Modo oscuro automático.
- Botones visibles: `zoom in`, `zoom out`, `pan`.
- Datos de jugadores filtrados y deduplicados.
- Estadísticas transformadas al 100% cuando aplicable (ej. `ts_pct`).
- Totalmente responsivo y estilizado con Tailwind.

### 🔹 Endpoint esperado

```bash
GET http://localhost:8000/scatter_data
```

```json
[
  {
    "player": "LeBron James",
    "usg_pct": 32.1,
    "tov": 13.2,
    "ts_pct": 0.618,
    "threepar": 0.293,
    "orb": 2.1,
    "drb": 6.8
  }
]
```

---

## 🧩 CompareChart.jsx — Radar Chart de estadísticas

### 🔹 Estructura

```plaintext
CompareChart.jsx
│
├── Props: jugadores con sus estadísticas (normalizadas)
│
├── Uso de RadarChart de Recharts
│   ├── Radar por jugador
│   ├── Ejes polares
│   └── Leyenda y fondo responsivo
│
└── Mapeo de posiciones (PG, SG...) y equipos
```

### 🔹 Características

- Comparación entre múltiples jugadores (mínimo 2).
- Cada jugador se representa con un polígono de color distinto.
- Datos normalizados (0–100) para que todas las métricas sean comparables.
- Adaptado a **modo oscuro**: fondo y texto legibles.
- Etiquetas traducidas para mayor claridad.

---

## ✅ Reglas de filtrado y procesamiento

- Jugadores duplicados se filtran por nombre: se prioriza `"2TM"` y `"3TM"` si existen.
- Se limita el número de jugadores a mostrar (configurable).
- Las estadísticas como `ts_pct` y `threepar` se escalan al 100% solo en scatter plots.

---

## 🖼️ Modo oscuro y personalización

- Ambos componentes detectan automáticamente el modo `dark` desde Tailwind.
- Colores de texto, fondo, puntos y etiquetas cambian dinámicamente.
- Estilo unificado con el resto de la app para experiencia visual coherente.

---

## 📌 Notas importantes

- El backend debe estar activo en `http://localhost:8000`.
- Las estadísticas están predefinidas, pero es posible escalar la app para permitir personalización dinámica.
- La UI está adaptada para pantallas móviles y de escritorio.

---


## 🔗 Dependencias necesarias

```bash
npm install axios react-plotly.js plotly.js recharts
```

---
