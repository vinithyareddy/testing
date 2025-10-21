ngOnInit() {
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  tempmenulist.forEach(item => {
    item.expanded = false;
    if (item.settings) item.settings.collapsed = true;
  });

  this.fwService
    .apiUpdateSiteTitle({ title: 'Standard Reports | Trust Funds', link: '/tf' })
    .apiSetLeftNavModel(tempmenulist)
    .apiToggleLeftNav(true)
    .apiToggleHeaderControls({
      settings: false,
      actions: false,
      help: true,
      isBeta: false
    })
    .apiToggleSplashScreen(false)
    .apiActionMenuToggle(false);

  this.fwService.apiTrackMyPageWithAppInsights({
    pageName: 'Standard Reports - Trust Funds',
    subSections: []
  });

  // AGGRESSIVE: Watch for any changes and force collapse immediately
  this.startAggressiveCollapseMonitoring();
}

private startAggressiveCollapseMonitoring() {
  // Create interval that runs every 50ms for 3 seconds
  let counter = 0;
  const maxChecks = 60; // 60 checks * 50ms = 3 seconds
  
  const collapseInterval = setInterval(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      let foundExpanded = false;
      
      currentModel.forEach(m => {
        if (m.expanded === true) {
          console.log(`🚨 CAUGHT EXPANSION: ${m.text} at ${counter * 50}ms`);
          foundExpanded = true;
        }
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      });
      
      if (foundExpanded) {
        this.fwService.apiSetLeftNavModel(currentModel);
      }
    }
    
    counter++;
    if (counter >= maxChecks) {
      clearInterval(collapseInterval);
      console.log('✅ Stopped monitoring after 3 seconds');
    }
  }, 50);
}