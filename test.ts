series: [{
  type: 'column',
  name: 'Amount',
  pointWidth: 28,
  data: this.data.map((d, i) => ({
    name: d.position,
    y: d.amount,
    dataLabels: i === 0 ? { // special style for first bar
      enabled: true,
      verticalAlign: 'bottom',
      align: 'center',
      y: -6,
      style: { fontWeight: '700', color: '#111827' }
    } : {}
  })),
  dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
}]


.viewmore {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0b6cbf;
  font-weight: 600;
  margin-top: 20px;  /* was 10px, increase spacing */
  cursor: pointer;
}


<div class="chart-nav">
  <button class="arrow left"><i class="fa fa-chevron-left"></i></button>
  <button class="arrow right"><i class="fa fa-chevron-right"></i></button>
</div>


.chart-nav {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none; /* arrows float over chart */
}

.chart-nav .arrow {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
  pointer-events: all; /* clickable again */
}
