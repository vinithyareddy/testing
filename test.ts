import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from '@framework/core/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PowerbirestServicesService } from 'services/powerbirest-services.service';
import { SrServicesService } from 'services/sr-services.service';

@Component({
  selector: 'app-trust-funds',
  templateUrl: './trust-funds.component.html',
  styleUrls: ['./trust-funds.component.scss']
})
export class TrustFundsComponent implements OnInit {
  ActiveTab: string = 'Overview';
  tourStatus = false;

  constructor(public fwService: FrameworkService, public srServicesService: SrServicesService, private spinner: NgxSpinnerService, private powerbiRestService: PowerbirestServicesService, public activatedRoute: ActivatedRoute, private router: Router) {
    const combineParams = this.fwService.apiGetAppData('routeParams');
    combineParams.module = 'Trust Funds New';
    combineParams.section = 'Home';
    combineParams.path = window.location.pathname;
    combineParams.Facets = '';
    this.fwService.apiSetAppData('routeParams', combineParams);
    this.fwService
      .apiUpdateSiteTitle({ title: 'Trust Funds', link: '/tf' })
      .apiToggleLeftNav(true)
      .apiToggleHeaderControls({ settings: false, actions: false, help: true, isBeta: false, search: true })
      .apiToggleSplashScreen(false).apiActionMenuToggle(false);

    //this.tourStatus = true;

    this.powerbiRestService.getUserInfo().subscribe((user: any) => {
      if (this.powerbiRestService.takeatourStatus !== 'Complete') {
        this.powerbiRestService.gettakeatour(user.upi).subscribe((data: any) => {
          console.log('Tour ===> ', data);
          if (data.length > 0) {
            this.tourStatus = (data[0].tourstatus === 'false' ||
              (this.powerbiRestService.takeatourStatus === 'tourexception' || this.powerbiRestService.takeatourStatus === 'Start')) ? true : false;
          } else {
            this.tourStatus = true;
          }
        });
      }
    });

    this.powerbiRestService.tftakeatourvalidate.subscribe(data => {
      if (data === 'true') {
        this.powerbiRestService.takeatourStatus = 'tourexception';
        this.tourStatus = true;
        this.router.navigate(['tf'], { queryParams: this.activatedRoute.snapshot.queryParams });
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      let tempmenulist = [];
      tempmenulist = this.srServicesService.getTFMenuList(true);
      this.fwService
        .apiUpdateSiteTitle({ title: 'Standard Reports | Trust Funds', link: '/tf' })
        .apiSetLeftNavModel(tempmenulist)
        .apiToggleLeftNav(true)
        .apiToggleHeaderControls({ settings: false, actions: false, help: true, isBeta: false })
        .apiToggleSplashScreen(false).apiActionMenuToggle(false);
      this.fwService.apiTrackMyPageWithAppInsights({ pageName: 'Standard Reports - Trust Funds', subSections: [] });
    }, 100);

    if (sessionStorage.getItem('Standard Report Beta - Trust Fund - OVW') === null) {
      this.srServicesService.updateDashboardUsageStatsDetails('OVW');
    }
  }

  onSelectTab(value) {
    if (this.srServicesService.tabload === '1') {
      this.ActiveTab = value.id;
      this.spinner.show();
      setTimeout(() => {
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
