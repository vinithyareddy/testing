ngOnInit() {
  // Get menu list (pass all expected parameters)
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- 1. Collapse all items on load ---
  tempmenulist.forEach(item => {
    if (item.settings && 'collapsed' in item.settings) {
      item.settings.collapsed = true;
    }
    item.expanded = false;
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

  // --- 3. Force-collapse again after render (to override auto-expansion) ---
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      currentModel.forEach(m => {
        if (m.settings) m.settings.collapsed = true;
        m.expanded = false;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 200);
}


toggleMenuExpand(menuList: any[], key: string) {
  menuList.forEach(m => {
    if (m.key === key) {
      m.expanded = !m.expanded;
      if (m.settings) m.settings.collapsed = !m.expanded;
    } else {
      m.expanded = false;
      if (m.settings) m.settings.collapsed = true;
    }
  });
}


onToggle(key: string) {
  const tempmenulist = this.fwService.apiGetLeftNavModel();
  this.srServicesService.toggleMenuExpand(tempmenulist, key);
  this.fwService.apiSetLeftNavModel(tempmenulist);
}
