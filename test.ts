.attr('d', (d: any) => this.path(d as d3.GeoPermissibleObjects)!)


const equator: GeoJSON.LineString = {
    type: 'LineString',
    coordinates: d3.range(-180, 181, 1).map((lon): [number, number] => [lon, 0])
  };

  
  const coords: [number, number] = o.coords as [number, number];
const p = this.projection(coords);
