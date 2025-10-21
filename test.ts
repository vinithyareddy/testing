ngOnInit() {
  // Get menu list (pass all expected parameters)
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // --- DEBUG: Log the initial state ---
  console.log('=== INITIAL MENU STATE ===');
  tempmenulist.forEach(item => {
    console.log(`Item: ${item.text}, expanded: ${item.expanded}, collapsed: ${item.settings?.collapsed}`);
  });

  // --- 1. Collapse all items on load ---
  tempmenulist.forEach(item => {
    if (item.settings && 'collapsed' in item.settings) {
      item.settings.collapsed = true;
    }
    item.expanded = false;
  });

  // --- DEBUG: Log after manual collapse ---
  console.log('=== AFTER MANUAL COLLAPSE ===');
  tempmenulist.forEach(item => {
    console.log(`Item: ${item.text}, expanded: ${item.expanded}, collapsed: ${item.settings?.collapsed}`);
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

  // --- 3. Force-collapse again after render ---
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    console.log('=== AFTER FRAMEWORK SET (in setTimeout) ===');
    if (currentModel) {
      currentModel.forEach(m => {
        console.log(`Item: ${m.text}, expanded: ${m.expanded}, collapsed: ${m.settings?.collapsed}`);
        if (m.settings) m.settings.collapsed = true;
        m.expanded = false;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 200);
}