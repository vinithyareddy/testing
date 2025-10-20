ngOnInit() {
  // Build menu list
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- 1. Collapse everything initially ---
  tempmenulist.forEach(item => {
    if (item.settings && 'collapsed' in item.settings) {
      item.settings.collapsed = true;
    }
    item.expanded = false;
  });

  // --- 2. Set to framework ---
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

  // --- 3. FORCE COLLAPSE AFTER FRAMEWORK AUTO-EXPANDS ---
  // Framework auto-opens current route, so override it after 300ms
  setTimeout(() => {
    const navModel = this.fwService.apiGetLeftNavModel();
    if (navModel && Array.isArray(navModel)) {
      navModel.forEach(m => {
        if (m.settings && 'collapsed' in m.settings) {
          m.settings.collapsed = true;
        }
        m.expanded = false;
      });
      this.fwService.apiSetLeftNavModel([...navModel]);
    }
  }, 300);
}
