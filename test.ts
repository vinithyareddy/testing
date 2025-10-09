render: function () {
  const chart = this as any;

  // ✅ Guard against undefined
  if (!chart.series || chart.series.length === 0) return;

  const series = chart.series[0];
  if (!series || !series.points) return;

  const total = (series.points || []).reduce(
    (acc, p) => acc + ((p as any).y ?? 0),
    0
  );

  const cx = chart.plotLeft + chart.plotWidth / 2;
  const cy = chart.plotTop + chart.plotHeight / 2;


  accessibility: { enabled: false },
