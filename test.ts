this.fwService.apiToggleHeaderControls({
  settings: false,
  actions: false,
  help: true,
  isBeta: false,
  search: true,
  filter: true  // ensure filter active for Overview
});

} else {
this.srServicesService.tabselect = 2;

// 🚫 Disable Filter when in Reports tab
this.fwService.apiToggleHeaderControls({
  settings: false,
  actions: false,
  help: true,
  isBeta: false,
  search: true,
  filter: false // disable or hide Filter button
});
}