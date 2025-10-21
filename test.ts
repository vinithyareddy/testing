ngOnInit() {
  // Build full menu
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // Collapse all before setting
  tempmenulist.forEach(item => {
    item.expanded = false;
    if (item.settings) item.settings.collapsed = true;
  });

  // Apply fresh model
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

  // ✅ Override any auto-expansion by collapsing all after render
  setTimeout(() => {
    const model = this.fwService.apiGetLeftNavModel();

    if (model && Array.isArray(model)) {
      model.forEach(m => {
        // Force collapse both major dropdowns
        if (m.key === 'C-GRP-Reports' || m.key === 'C-GRP-IBRDIDA') {
          m.expanded = false;
          if (m.settings) m.settings.collapsed = true;
        }
      });

      // Reset entire model again to apply collapse visually
      this.fwService.apiSetLeftNavModel(model);
    }

    // ✅ Optional: Force re-render refresh (some UI caches the expand state)
    const leftNavElem = document.querySelector('.left-nav');
    if (leftNavElem) {
      leftNavElem.dispatchEvent(new Event('refresh'));
    }
  }, 1000);
}
