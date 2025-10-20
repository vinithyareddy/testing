{
  key: 'C-GRP-IBRDIDA',
  routeActive: false,
  active: true,
  text: 'IBRD/IDA TFs',
  page: 'tf/ibrdidatfs',
  route: 'tf/ibrdidatfs',
  prefixIconClass: 'fa-regular fa-id-card',
  // ↓ try 'accordion' (if your framework supports it). If not, keep 'expand'.
  settings: { leftNavType: 'accordion', collapsed: true, loadPage: false },
  children: [
    { key: 'C-GRP-TFlifecycle', routeActive: false, active: true, text: 'TF Lifecycle', route: 'tf/ibrdidatfs/tflifecycle', page: 'tf/ibrdidatfs/tflifecycle' },
    { key: 'C-GRP-BunsinessUnit', routeActive: false, active: true, text: 'Business Unit Views', route: 'tf/ibrdidatfs/businessunitviews', page: 'tf/ibrdidatfs/businessunitviews' },
    { key: 'C-GRP-TFReform', routeActive: false, active: true, text: 'TF Reform (MVP)', route: 'tf/ibrdidatfs/mvp', page: 'tf/ibrdidatfs/mvp' },
    { key: 'C-GRP-TFGrant', routeActive: false, active: true, text: 'TF Grants', route: 'tf/ibrdidatfs/tfgrants', page: 'tf/ibrdidatfs/tfgrants' },
    { key: 'C-GRP-Fact', routeActive: false, active: true, text: 'FAcT', route: 'tf/ibrdidatfs/fact', page: 'tf/ibrdidatfs/fact' },
    { key: 'C-GRP-PersonaViews', routeActive: false, active: isUmberallaManager, text: 'Persona Views', route: 'tf/ibrdidatfs/umbrella-program', page: 'tf/ibrdidatfs/umbrella-program' },
    { key: 'C-GRP-PersonaViews1', routeActive: false, active: !isUmberallaManager, text: 'Persona Views', route: 'tf/ibrdidatfs/trusteettl', page: 'tf/ibrdidatfs/trusteettl' }
  ],
  // ↓ make this explicit
  expanded: false
},




{
  key: 'C-GRP-Reports',
  active: true,
  text: 'Reports',
  // Reports has no landing page; keep user under /tf
  page: 'tf',
  route: 'tf',
  prefixIconClass: 'far fa-bar-chart',
  // ↓ same leftNavType as above
  settings: { leftNavType: 'accordion', collapsed: true, loadPage: false },
  children: [
    {
      key: 'C-GRP-My-Reports',
      routeActive: false,
      active: true,
      text: 'My Reports',
      route: 'tf/my-favorites',
      page: 'tf/my-favorites'
    }
  ],
  // ↓ make this explicit
  expanded: false
}


ngOnInit() {
  // Build menu
  const tempmenulist = this.srServicesService.getTFMenuList(true);

  // Force both dropdowns collapsed on first paint
  tempmenulist.forEach(m => {
    if (m.settings) m.settings.collapsed = true;
    m.expanded = false;
  });

  // Push to framework (single call)
  this.fwService
    .apiUpdateSiteTitle({ title: 'Standard Reports | Trust Funds', link: '/tf' })
    .apiSetLeftNavModel(tempmenulist)
    .apiToggleLeftNav(true)
    .apiToggleHeaderControls({ settings: false, actions: false, help: true, isBeta: false })
    .apiToggleSplashScreen(false)
    .apiActionMenuToggle(false);

  this.fwService.apiTrackMyPageWithAppInsights({
    pageName: 'Standard Reports - Trust Funds',
    subSections: []
  });
}
