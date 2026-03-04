const setDescriptions = (assets: any[]) => {

  // Helper function to find the right description for a widget by its ID and year concept
  const getDesc = (id: string) => {

    const normalize = (text: string) => text.toLowerCase().replace(/\s/g, '');

    // If "Last 3 FYS" filter is active
    if (this.biportalApiService.travelLast3Fiscyear === true) {

      const found = assets.find((x: any) =>
        x.ReferenceNumber &&
        normalize(x.ReferenceNumber) === normalize(id) &&
        x.yearConcept &&
        normalize(x.yearConcept).includes('last3')
      );

      if (found) return found.description;
    }

    // If "Current FY" or "Last FY" filter is active
    else if (
      this.biportalApiService.travelCurrentFiscyear === true ||
      this.biportalApiService.travelPreviousFiscyear === true
    ) {

      const found = assets.find((x: any) =>
        x.ReferenceNumber &&
        normalize(x.ReferenceNumber) === normalize(id) &&
        x.yearConcept &&
        (
          normalize(x.yearConcept).includes('current') ||
          normalize(x.yearConcept).includes('lastfy')
        )
      );

      if (found) return found.description;
    }

    // fallback if nothing matched
    const found = assets.find((x: any) =>
      x.ReferenceNumber && normalize(x.ReferenceNumber) === normalize(id)
    );

    return found ? found.description : '';
  };

  this.airfareWidgetDescription = getDesc('WID002a');
  this.carbonWidgetDescription = getDesc('WID002b');
  this.hotelWidgetDescription = getDesc('WID002c');
  this.travelerWidgetDescription = getDesc('WID002d');
};


if (this.biportalApiService.travelMetaDataList === undefined) {

  this.biportalApiService.travelcollibrametaData.subscribe((collibrametaData: any) => {

    if (collibrametaData.assets && collibrametaData.assets.length > 0) {

      setDescriptions(collibrametaData.assets);

    }

  });

} else {

  if (
    this.biportalApiService.travelMetaDataList &&
    'assets' in this.biportalApiService.travelMetaDataList
  ) {

    if (this.biportalApiService.travelMetaDataList.assets.length > 0) {

      setDescriptions(this.biportalApiService.travelMetaDataList.assets);

    }

  }

}