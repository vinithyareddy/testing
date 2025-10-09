import { SwfpFteByGender } from '../../models/swfp-historical-Insights.model';

export class SwfpbyGenderComponent implements OnInit {
  widgetId: string = "SWFI_6";
  
  // ADD THESE TWO LINES:
  ResponseFlag = false;
  
  fullview = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  widgetType: any = 'ch';
  
  // CHANGE THIS LINE - Remove hardcoded data:
  genderData: SwfpFteByGender[] = [];  // Changed from hardcoded array to empty array

  ngOnInit(): void {
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((x: string) => {
      console.log("filters", x);
      
      // Call API - Raja's pattern
      this.apiService.getWidgetData(this.widgetId).subscribe((genders: any) => {
        console.log("API Response => ", genders);
        
        if (genders && genders.length > 0) {
          // Process data like Raja does
          const totals = genders.reduce((acc: Record<string, number>, curr: any) => {
            const category = curr.category || 'Unknown';
            acc[category] = (acc[category] || 0) + (curr.fte || curr.value || 0);
            return acc;
          }, {});
  
          // Convert to array
          this.genderData = Object.entries(totals).map(([category, fte]) => ({
            category,
            fte: fte as number,
            color: category.toLowerCase().includes('male') && !category.toLowerCase().includes('female') 
              ? '#34a7f2' 
              : '#aedcfa'
          }));
        } else {
          this.genderData = [];
        }
        
        // Call your existing loadChart method
        this.ResponseFlag = true;
        this.loadChart();
      });
    });
  }

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    LiftPopoverComponent,
    LiftSectionLoaderComponent  // ADD THIS LINE
  ],