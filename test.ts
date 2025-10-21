ngOnInit() {
  // Get menu list
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // Collapse everything before setting
  tempmenulist.forEach(item => {
    item.expanded = false;
    if (item.settings) item.settings.collapsed = true;
  });

  // Set the nav model
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

  // ✅ Force collapse again AFTER framework renders
  setTimeout(() => {
    const model = this.fwService.apiGetLeftNavModel();
    if (model && Array.isArray(model)) {
      model.forEach(m => {
        if (m.key === 'C-GRP-Reports' || m.key === 'C-GRP-IBRDIDA') {
          m.expanded = false;
          if (m.settings) m.settings.collapsed = true;
        }
      });
      this.fwService.apiSetLeftNavModel(model);
    }
  }, 400);
}
