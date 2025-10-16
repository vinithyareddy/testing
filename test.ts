.style('display', this.isPointVisible(d.centroid) ? 'block' : 'none');


private isPointVisible(coord: [number, number]): boolean {
    const gdistance = d3.geoDistance(coord, [-this.currentRotation[0], -this.currentRotation[1]]);
    return gdistance < Math.PI / 2; // visible if on front hemisphere
  }
  