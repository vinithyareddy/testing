formatter: function () {
  const xLabel = String(this.x).replace('<br>', ' ');
  return `<b>${xLabel}</b><br/>` +
    this.points?.map((p: any) =>
      `${p.series.name}: ${p.y} (${p.percentage?.toFixed(0)}%)`
    ).join('<br/>');
}
