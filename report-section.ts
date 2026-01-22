/** REGION heatmap dummy data (0–100) */
regionHeatmapData: number[][] = [
  [39,34,48,20,30,45,50,39],
  [50,40,24,4,22,45,24,13],
  [1,4,6,48,15,0,11,7],
  [39,34,48,20,30,45,50,39],
  [50,40,24,4,22,45,24,13],
  [10,21,22,27,33,10,35,40],
  [39,34,48,20,30,45,50,39],
  [1,4,6,48,15,0,11,7],
  [50,40,24,4,22,45,24,13],
  [39,34,48,20,30,45,50,39],
  [10,21,22,27,33,10,35,40],
  [1,4,6,48,15,0,11,7],
  [50,40,24,4,22,45,24,13],
  [1,4,6,48,15,0,11,7],
  [39,34,48,20,30,45,50,39],
  [1,4,6,48,15,0,11,7]
];

/** Heatmap color calculation */
getHeatmapColor(value: number): string {
  const min = 0;
  const max = 100;
  const ratio = (value - min) / (max - min);

  const start = { r: 232, g: 244, b: 251 }; // light blue
  const end = { r: 30, g: 136, b: 229 };   // dark blue

  const r = Math.round(start.r + ratio * (end.r - start.r));
  const g = Math.round(start.g + ratio * (end.g - start.g));
  const b = Math.round(start.b + ratio * (end.b - start.b));

  return `rgb(${r}, ${g}, ${b})`;
}
