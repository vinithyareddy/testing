import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

type Row = { grade: string; amount: number };

@Component({
  selector: 'app-avg-labor-cost-grade',
  templateUrl: './avg-labor-cost-grade.component.html',
  styleUrls: ['./avg-labor-cost-grade.component.scss']
})
export class AvgLaborCostGradeComponent {

  Highcharts: typeof Highcharts = Highcharts;

  // Dummy values (drives chart automatically)
  data: Row[] = [
    { grade: 'GI', amount: 400 },
    { grade: 'GH', amount: 330 },
    { grade: 'GG', amount: 220 },
    { grade: 'GF', amount: 150 },
    { grade: 'GE', amount: 76 }
  ];

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar'
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },

    xAxis: {
      categories: this.data.map(d => d.grade),
      title: {
        text: 'Grades',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      labels: { style: { color: '#111827', fontWeight: '600', fontSize: '12px' } },
      lineWidth: 0
    },

    yAxis: {
      min: 0,
      tickInterval: 50,
      title: {
        text: 'Amount (in millions)',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },

    plotOptions: {
      bar: {
        borderWidth: 0,
        pointPadding: 0.1,
        dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
      }
    },

    series: [{
      type: 'bar',
      name: 'Amount',
      color: '#6c63ff',  // purple like your screenshot
      data: this.data.map(d => d.amount)
    }]
  };
}
