ngOnInit() {
  // Get menu list (pass all expected parameters)
  const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);

  // Force everything collapsed initially
  tempmenulist.forEach(item => {
    item.expanded = false;
    if (item.settings && 'collapsed' in item.settings) {
      item.settings.collapsed = true;
    }
  });

  // Set to Framework
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

  // CRITICAL: Force collapse multiple times to override framework's route-based expansion
  // Use multiple timeouts because we don't know exactly when framework expands
  
  [0, 50, 100, 200, 300, 500].forEach(delay => {
    setTimeout(() => {
      const currentModel = this.fwService.apiGetLeftNavModel();
      if (currentModel) {
        currentModel.forEach(m => {
          m.expanded = false;
          if (m.settings) m.settings.collapsed = true;
        });
        this.fwService.apiSetLeftNavModel(currentModel);
      }
    }, delay);
  });
}

ngAfterViewInit() {
  // Force collapse after view is completely initialized
  // This catches any late-stage expansions
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      currentModel.forEach(m => {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 100);
  
  setTimeout(() => {
    const currentModel = this.fwService.apiGetLeftNavModel();
    if (currentModel) {
      currentModel.forEach(m => {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      });
      this.fwService.apiSetLeftNavModel(currentModel);
    }
  }, 500);
}

import { Component, OnInit, AfterViewInit } from '@angular/core';

export class IbrdIdaTfsComponent implements OnInit, AfterViewInit {