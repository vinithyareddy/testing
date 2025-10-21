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
  ActiveTab: string = 'Summary';
  constructor(public fwService: FrameworkService, public srServicesService: SrServicesService, private spinner: NgxSpinnerService) {
    const combineParams = this.fwService.apiGetAppData('routeParams');
    combineParams.module = 'Trust Funds New';
    combineParams.section = 'ibrdidatfs';
    combineParams.path = window.location.pathname;
    combineParams.Facets = '';
    this.fwService.apiSetAppData('routeParams', combineParams);
    this.srServicesService.getClearFilterEmitter('filterApply');
    this.srServicesService.facetFilter = [];
  }
  onToggle(key: string) {
    const tempmenulist = this.fwService.apiGetLeftNavModel();
    this.srServicesService.toggleMenuExpand(tempmenulist, key);
    this.fwService.apiSetLeftNavModel(tempmenulist);
  }
  ngOnInit() {
    // Get menu list (pass all expected parameters)
    const tempmenulist = this.srServicesService.getTFMenuList(true, true, false);
    // --- 1. Collapse all items on load ---
    tempmenulist.forEach(item => {
      if (item.settings && 'collapsed' in item.settings) {
        item.settings.collapsed = true;
      }
      item.expanded = false;
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
    // --- 3. Force-collapse again after render (to override auto-expansion) ---
    setTimeout(() => {
      const currentModel = this.fwService.apiGetLeftNavModel();
      if (currentModel) {
        currentModel.forEach(m => {
          if (m.settings) m.settings.collapsed = true;
          m.expanded = false;
        });
        this.fwService.apiSetLeftNavModel(currentModel);
      }
    }, 200);
  }
  onSelectTab(value) {
    if (this.srServicesService.tabload === '1') {
      this.ActiveTab = value.id;
      this.spinner.show();
      setTimeout(() => {
        this.srServicesService.getChangeFilterEmitter('filterApply');
        this.spinner.hide();
      }, 500);
      if (value.id === 'Overview') {
        this.srServicesService.tabselect = 1;
      } else {
        this.srServicesService.tabselect = 2;
      }
    }
  }
}
 getTFMenuList(isUmberallaManager: boolean, isIbrdIda: boolean = false, isReport: boolean = false): any[] {
    let tempmenulist = [];
    let IBRDIDAList = [];
    let ReportList = [];
    if (isIbrdIda) {
      IBRDIDAList = [
        {
          key: 'C-GRP-IBRDIDA', routeActive: false, active: true, text: 'IBRD/IDA TFs', page: 'tf/ibrdidatfs', route: 'tf/ibrdidatfs', prefixIconClass: 'fa-regular fa-id-card',
          settings: { leftNavType: 'expand', collapsed: true, loadPage: false },
          children: [
            { key: 'C-GRP-TFlifecycle', routeActive: false, active: true, text: 'TF Lifecycle', route: 'tf/ibrdidatfs/tflifecycle', page: 'tf/ibrdidatfs/tflifecycle' },
            { key: 'C-GRP-BunsinessUnit', routeActive: false, active: true, text: 'Business Unit Views', route: 'tf/ibrdidatfs/businessunitviews', page: 'tf/ibrdidatfs/businessunitviews' },
            { key: 'C-GRP-TFReform', routeActive: false, active: true, text: 'TF Reform (MVP)', route: 'tf/ibrdidatfs/mvp', page: 'tf/ibrdidatfs/mvp' },
            { key: 'C-GRP-TFGrant', routeActive: false, active: true, text: 'TF Grants', route: 'tf/ibrdidatfs/tfgrants', page: 'tf/ibrdidatfs/tfgrants' },
            { key: 'C-GRP-Fact', routeActive: false, active: true, text: 'FAcT', route: 'tf/ibrdidatfs/fact', page: 'tf/ibrdidatfs/fact' },
            { key: 'C-GRP-PersonaViews', routeActive: false, active: isUmberallaManager, text: 'Persona Views', route: 'tf/ibrdidatfs/umbrella-program', page: 'tf/ibrdidatfs/umbrella-program' },
            { key: 'C-GRP-PersonaViews1', routeActive: false, active: !isUmberallaManager, text: 'Persona Views', route: 'tf/ibrdidatfs/trusteettl', page: 'tf/ibrdidatfs/trusteettl' }
          ],
          expanded: false
        },
      ]
    } else {
      IBRDIDAList = [{
        key: 'C-GRP-IBRDIDA', routeActive: false, active: true, text: 'IBRD/IDA TFs', page: 'tf/ibrdidatfs', route: 'tf/ibrdidatfs', prefixIconClass: 'fa-regular fa-id-card',
        settings: { collapsed: true, loadPage: false }
      }];
    }
    if (!isIbrdIda) {
      ReportList = [{
        key: 'C-GRP-Reports', routeActive: false, page: 'tf', route: 'tf', active: true, text: 'Reports', prefixIconClass: 'far fa-bar-chart',
        settings: { leftNavType: 'expand', collapsed: true, loadPage: false },
        children: [
          {
            key: 'C-GRP-My-Reports', routeActive: false, active: true, text: 'My Reports', route: 'tf/my-favorites', page: 'tf/my-favorites'
          }
        ],
        expanded: false
      }];
    } else {
      ReportList = [{
        key: 'C-GRP-Reports', routeActive: false, active: true, text: 'Reports', page: 'tf', route: 'tf', prefixIconClass: 'far fa-bar-chart',
        settings: { leftNavType: 'expand', collapsed: true, loadPage: false }
      }];
    }
    let ibrdidahome = {
      key: 'C-GRP-Home', routeActive: false, active: true, text: 'Overview', route: 'tf', page: 'tf', prefixIconClass: 'far fa-home'
    };
    let fifspage = { key: 'C-GRP-Staff-Flows', routeActive: false, active: true, text: 'FIFs', route: 'tf/landing-fifs', page: 'tf/landing-fifs', prefixIconClass: 'far fa-globe' };
    // let ReportList = [{
    //   key: 'C-GRP-Reports', active: true, text: 'Reports', page: 'my-favorites', prefixIconClass: 'far fa-bar-chart',
    //   settings: { collapsed: true, loadPage: false },
    //   children: [
    //     {
    //       key: 'C-GRP-My-Reports', routeActive: false, active: true, text: 'My Reports', route: 'tf/my-favorites', page: 'tf/my-favorites'
    //     }
    //   ],
    //   expanded: false
    // }];
    tempmenulist.push(ibrdidahome);
    IBRDIDAList.forEach(x => {
      tempmenulist.push(x);
    });
    tempmenulist.push(fifspage);
    ReportList.forEach(y => {
      tempmenulist.push(y)
    });
    return tempmenulist;
    // [
    //   {
    //     key: 'C-GRP-Home', routeActive: false, active: true, text: 'Overview', route: 'tf', page: 'tf', prefixIconClass: 'far fa-home'
    //   },
    //   {
    //     key: 'C-GRP-IBRDIDA', routeActive: false, active: true, text: 'IBRD/IDA TFs', page: 'tf/ibrdidatfs', route: 'tf/ibrdidatfs', prefixIconClass: 'fa-regular fa-id-card',
    //     settings: { collapsed: true, loadPage: false },
    //     children: [
    //       { key: 'C-GRP-TFlifecycle', routeActive: false, active: true, text: 'TF Lifecycle', route: 'tf/ibrdidatfs/tflifecycle', page: 'tf/ibrdidatfs/tflifecycle' },
    //       { key: 'C-GRP-BunsinessUnit', routeActive: false, active: true, text: 'Business Unit Views', route: 'tf/ibrdidatfs/businessunitviews', page: 'tf/ibrdidatfs/businessunitviews' },
    //       { key: 'C-GRP-TFReform', routeActive: false, active: true, text: 'TF Reform (MVP)', route: 'tf/ibrdidatfs/mvp', page: 'tf/ibrdidatfs/mvp' },
    //       { key: 'C-GRP-TFGrant', routeActive: false, active: true, text: 'TF Grants', route: 'tf/ibrdidatfs/tfgrants', page: 'tf/ibrdidatfs/tfgrants' },
    //       { key: 'C-GRP-Fact', routeActive: false, active: true, text: 'FAcT', route: 'tf/ibrdidatfs/fact', page: 'tf/ibrdidatfs/fact' },
    //       { key: 'C-GRP-PersonaViews', routeActive: false, active: isUmberallaManager, text: 'Persona Views', route: 'tf/ibrdidatfs/umbrella-program', page: 'tf/ibrdidatfs/umbrella-program' },
    //       { key: 'C-GRP-PersonaViews1', routeActive: false, active: !isUmberallaManager, text: 'Persona Views', route: 'tf/ibrdidatfs/trusteettl', page: 'tf/ibrdidatfs/trusteettl' }
    //     ],
    //     expanded: false
    //   },
    //   { key: 'C-GRP-Staff-Flows', routeActive: false, active: true, text: 'FIFs', route: 'tf/landing-fifs', page: 'tf/landing-fifs', prefixIconClass: 'far fa-globe' },
    //   {
    //     key: 'C-GRP-Reports', active: true, text: 'Reports', page: 'my-favorites', prefixIconClass: 'far fa-bar-chart',
    //     settings: { collapsed: true, loadPage: false },
    //     children: [
    //       {
    //         key: 'C-GRP-My-Reports', routeActive: false, active: true, text: 'My Reports', route: 'tf/my-favorites', page: 'tf/my-favorites'
    //       }
    //     ],
    //     expanded: false
    //   }
    // ];
  }
  toggleMenuExpand(menuList: any[], key: string) {
    menuList.forEach(m => {
      if (m.key === key) {
        m.expanded = !m.expanded;
        if (m.settings) m.settings.collapsed = !m.expanded;
      } else {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      }
    });
  }