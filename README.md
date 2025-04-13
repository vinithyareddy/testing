{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Basic placeholder while globe is being configured",
  "data": {
    "name": "dataset"
  },
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "Country",
      "type": "nominal",
      "axis": {"labelAngle": 0}
    },
    "y": {
      "field": "Region",
      "type": "nominal"
    },
    "color": {
      "field": "Region",
      "type": "nominal"
    },
    "tooltip": [
      {"field": "Country", "type": "nominal"},
      {"field": "Region", "type": "nominal"}
    ]
  }
}
