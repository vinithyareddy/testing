import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MockDataService } from 'app/services/mock-data.service';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent, HighchartsChartModule],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  fullview = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartData: any[] = [];

  constructor(private render: Renderer2, private mockService: MockDataService) {}

  ngOnInit() {
    // ✅ Load data from JSON instead of static
    this.mockService.getSkillSupplyProficiency().subscribe((data: any[]) => {
      console.log('Skill Supply JSON:', data);
      this.chartData = data.map((d: any) => ({
        proficiency: d.proficiency,
        fte: Number(d.fte)
      }));
      this.loadChart();
    });
  }

  loadChart() {
    if (!this.chartData || this.chartData.length === 0) return;

    this.chartOptions = {
      chart: {
        type: 'bar', // keep your original look if it was bar
        backgroundColor: 'transparent'
      },
      title: { text: 'Skill Supply by Volume (FTE) and Proficiency Level' },
      credits: { enabled: false },
      xAxis: {
        categories: this.chartData.map(d => d.proficiency),
        title: { text: 'Proficiency Level' },
        labels: { style: { color: '#444' } }
      },
      yAxis: {
        min: 0,
        title: { text: 'FTE Count' },
        labels: { style: { color: '#444' } }
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{y}',
            color: '#222'
          }
        }
      },
      series: [
        {
          type: 'bar',
          name: 'FTE',
          data: this.chartData.map(d => d.fte),
          colorByPoint: true,
          colors: ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF']
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

    const total = this.genderData.reduce((sum, d) => sum + d.y, 0);

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacingTop: 10,
        spacingBottom: 10
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        text: `<span style="font-size:30px;font-weight:bold">${total}</span><br/><span style="font-size:12px">By Gender</span>`
      },
      tooltip: { pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)' },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          borderWidth: 0,
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: 5,
            format: '{point.name}: {point.y}',
            style: { fontSize: '12px' }
          },
          ...(this.widgetType === 'ch'
            ? { startAngle: -90, endAngle: 90, center: ['50%', '75%'], size: '140%' }
            : { startAngle: 0, endAngle: 360, center: ['50%', '50%'], size: '120%' })
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
