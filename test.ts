ngOnInit() {
  // Get menu list (pass all expected parameters)
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- CRITICAL: Force collapse ALL items with children BEFORE setting to framework ---
  tempmenulist.forEach(item => {
    // Force collapsed state
    item.expanded = false;
    
    if (item.settings) {
      item.settings.collapsed = true;
    }
    
    // Also ensure children don't have any expanded state
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        child.expanded = false;
      });
    }
  });

  // --- Set to Framework AFTER forcing collapse ---
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

  // --- Force-collapse AGAIN after a delay (to override any auto-expansion from framework) ---
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel && Array.isArray(currentModel)) {
      currentModel.forEach(m => {
        m.expanded = false;
        if (m.settings) {
          m.settings.collapsed = true;
        }
        if (m.children && m.children.length > 0) {
          m.children.forEach(child => {
            child.expanded = false;
          });
        }
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 0);

  // --- Additional safety check after render cycle ---
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel && Array.isArray(currentModel)) {
      currentModel.forEach(m => {
        m.expanded = false;
        if (m.settings) {
          m.settings.collapsed = true;
        }
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 500);
}


