ngOnInit() {
  // Get menu list (pass all expected parameters)
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- 1. Force collapse all items BEFORE setting to framework ---
  tempmenulist.forEach(item => {
    item.expanded = false;
    item.routeActive = false;
    if (item.settings && 'collapsed' in item.settings) {
      item.settings.collapsed = true;
    }
    // Set children to inactive to prevent route matching
    if (item.children) {
      item.children.forEach(child => {
        child.routeActive = false;
        child.active = false;
      });
    }
  });

  // --- 2. Set to Framework ---
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

  // --- 3. Aggressive anti-expansion monitoring ---
  // Check immediately
  this.forceCollapseAll();
  
  // Check at multiple intervals to catch framework auto-expansion
  setTimeout(() => this.forceCollapseAll(), 0);
  setTimeout(() => this.forceCollapseAll(), 50);
  setTimeout(() => this.forceCollapseAll(), 100);
  setTimeout(() => this.forceCollapseAll(), 200);
  setTimeout(() => this.forceCollapseAll(), 300);
  setTimeout(() => this.forceCollapseAll(), 500);
  setTimeout(() => this.forceCollapseAll(), 1000);
}

// Add this new private method
private forceCollapseAll() {
  const currentModel = this.fwService.apiGetLeftNavModel();
  if (currentModel) {
    currentModel.forEach(m => {
      if (m.expanded === true) {
        console.log(`Forcing collapse on: ${m.text}`);
      }
      m.expanded = false;
      if (m.settings) {
        m.settings.collapsed = true;
      }
    });
    this.fwService.apiSetLeftNavModel(currentModel);
  }
}