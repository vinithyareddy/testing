ngOnInit() {
  // 1️⃣ Get the full menu
  const tempmenulist = this.srServicesService.getTFMenuList(true);

  // 2️⃣ Force all top-level items to start collapsed
  tempmenulist.forEach(m => {
    if (m.settings) {
      m.settings.collapsed = true;
    }
    m.expanded = false;
  });

  // 3️⃣ Push to framework AFTER forcing collapse
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

  // 4️⃣ Track page load
  this.fwService.apiTrackMyPageWithAppInsights({
    pageName: 'Standard Reports - Trust Funds',
    subSections: []
  });

  // 5️⃣ Ensure no async expansion after load (some menus expand later)
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      currentModel.forEach(m => {
        if (m.settings) m.settings.collapsed = true;
        m.expanded = false;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 500);
}
