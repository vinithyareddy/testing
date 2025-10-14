plotOptions: {
    column: {
        // pointPadding: 0.35,
        //  borderWidth: 2,
        stacking: ChartOptions.stackingType || 'percent',
        pointWidth: 25,
        dataLabels: {
            enabled: ChartOptions.dataLabelEnable || false,
            inside: ChartOptions.dataLabelInside || false,
            style: {
                fontWeight: '600',
                textOutline: 'none',
                color: ChartOptions.dataLabelColor || '#000000'
            },
            formatter: function() {
                if (ChartOptions.stackingType === 'percent') {
                    return this.percentage ? Math.round(this.percentage) + '%' : '';
                }
                return this.y;
            }
        }
    }
},