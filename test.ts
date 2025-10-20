import { Component, OnInit } from '@angular/core';
import { FrameworkService } from '@framework/core/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { SrServicesService } from 'services/sr-services.service';

@Component({
  selector: 'app-ibrd-ida-tfs',
  templateUrl: './ibrd-ida-tfs.component.html',
  styleUrls: ['./ibrd-ida-tfs.component.scss']
})
export class IbrdIdaTfsComponent implements OnInit {

  menuList: any[] = [];
  ActiveTab: string = 'Summary';

  constructor(
    public fwService: FrameworkService,
    public srServicesService: SrServicesService,
    private spinner: NgxSpinnerService
  ) {
    const combineParams = this.fwService.apiGetAppData('routeParams');
    combineParams.module = 'Trust Funds New';
    combineParams.section = 'ibrdidatfs';
    combineParams.path = window.location.pathname;
    combineParams.Facets = '';
    this.fwService.apiSetAppData('routeParams', combineParams);

    this.srServicesService.getClearFilterEmitter('filterApply');
    this.srServicesService.facetFilter = [];
  }

  ngOnInit() {
    // 1️⃣ Load menu and keep both collapsed initially
    this.menuList = this.srServicesService.getTFMenuList(true, true, false);
    this.menuList.forEach(item => {
      if (item.settings) item.settings.collapsed = true;
      item.expanded = false;
    });

    // 2️⃣ Set the sidebar model once
    this.fwService
      .apiUpdateSiteTitle({ title: 'Standard Reports | Trust Funds', link: '/tf' })
      .apiSetLeftNavModel(this.menuList)
      .apiToggleLeftNav(true)
      .apiToggleHeaderControls({ settings: false, actions: false, help: true, isBeta: false })
      .apiToggleSplashScreen(false)
      .apiActionMenuToggle(false);

    this.fwService.apiTrackMyPageWithAppInsights({
      pageName: 'Standard Reports - Trust Funds',
      subSections: []
    });
  }

  // 🔄 Toggle only one dropdown open at a time
  onToggle(key: string) {
    this.srServicesService.toggleMenuExpand(this.menuList, key);
    this.fwService.apiSetLeftNavModel(this.menuList);
  }

  onSelectTab(value) {
    if (this.srServicesService.tabload === '1') {
      this.ActiveTab = value.id;
      this.spinner.show();

      setTimeout(() => {
        this.srServicesService.getChangeFilterEmitter('filterApply');
        this.spinner.hide();
      }, 500);

      this.srServicesService.tabselect = (value.id === 'Overview') ? 1 : 2;
    }
  }
}
