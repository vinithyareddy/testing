ngAfterViewInit() {
  // run after framework UI has rendered
  setTimeout(() => {
    const navModel = this.fwService.apiGetLeftNavModel();
    if (navModel && Array.isArray(navModel)) {
      navModel.forEach(m => {
        // Force all collapsed
        if (m.settings) m.settings.collapsed = true;
        m.expanded = false;
      });
      this.fwService.apiSetLeftNavModel([...navModel]);
    }

    // one more safety collapse for "Reports" only
    const refreshedModel = this.fwService.apiGetLeftNavModel();
    const reportsItem = refreshedModel?.find(
      (m: any) => m.key === 'C-GRP-Reports' || (m.text && m.text.toLowerCase().includes('report'))
    );
    if (reportsItem) {
      reportsItem.expanded = false;
      if (reportsItem.settings) reportsItem.settings.collapsed = true;
      this.fwService.apiSetLeftNavModel([...refreshedModel]);
    }
  }, 800); // wait for framework’s route-based nav expansion, then override it
}
