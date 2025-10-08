import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { LiftPopoverComponent } from '@lift/ui';
import { MockDataService } from 'app/services/mock-data.service';

@Component({
  selector: 'app-swfp-by-gender',
  templateUrl: './swfp-by-gender.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule, LiftPopoverComponent],
  styleUrls: ['./swfp-by-gender.component.scss']
})
export class SwfpByGenderComponent implements OnInit {
  fullview = false;
  widgetType = 'ch';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  genderData: any[] = [];

  constructor(private render: Renderer2, private mockService: MockDataService) {}

  ngOnInit(): void {
    // ✅ Load data dynamically from JSON
    this.mockService.getWorkforceByGender().subscribe((data: any[]) => {
      console.log('Gender JSON:', data);
      this.genderData = data.map((item) => ({
        name: item.name,
        y: Number(item.value)
      }));
      this.loadChart();
    });
  }

  loadWidget(type: string) {
    this.widgetType = type;
    this.loadChart();
  }

  loadChart(): void {
    if (!this.genderData || this.genderData.length === 0) return;

    const totalCount = this.genderData.reduce((sum, item) => sum + item.y, 0);

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacingTop: 20,
        spacingBottom: 20,
        spacingLeft: 40,
        spacingRight: 50
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        y: -10,
        text: `<span style="font-size:30px; font-weight:bold">${totalCount}</span><br/><span style="font-size:12px">By Gender</span>`
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)'
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',       // donut
          borderRadius: 0,
          showInLegend: true,     // ✅ restores your original legend
          dataLabels: {
            enabled: true,
            distance: 5,
            format: '{point.y} ({point.percentage:.0f}%)',
            crop: false,
            overflow: 'allow'
          },
          startAngle: 0,
          endAngle: 360,
          center: ['50%', '50%'],
          size: '120%'
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          fontSize: '12px',
          color: '#333'
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Gender',
          data: this.genderData
        }
      ]
    };
  }

  fullPageView() {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}
