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
      // Insert heading before the first legend item
      if (this.index === 0) {
        return '<span style="font-weight:600;color:#051223;margin-right:8px;">Proficiency Level:</span>' +
               '<span style="vertical-align:middle;">' + this.name + '</span>';
      }
      return this.name;
    },
    title: {
      text: '' // keep blank to avoid stacking
    },
    events: {
      itemClick: function (event: any) {
        event.preventDefault();
      }
    },
    // Adjust margins to keep alignment consistent
    padding: 0,
    margin: 10
  }
  