formatter: function () {
  const color = this.series.name === 'Build' ? '#fff' : '#000';
  return this.percentage ? `<span style="color:${color}">${Math.round(this.percentage)}%</span>` : '';
},
style: { fontSize: '10px', textOutline: 'none' }
}