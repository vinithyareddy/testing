legend: {
    enabled: true,
    align: 'center',
    layout: 'horizontal',
    verticalAlign: 'bottom',
    itemStyle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#051223'
    },
    symbolPadding: 5,
    itemDistance: 20,
    labelFormatter: function () {
      if (this.index === 0) {
        return '<span style="font-weight:600;color:#051223;margin-right:6px;">Proficiency Level:</span>' + this.name;
      }
      return this.name;
    },
    useHTML: true,
    events: {
      itemClick: function (event: any) {
        event.preventDefault();
      }
    }
  }
  