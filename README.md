{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Rotating globe showing country regions",
  "width": 600,
  "height": 600,
  "projection": {
    "type": "orthographic",
    "rotate": [100, -30],
    "scale": 250
  },
  "layer": [
    {
      "data": {
        "url": "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json",
        "format": {
          "type": "geojson"
        }
      },
      "mark": {
        "type": "geoshape",
        "fill": "#eeeeee",
        "stroke": "#aaaaaa"
      }
    },
    {
      "data": {
        "name": "dataset"
      },
      "transform": [
        {
          "lookup": "Country",
          "from": {
            "data": {
              "name": "dataset"
            },
            "key": "Country",
            "fields": ["Color", "Region"]
          }
        }
      ],
      "mark": {
        "type": "circle",
        "size": 50,
        "opacity": 1
      },
      "encoding": {
        "longitude": { "field": "Longitude", "type": "quantitative" },
        "latitude": { "field": "Latitude", "type": "quantitative" },
        "color": {
          "field": "Color",
          "type": "nominal",
          "scale": null
        },
        "tooltip": [
          { "field": "Country", "type": "nominal" },
          { "field": "Region", "type": "nominal" }
        ]
      }
    }
  ]
}
