this.filteredList = [...this.countriesList];
this.ResponseFlag = true;

// wait for Angular to render #globeContainer inside *ngIf
this.zone.onStable.pipe(take(1)).subscribe(() => {
  if (this.globeContainer && this.globeContainer.nativeElement) {
    this.initializeGlobe();   // 👈 now guaranteed element exists
  }
});
