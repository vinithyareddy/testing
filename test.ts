ngOnInit() {
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // CRITICAL: Mark ALL items as NOT route active to prevent auto-expansion
  tempmenulist.forEach(item => {
    item.routeActive = false;  // ← Prevent route-based expansion
    item.active = false;       // ← Prevent active state
    item.expanded = false;
    if (item.settings) {
      item.settings.collapsed = true;
    }
    
    // Also ensure children don't trigger expansion
    if (item.children) {
      item.children.forEach(child => {
        child.routeActive = false;
        child.active = false;
      });
    }
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

  // Force collapse after framework finishes initialization
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      currentModel.forEach(m => {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 0);

  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      currentModel.forEach(m => {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 500);
}