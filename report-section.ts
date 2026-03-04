const getDesc = (id: string) => {

 if (this.biportalApiService.caiMetadataResponse) {

  const assets = this.biportalApiService.caiMetadataResponse.assets;

  const getDesc = (id: string) => {

    if (this.biportalApiService.travelLast3Fiscyear) {

      const found = assets.find(
        x => x.ReferenceNumber?.toLowerCase() === id.toLowerCase() &&
             x.yearConcept?.toLowerCase().includes('last 3')
      );

      return found ? found.description : '';

    } else {

      const found = assets.find(
        x => x.ReferenceNumber?.toLowerCase() === id.toLowerCase() &&
             x.yearConcept?.toLowerCase().includes('current')
      );

      return found ? found.description : '';

    }

  };

  this.airfareWidgetDescription = getDesc('WID002A');
  this.carbonWidgetDescription = getDesc('WID002B');
  this.hotelWidgetDescription = getDesc('WID002C');
  this.travelerWidgetDescription = getDesc('WID002D');

}

};