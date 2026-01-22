import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { HrHighchartsService } from 'app/modules/hr-dashboard/services/hr-highcharts.service';
import { HrService } from 'app/modules/hr-dashboard/services/hr.service';

type ViewType = 'GRADE' | 'GENDER' | 'HQCO' | 'REGION' | 'COUNTRY';
type DisplayMode = 'GRID' | 'CHART';

@Component({
  selector: 'app-termination-for-current-year',
  templateUrl: './termination-for-current-year.component.html',
  styleUrl: './termination-for-current-year.component.scss'
})
export class TerminationForCurrentYearComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  destroy$ = new Subject<void>();
  ResponseFlag = false;

  /** UI State */
  selectedView: ViewType = 'GRADE';
  displayMode: DisplayMode = 'GRID';
  isFullscreen = false;
  selectedAlpha = 'ALL';

  /** Dropdown */
  viewOptions = [
    { label: 'Grade', value: 'GRADE' },
    { label: 'Gender', value: 'GENDER' },
    { label: 'By HQ/CO', value: 'HQCO' },
    { label: 'Geographic Region', value: 'REGION' },
    { label: 'Duty Country', value: 'COUNTRY' }
  ];

  /** Chart holder */
  AssigmntDataChart: any[] = [];

  /** Dummy datasets */
  terminationReasons = [
    'End Of Contract', 'Resignation', 'Retirement', 'Mutually agreed',
    'Resign, Better O', 'Early Out Retire', 'Early Out Resign',
    'Disability', 'Death', 'Ethics Case', 'Coterminous',
    'Redundant Employ', 'Non-Confirmation',
    'Abandonment Of O', 'Unsatisfactory P'
  ];

  gradeColumns = ['EC1','EC2','EC3','EC4','ET1','ET2','ET3','ET4','GA','GB','GC','GD','GE','GF'];

  genderData = [
    { name: 'Male', data: [160,47,100,134,81,210,53,130,125,53,210,209,47,100,160] },
    { name: 'Female', data: [219,108,263,153,117,113,28,30,40,28,113,135,210,263,219] }
  ];

  hqcoData = [
    { name: 'HQ', data: [100,47,210,60,225,125,70,130,75,53,210,81,134,100,160] },
    { name: 'CO Appt', data: [115,210,135,38,203,40,213,30,112,28,113,117,153,263,219] }
  ];

  regionColumns = ['AFR','EAP','ECA','HQ','ICR','MNA','SAR','W.EUROPE'];

  countryColumns = [
    'USA','INDIA','KOREA','FRENCH','JAPAN','UK',
    'AFRICA','AUSTRIA','BELGIUM','CANADA',
    'DENMARK','EGYPT','FRANCE','ITALY'
  ];

  alphaGroups = [
    { label: 'All', value: 'ALL' },
    { label: 'A-D', value: 'A-D' },
    { label: 'E-H', value: 'E-H' },
    { label: 'I-L', value: 'I-L' },
    { label: 'M-P', value: 'M-P' },
    { label: 'Q-T', value: 'Q-T' },
    { label: 'U-W', value: 'U-W' },
    { label: 'X-Z', value: 'X-Z' }
  ];

  constructor(
    private highChartsService: HrHighchartsService,
    public hrservice: HrService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ResponseFlag = true;
    this.renderChart();
  }

  /** View change */
  onViewChange(view: ViewType) {
    this.selectedView = view;
    this.displayMode = 'GRID';
    this.isFullscreen = false;
    this.renderChart();
  }

  /** Grid / Chart toggle */
  setDisplayMode(mode: DisplayMode) {
    this.displayMode = mode;
    this.renderChart();
  }

  /** Fullscreen toggle */
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  /** Alphabet filter */
  setAlpha(val: string) {
    this.selectedAlpha = val;
  }

  /** Chart builder */
  renderChart() {
    this.AssigmntDataChart = [];

    if (this.displayMode !== 'CHART') return;
    if (!this.chartContainer) return;

    let seriesData: any[] = [];
    let chartTitle = '';
    let xAxisTitle = '';
    let yAxisTitle = '';

    if (this.selectedView === 'GENDER') {
      seriesData = this.genderData;
      chartTitle = 'Termination by Gender';
    }

    if (this.selectedView === 'HQCO') {
      seriesData = this.hqcoData;
      chartTitle = 'Termination by HQ / CO';
    }

    if (!seriesData.length) return;

    const ChartOptions = {
      chartTitle,
      chartWidth: this.chartContainer.nativeElement.offsetWidth,
      chartHight: 360,
      xAxisCategory: this.terminationReasons,
      legendVisible: true,
      dataseries: seriesData.map(s => ({
        name: s.name,
        data: s.data,
        borderRadius: 3
      })),
      xAxisVisible: true,
      yAxisVisible: true,
      xAxisTitle,
      yAxisTitle,
      dataLabelEnable: true,
      datalabelFormat: '#',
      widgetID: 'termination-for-current-year'
    };

    this.AssigmntDataChart =
      this.highChartsService.GetStackedBarChart(ChartOptions);
  }

  @HostListener('window:resize')
  onResize() {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
