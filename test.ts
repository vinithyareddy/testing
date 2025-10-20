ngOnInit() {
  // Build the left-nav list
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- 1. Collapse everything initially ---
  tempmenulist.forEach(item => {
    if (item.settings && 'collapsed' in item.settings) {
      item.settings.collapsed = true;
    }
    item.expanded = false;
  });

  // --- 2. Render the nav ---
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

  // --- 3. Listen for user clicks to handle accordion behaviour ---
  this.srServicesService.toggleMenuExpand = (menuKey: string) => {
    tempmenulist.forEach(m => {
      if (m.key === menuKey) {
        m.expanded = !m.expanded;
        if (m.settings) m.settings.collapsed = !m.expanded;
      } else {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      }
    });
    this.fwService.apiSetLeftNavModel([...tempmenulist]);
  };
}
