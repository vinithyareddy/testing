export class SsByVolumeProficiencyLevelComponent implements AfterViewInit {
  widgetId: string = 'SKI_1';
  
  ResponseFlag = false;
  isLeftDisabled = true;
  isRightDisabled = false;
  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  
  @ViewChild('chartContainer') chartContainer!: ElementRef; // Add this
  
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);
  
  Highcharts: typeof Highcharts = Highcharts;
  chartUpdateFlag = false; // Add this
  
  pageSize = 9;
  currentPage = 0;
  
  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];
  proficiencyData: ProficiencyData[] = [];
  
  chartOptions: Highcharts.Options = { /* ... */ };
  
  constructor(
    private render: Renderer2,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) {}
  
  ngOnInit() {
    // Your existing ngOnInit code
  }
  
  // ADD THIS METHOD
  ngAfterViewInit() {
    // Slight delay to ensure DOM is ready
    setTimeout(() => {
      this.chartUpdateFlag = true;
    }, 100);
  }
  
  // Rest of your methods...
}