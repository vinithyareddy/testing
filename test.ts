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
  styleUrl: './ss-by-volume-proficiency-level.component.scss'
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  fullview = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartData: any[] = [];

  constructor(private render: Renderer2, private mockService: MockDataService) {}

  ngOnInit() {
    // TODO: Replace mockDataService call with API call after KT
    this.mockService.getSkillSupplyProficiency().subscribe((data) => {
      this.chartData = data;
      this.loadChart();
    });
  }

  loadChart() {
    this.chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Skill Supply by Proficiency Level' },
      credits: { enabled: false },
      xAxis: {
        categories: this.chartData.map(d => d.proficiency),
        title: { text: 'Proficiency Level' }
      },
      yAxis: { title: { text: 'FTE Count' } },
      plotOptions: {
        column: { borderWidth: 0, dataLabels: { enabled: true } }
      },
      series: [{
        type: 'column',
        name: 'Skill Supply (FTE)',
        data: this.chartData.map(d => d.fte),
        colorByPoint: true,
        colors: ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF']
      }]
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
export class SwfpbyGenderComponent implements OnInit {
  fullview = false;
  widgetType = 'ch';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  genderData: any[] = [];

  constructor(private render: Renderer2, private mockService: MockDataService) {}

  ngOnInit(): void {
    // TODO: Replace mockDataService call with API call after KT
    this.mockService.getWorkforceByGender().subscribe((data) => {
      this.genderData = data;
      this.loadChart();
    });
  }

  loadWidget(type: any) {
    this.widgetType = type;
  }

  loadChart(): void {
    const totalCount = this.genderData.reduce((sum, item) => sum + item.y, 0);

    this.chartOptions = {
      chart: { type: 'pie' },
      title: {
        text: `<span style="font-size:22px;font-weight:bold">${totalCount}</span><br/><span style="font-size:12px">Workforce Supply (FTE) by Gender</span>`,
        useHTML: true
      },
      tooltip: { pointFormat: '{point.y} ({point.percentage:.0f}%)' },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          showInLegend: true,
          dataLabels: { enabled: true, format: '{point.name}: {point.y}' }
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
