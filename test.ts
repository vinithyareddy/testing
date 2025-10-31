getapiwidgetdataload(selectedwidgetId: any) {
  // Check if this exact request is already in progress
  if (this.pendingRequests.has(selectedwidgetId)) {
    console.log('⚠️ Duplicate call prevented for:', selectedwidgetId);
    return this.pendingRequests.get(selectedwidgetId);
  }

  if (this.dashboardWidgetDetails.graphUrls.length === 0) {
    this.dashboardWidgetDetails.graphUrls = this.loadGraphUrlData();
  }

  const daxDetail: any = this.dashboardWidgetDetails.graphUrls.filter(x => x.id === selectedwidgetId);
  const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === daxDetail[0].environmentName);
  
  const jsondata = {
    ignoreCache: true,
    query: this.getDaxJSONData(daxDetail),
    datasource: envdatasourceData[0].dataSource,
    InitialCatalog: envdatasourceData[0].InitialCatalog,
    dataSetId: envdatasourceData[0].dataSetId
  };
  
  console.log(daxDetail[0].widgetTitle, ' Request URL ==>', jsondata.query);
  const reqURL = this.dashboardReqURL;

  // Create the request with caching
  const request$ = this.http.post(reqURL, jsondata).pipe(
    map((resdata: any) => {
      return resdata;
    }),
    shareReplay(1), // Cache the response
    finalize(() => {
      // Clean up after request completes
      this.pendingRequests.delete(selectedwidgetId);
      console.log('✅ Request completed for:', selectedwidgetId);
    })
  );

  // Store the request
  this.pendingRequests.set(selectedwidgetId, request$);
  return request$;
}


