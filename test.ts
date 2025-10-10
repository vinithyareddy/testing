export class SsByVolumeProficiencyLevelComponent {
  widgetId: string = 'SKI_1';
  
  ResponseFlag = false;
  isLeftDisabled = true;
  isRightDisabled = false;
  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);
  
  Highcharts: typeof Highcharts = Highcharts;
  
  pageSize = 9;
  currentPage = 0;
  
  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];
  proficiencyData: ProficiencyData[] = [];
  
  chartOptions: Highcharts.Options = {};
  
  constructor(
    private render: Renderer2,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) {
    // Initialize empty chart options
    this.initializeEmptyChart();
  }
  
  // ADD THIS NEW METHOD
  private initializeEmptyChart(): void {
    this.chartOptions = {
      chart: { 
        type: 'column',
        backgroundColor: '#ffffff'
      },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories: [],
        title: {
          text: 'Skill Levels',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
        },
        labels: {
          style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
        },
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'FTE Count',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
        },
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#D1D5DB'
      },
      plotOptions: {
        column: {
          groupPadding: 0.2,
          pointPadding: 0.05,
          borderWidth: 0,
          dataLabels: { 
            enabled: true,
            style: { 
              fontWeight: '600',
              textOutline: 'none'
            }
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          fontWeight: '500',
          fontSize: '13px'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true
      },
      series: []
    };
  }

  ngOnInit() {
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((x: string) => {
      console.log("filters", x);
      
      this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
        console.log("API Response => ", response);
        
        // Use mock data for now
        this.processProficiencyData(MOCK_PROFICIENCY_DATA);
      }, (error) => {
        console.error("API Error:", error);
        this.processProficiencyData(MOCK_PROFICIENCY_DATA);
      });
    });
  }

  private processProficiencyData(apiData: ProficiencyData[]): void {
    console.log("Processing proficiency data:", apiData);
    
    this.proficiencyData = apiData;
    
    // Get unique skill levels
    const uniqueLevels = [...new Set(apiData.map(item => item.skill_name))].sort();
    this.allCategories = uniqueLevels;
    
    // Get unique proficiency types
    const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    
    // Build series data
    this.allSeriesData = proficiencyTypes.map(profType => {
      return uniqueLevels.map(level => {
        const found = apiData.find(
          item => item.skill_name === level && item.prof_skill_overall_name === profType
        );
        return found ? found.fte : 0;
      });
    });
    
    console.log("Processed categories:", this.allCategories);
    console.log("Processed series data:", this.allSeriesData);
    
    // Set ResponseFlag AFTER data is ready
    this.ResponseFlag = true;
    
    // Update chart - use setTimeout to ensure DOM is ready
    setTimeout(() => {
      this.updateChart();
    }, 0);
  }

  updateChart() {
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.allCategories.length);
    
    const pageCategories = this.allCategories.slice(start, end);
    const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));
    
    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];
    
    // Create new options object (don't use spread operator)
    this.chartOptions = {
      chart: { 
        type: 'column',
        backgroundColor: '#ffffff'
      },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories: pageCategories,
        title: {
          text: 'Skill Levels',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
        },
        labels: {
          style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
        },
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'FTE Count',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
        },
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#D1D5DB'
      },
      plotOptions: {
        column: {
          groupPadding: 0.2,
          pointPadding: 0.05,
          borderWidth: 0,
          dataLabels: { 
            enabled: true,
            style: { 
              fontWeight: '600',
              textOutline: 'none'
            }
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          fontWeight: '500',
          fontSize: '13px'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function() {
          let tooltip = `<b>${this.x}</b><br/>`;
          this.points?.forEach(point => {
            tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
          });
          return tooltip;
        }
      },
      series: pageSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 18,
        name: seriesNames[idx],
        color: colors[idx],
        showInLegend: true,
        data
      }))
    };
    
    // Update navigation button states
    this.isLeftDisabled = this.currentPage === 0;
    const maxPage = Math.ceil(this.allCategories.length / this.pageSize) - 1;
    this.isRightDisabled = this.currentPage >= maxPage;
  }

  onLeftClick() {
    if (!this.isLeftDisabled) {
      this.currentPage--;
      this.updateChart();
    }
  }

  onRightClick() {
    if (!this.isRightDisabled) {
      this.currentPage++;
      this.updateChart();
    }
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}