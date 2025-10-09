ngOnInit(): void {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    this.apiService.getWidgetData(this.widgetId).subscribe((genders: any) => {
      if (genders.length > 0) {
        // Sum up FTE values by gender category
        const totals = genders.reduce((acc: Record<string, number>, curr: SwfpFteByGender) => {
          acc[curr.category] = (acc[curr.category || ""] || 0) + curr.fte as number;
          return acc;
        }, {});

        // Map to genderData array with colors
        this.genderData = Object.entries(totals).map(([category, fte]) => ({
          category,
          fte: fte as any,
          color: (category?.toLowerCase().includes("female")) ? "#aedcfa" : "#34a7f2"
        })).sort(function (a, b) {
          return b.category.localeCompare(a.category);
        });
      }
      this.onInitLoad(this.genderData);
    });
  });
}

onInitLoad(data: any[]): void {
  const totalCount = data.reduce((acc, cur) => acc + cur.fte, 0);

  this.chartOptions = {
    chart: {
      type: 'pie',
      events: {
        render: function () {
          const chart = this as any;
          const genderSeries = chart.series[0] as Highcharts.Series;
          const totalCount = (genderSeries.points || []).reduce((acc, point) => acc + ((point as any).y ?? 0), 0);
          const cx = chart.plotLeft + chart.plotWidth / 2;
          const cy = chart.plotTop + chart.plotHeight / 2;

          if (!(chart.centerValueText)) {
            chart.centerValueText = chart.renderer
              .text(String(totalCount), cx, cy - 6)
              .css({ fontSize: '26px', fontWeight: '700' })
              .attr({ align: 'center' })
              .add();
            chart.centerSubtitleText = chart.renderer
              .text('By Gender', cx, cy + 14)
              .css({ fontSize: '14px', fontWeight: '500' })
              .attr({ align: 'center' })
              .add();
          } else {
            chart.centerValueText.attr({ text: String(totalCount), x: cx, y: cy - 6 });
            chart.centerSubtitleText.attr({ text: 'By Gender', x: cx, y: cy + 14 });
          }
        }
      }
    } as any,
    colors: ['#34a7f2', '#aedcfa'],
    title: { text: '' },
    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)'
    },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '85%',
        showInLegend: true,
        dataLabels: {
          distance: 7,
          softConnector: true,
          crop: true,
          enabled: true,
          formatter: function () {
            const pct = Highcharts.numberFormat((this.percentage as number) || 0, 0);
            return `${this.y} (${pct}%)`;
          },
          style: { textoutline: 'none', fontWeight: '500' }
        }
      }
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      itemMarginTop: 5,
      itemMarginBottom: 5,
      layout: 'vertical',
      itemStyle: { textoutline: 'none', fontWeight: '500', fontSize: '13px' },
      useHTML: true,
      labelFormatter: function () {
        const point = this as unknown as Highcharts.Point;
        const pct = Highcharts.numberFormat((point.percentage as number) || 0, 0);
        return `<span class="hc-legend-row">
          <span class="hc-legend-left">
            <span class="hc-legend-marker" style="background:${point.color}"></span>
            <span class="hc-legend-name">${point.name}</span>
          </span>
          <span class="hc-legend-right">${point.y} (${pct}%)</span>
        </span>`;
      }
    },
    series: [{
      type: 'pie',
      name: 'Gender',
      size: '90%',
      data: data.map(d => ({ name: d.category, y: d.fte, color: d.color }))
    }]
  };
}



get totalCount(): number {
  return this.genderData.reduce((acc, cur) => acc + (cur.fte || 0), 0);
}