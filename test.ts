legend: {
    enabled: true,
    align: 'center',
    layout: 'horizontal',
    verticalAlign: 'bottom',
    useHTML: true,
    symbolPadding: 5,
    itemDistance: 20,
    itemStyle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#051223'
    },
    labelFormatter: function () {
      // ✅ Add the prefix before the FIRST legend bullet instead of after
      if (this.index === 0) {
        return '<span style="font-weight:600;color:#051223;margin-right:6px;">Proficiency Level:</span>' +
               '<span style="vertical-align:middle;">&#9679;&nbsp;' + this.name + '</span>';
      }
      // For all other legend items, show normal bullet and name
      return '&#9679;&nbsp;' + this.name;
    },
    events: {
      itemClick: function (event: any) {
        event.preventDefault();
      }
    }
  }
  