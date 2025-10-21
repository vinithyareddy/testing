ngOnInit() {
  // --- 1. Build full menu list ---
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- 2. Collapse all items before rendering ---
  tempmenulist.forEach(item => {
    if (item.settings) item.settings.collapsed = true;
    item.expanded = false;
  });

  // --- 3. Clear any persisted nav state ---
  sessionStorage.removeItem('fw_leftNavModel');
  localStorage.removeItem('fw_leftNavModel');

  // --- 4. Apply fresh model ---
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

  // --- 5. Force re-collapse again after framework UI sync ---
  setTimeout(() => {
    const model = this.fwService.apiGetLeftNavModel();
    if (model && Array.isArray(model)) {
      model.forEach(m => {
        if (m.settings) m.settings.collapsed = true;
        m.expanded = false;
      });
      this.fwService.apiSetLeftNavModel(model);
    }
  }, 800);
}
