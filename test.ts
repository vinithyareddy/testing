const coords: [number, number] = o.coords as [number, number];
const p = this.projection(coords);
if (!p || !this.isPointVisible(coords)) return;
