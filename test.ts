ngOnInit() {
  setTimeout(() => {
    const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

    // --- Step 1: make sure everything starts collapsed ---
    tempmenulist.forEach(m => {
      if (m.settings) m.settings.collapsed = true;
      m.expanded = false;
    });

    // --- Step 2: register the model ---
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

    // --- Step 3: enforce collapsed state after the framework auto-expand runs ---
    setTimeout(() => {
      const model = this.fwService.apiGetLeftNavModel();
      if (model) {
        model.forEach(item => {
          // Force these specific groups closed on load
          if (item.key === 'C-GRP-Reports' || item.key === 'C-GRP-IBRDIDA') {
            item.expanded = false;
            if (item.settings) item.settings.collapsed = true;
          }
        });
        // Push back after framework finished its own expansion
        this.fwService.apiSetLeftNavModel(model);
      }
    }, 1000); // <-- delay long enough to override framework auto-open
  }, 100);
}
