legend: {
    enabled: true,
    align: 'center',
    layout: 'horizontal',
    verticalAlign: 'bottom',
    title: {
      text: 'Proficiency Level:',
      style: {
        fontWeight: '600',
        fontSize: '13px',
        color: '#051223',
        padding: 8
      }
    },
    itemStyle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#051223'
    },
    symbolPadding: 5,
    margin: 10,
    itemDistance: 20,
    events: {
      itemClick: function (event: any) {
        event.preventDefault(); // keep legend static
      }
    }
  }
  