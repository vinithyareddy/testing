ngAfterViewInit() {

  this.fiterDataFromUrl$.pipe(distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),

    debounceTime(100),

    takeUntilDestroyed(this.destroyRef)

  ).subscribe((x: string) => {

    console.log("filters", x);



    this.apiService.getWidgetData(this.widgetId).subscribe((x) => {



      console.log("API Response => ", x);

    });



  });

  this.setupResizeObserver();

  this.initializeGlobe();

  this.loadData();

}