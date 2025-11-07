import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LeftNav, LeftNavBack } from '@framework/core/models/leftNav.model';
import { LogInUserInfo } from './../app/models/userInfo.model';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import cloneDeep from 'lodash-es/cloneDeep';

import {
  lendingFacetsConfig, portfolioFacetsConfig, cpfFacetsConfig, asaFacetsConfig, fmFacetsConfig, safeguardFacetsConfig, esfFacetsConfig, collaborationFacetsConfig,
  riskFacetsConfig, rasFacetsConfig, knowledgeFacetsConfig, sectorsandthemesFacetsConfig, genderFacetsConfig, infrastructureFacetsConfig, procurementFacetsConfig,
  tfLifecycleFacetsConfig, portfolioViewsFacetsConfig, factFacetsConfig, rmFacetsConfig, hrFacetsConfig, faFacetsConfig, rasdashboardFacetsConfig,
  fifsummaryReportConfig
} from '../app/daxqueryconfig/standard.collection.config';
import { ConfigurationService, FrameworkService, UserService } from '@framework/core/services';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '@framework/core/models';
import {
  ValueFormatterParams,
  ValueParserParams,
} from '@ag-grid-community/core';
import { CountUpOptions } from 'countup.js';
import { expand, filter, map, shareReplay, subscribeOn } from 'rxjs/operators';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MVPFacets } from 'app/daxqueryconfig/mvp.facets.query.config';
import { BusinessUnitViewsFacets } from 'app/daxqueryconfig/business-unit-views.facets.query.config';
import { TfpFacets } from 'app/daxqueryconfig/tfp.facets.query.config';
import { CoFFacets } from 'app/daxqueryconfig/cof.facets.query.config';
import { DisbursingAccFacets } from 'app/daxqueryconfig/disbursingacc.facets.query.config';
import { AgreementSignedFacets } from 'app/daxqueryconfig/agreementsigned.facets.query.config';
import { TfGrantsFacets } from 'app/daxqueryconfig/tfgrants.facets.query.config';
declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class SrServicesService {

  public userInfo: LogInUserInfo = {
    userName: '',
    userUpi: '',
    userWBAc: '',
    userEmail: '',
    companyCode: '',
    userVpu: '',
    userDept: '',
    userDeptLevel: '',
    userDeptDesc: '',
    usergroups: '',
    champion: '',
    powerOrHigher: '',
    reportingOrHigher: '',
    casualOrHigher: '',
    travelRole: '',
    idaRole: '',
    migaRole: '',
    ifcRole: '',
    hrRole: '',
    hrSecure: '',
    hrSalary: '',
    encryptedString: '',
    icisd2Factor: '',
    defaultPage: '',
    defaultUnitLevel: '',
    defaultUnitValue: '',
    defaultUnitDesc: '',
    defaultUnitGroup: '',
    hrIDRFlag: '',
    bpsvpFlag: '',
    ifcRMFlag: '',
    ldRMFlag: '',
    nonHrUser: '',
    wfaSuperUserFlag: '',
    userCity: '',
    userTitle: '',
    userCountry: '',
    miga2Factor: '',
    boUser: '',
  };
  public filteredunitCalc = 1000000000;
  public filteredunitCalcMillion = 1000000;
  public filteredunitCalcThousand = 1000;
  public filteredunitType = '$B';
  public filteredunitMillion = 'M';
  filterUnitlable = 'M';
  UserDetailsSubsribe: Observable<any>;
  user: Partial<User> = {
    upi: '',
    name: '',
    location: '',
    unit: '',
    vpuUnit: ''
  };
  public dashboardReqURL = '';
  public reportReqURL = '';
  public srappJSON: any;
  public OperationModules = [
    { name: 'Lending', path: '/ops/lending', value: 'lending', module: 'ops' }, { name: 'Portfolio', path: '/ops/portfolio', value: 'portfolio', module: 'ops' },
    { name: 'ASA', path: '/ops/asa', value: 'asa', module: 'ops' }, { name: 'RAS', path: '/ops/ras', value: 'ras', module: 'ops' }, { name: 'Country Engagement', path: '/ops/cpf', value: 'cpf', module: 'ops' },
    { name: 'Knowledge', path: '/ops/knowledge', value: 'knowledge', module: 'ops' }, { name: 'Risk', path: '/performance/risk', value: 'risk', module: 'performance' },
    { name: 'Collaboration', path: '/performance/collaboration', value: 'collaboration', module: 'performance' }, { name: 'Procurement', path: '/fiduciary/procurement', value: 'procurement', module: 'fiduciary' },
    { name: 'Financial Management', path: '/fiduciary/financialmanagement', value: 'financialmanagement', module: 'fiduciary' }, { name: 'Safeguards', path: '/esf&safeguard/safeguards', value: 'safeguards', module: 'ESF&Safeguard' },
    { name: 'Environmental & Social Framework', path: '/esf&safeguard/esf', value: 'esf', module: 'ESF&Safeguard' }, { name: 'Sectors & Themes', path: '/topics/sectorsthemes', value: 'sectorsthemes', module: 'topics' },
    { name: 'Gender', path: '/topics/gender', value: 'gender', module: 'topics' }, { name: 'Infrastructure', path: '/topics/infrastructure', value: 'infrastructure', module: 'topics' }
  ];

  /* public PerformanceModules = [{ name: 'Collaboration', path: '/performance/collaboration' }, { name: 'Risk', path: '/performance/risk' }];

  public FiduciaryModules = [{ name: 'Procurement', path: '/fiduciary/procurement' }, { name: 'Safeguards', path: '/fiduciary/safeguards' },
  { name: 'ESF', path: '/fiduciary/esf' }, { name: 'Financial Management', path: '/fiduciary/financialmanagement' }];

  public TopicModules = [{ name: 'Sectors & Themes', path: '/topics/sectorsthemes' }, { name: 'Gender', path: '/topics/gender' },
  { name: 'Infrastructure', path: '/topics/infrastructure' }]; */
  public PerformanceModules = [
    { name: 'Lending', path: '/ops/lending', value: 'lending', module: 'ops' }, { name: 'Portfolio', path: '/ops/portfolio', value: 'portfolio', module: 'ops' },
    { name: 'ASA', path: '/ops/asa', value: 'asa', module: 'ops' }, { name: 'RAS', path: '/ops/ras', value: 'ras', module: 'ops' }, { name: 'Country Engagement', path: '/ops/cpf', value: 'cpf', module: 'ops' },
    { name: 'Knowledge', path: '/ops/knowledge', value: 'knowledge', module: 'ops' }, { name: 'Risk', path: '/performance/risk', value: 'risk', module: 'performance' },
    { name: 'Collaboration', path: '/performance/collaboration', value: 'collaboration', module: 'performance' }, { name: 'Procurement', path: '/fiduciary/procurement', value: 'procurement', module: 'fiduciary' },
    { name: 'Financial Management', path: '/fiduciary/financialmanagement', value: 'financialmanagement', module: 'fiduciary' }, { name: 'Safeguards', path: '/esf&safeguard/safeguards', value: 'safeguards', module: 'ESF&Safeguard' },
    { name: 'Environmental & Social Framework', path: '/esf&safeguard/esf', value: 'esf', module: 'ESF&Safeguard' }, { name: 'Sectors & Themes', path: '/topics/sectorsthemes', value: 'sectorsthemes', module: 'topics' },
    { name: 'Gender', path: '/topics/gender', value: 'gender', module: 'topics' }, { name: 'Infrastructure', path: '/topics/infrastructure', value: 'infrastructure', module: 'topics' }
  ];
  public FiduciaryModules = [
    { name: 'Lending', path: '/ops/lending', value: 'lending', module: 'ops' }, { name: 'Portfolio', path: '/ops/portfolio', value: 'portfolio', module: 'ops' },
    { name: 'ASA', path: '/ops/asa', value: 'asa', module: 'ops' }, { name: 'RAS', path: '/ops/ras', value: 'ras', module: 'ops' }, { name: 'Country Engagement', path: '/ops/cpf', value: 'cpf', module: 'ops' },
    { name: 'Knowledge', path: '/ops/knowledge', value: 'knowledge', module: 'ops' }, { name: 'Risk', path: '/performance/risk', value: 'risk', module: 'performance' },
    { name: 'Collaboration', path: '/performance/collaboration', value: 'collaboration', module: 'performance' }, { name: 'Procurement', path: '/fiduciary/procurement', value: 'procurement', module: 'fiduciary' },
    { name: 'Financial Management', path: '/fiduciary/financialmanagement', value: 'financialmanagement', module: 'fiduciary' }, { name: 'Safeguards', path: '/esf&safeguard/safeguards', value: 'safeguards', module: 'ESF&Safeguard' },
    { name: 'Environmental & Social Framework', path: '/esf&safeguard/esf', value: 'esf', module: 'ESF&Safeguard' }, { name: 'Sectors & Themes', path: '/topics/sectorsthemes', value: 'sectorsthemes', module: 'topics' },
    { name: 'Gender', path: '/topics/gender', value: 'gender', module: 'topics' }, { name: 'Infrastructure', path: '/topics/infrastructure', value: 'infrastructure', module: 'topics' }
  ];
  public TopicModules = [
    { name: 'Lending', path: '/ops/lending', value: 'lending', module: 'ops' }, { name: 'Portfolio', path: '/ops/portfolio', value: 'portfolio', module: 'ops' },
    { name: 'ASA', path: '/ops/asa', value: 'asa', module: 'ops' }, { name: 'RAS', path: '/ops/ras', value: 'ras', module: 'ops' }, { name: 'Country Engagement', path: '/ops/cpf', value: 'cpf', module: 'ops' },
    { name: 'Knowledge', path: '/ops/knowledge', value: 'knowledge', module: 'ops' }, { name: 'Risk', path: '/performance/risk', value: 'risk', module: 'performance' },
    { name: 'Collaboration', path: '/performance/collaboration', value: 'collaboration', module: 'performance' }, { name: 'Procurement', path: '/fiduciary/procurement', value: 'procurement', module: 'fiduciary' },
    { name: 'Financial Management', path: '/fiduciary/financialmanagement', value: 'financialmanagement', module: 'fiduciary' }, { name: 'Safeguards', path: '/esf&safeguard/safeguards', value: 'safeguards', module: 'ESF&Safeguard' },
    { name: 'Environmental & Social Framework', path: '/esf&safeguard/esf', value: 'esf', module: 'ESF&Safeguard' }, { name: 'Sectors & Themes', path: '/topics/sectorsthemes', value: 'sectorsthemes', module: 'topics' },
    { name: 'Gender', path: '/topics/gender', value: 'gender', module: 'topics' }, { name: 'Infrastructure', path: '/topics/infrastructure', value: 'infrastructure', module: 'topics' }
  ];
  // public TrustFundsModules = [
  //   { name: 'TF Lifecycle', path: '/tf/tflifecycle', value: 'tflifecycle', module: 'IBRD IDA TFs' }, { name: 'Business Unit Views', path: '/tf/businessunitviews', value: 'businessunitviews', module: 'IBRD IDA TFs' },
  //   { name: 'Portfolio Views', path: '/tf', value: 'fifs', module: 'FIFs' }, { name: 'MVP', path: '/tf/mvp', value: 'mvp', module: 'IBRD IDA TFs' }, { name: 'FAcT', path: '/tf/fact', value: 'fact', module: 'IBRD IDA TFs' },
  //   { name: 'Umbrella Program', path: '/tf/umbrellaprogram', value: 'umbrellaprogram', module: 'IBRD IDA TFs' }, { name: 'Trustee TTL', path: '/tf/trusteettl', value: 'trusteettl', module: 'Persona Views' },
  //   { name: 'TFP', path: '/tf/tfp', value: 'tfp', module: 'IBRD IDA TFs' }, { name: 'COF', path: '/tf/cof', value: 'cof', module: 'IBRD IDA TFs' }, { name: 'Agreement Signed', path: '/tf/agreementsigned', value: 'agreementsigned', module: 'IBRD IDA TFs' },
  //   { name: 'Disbursing Accounts', path: '/tf/disbursingaccounts', value: 'disbursingaccounts', module: 'IBRD IDA TFs' }, { name: 'TF Grants', path: '/tf/tfgrants', value: 'tfgrants', module: 'IBRD IDA TFs' },
  //   { name: 'Persona Views', path: '/tf/personaviewsumbrellaprogram', value: 'personaviewsumbrellaprogram', module: 'IBRD IDA TFs' }
  // ];

  public TrustFundsModules = [
    { name: 'TF Lifecycle', path: '/tf1/tflifecycle', value: 'tflifecycle', module: 'IBRD IDA TFs' }, { name: 'Business Unit Views', path: '/tf1/businessunitviews', value: 'businessunitviews', module: 'IBRD IDA TFs' },
    { name: 'MVP', path: '/tf1/mvp', value: 'mvp', module: 'IBRD IDA TFs' },
    { name: 'TF Grants', path: '/tf1/tfgrants', value: 'tfgrants', module: 'IBRD IDA TFs' },
    { name: 'Persona Views - Umbrella Program Manger', path: '/tf1/personaviewsumbrellaprogram', value: 'personaviewsumbrellaprogram', module: 'IBRD IDA TFs' }, { name: 'FAcT', path: '/tf1/fact', value: 'fact', module: 'IBRD IDA TFs' }
  ];

  public filterFlagupdate: any = '';
  public srdrilldownJSON: any;
  public reportsDetails: any;
  public dashboardWidgetDetails: any;
  public sectionReportlist: any;
  FilterMillion: any = 1000000;
  public sector_select_tab: any = 'Lending';
  public sector_subselect_tab: any = 'NoOfProject';
  public tabselect = 1;
  RiskTabselectedVal = 'Preparation';
  public PageModuleName: any;
  public sectionReportColumnlist: any = [];
  public facetFilter = [];
  public CoFinChartFilterData = [];
  public facetFilterQueryParams = '';
  BPSFilter: any = '';
  bps_timing: any = '';
  public PageLoad: any = 1;
  public CoFinreportClick = '1';
  public RmovefilterData = new Subject();
  public ClearfilterData = new Subject();
  public filterData = new Subject();
  public DataApplymillionk = new Subject();
  public CO_FinacefilterData = new Subject();
  public CO_FinaceAfDBData = new Subject();
  public CO_FinaceBannerfilter = new Subject();
  public Co_Fin_AgGridApply = new Subject();
  public HomePagTabActive = new Subject();
  public HomeIBRDIDATabActive = new Subject();
  public getReportName = new Subject();
  homepagetab: any = '1';
  TFHomepageTab: any = 'Overview';
  TFMvpHomePageTab = '';
  ibrdidaHometab = 'BusinessProcesses';
  public customFilter = '';
  public FavReportData: any = '';
  public DataGrid: any = [];
  public windowpath = window.location.pathname;
  public reportDotNetReqURL = '';
  TrackReform: any = '';
  Trackworkinpros: any = '';
  CoFinancData: any;
  TrackResTLL: any = '';
  TrackLead: any = '';
  public APiCofinanceData = [];
  public dashboardDotNetReqURL = '';
  public EnvDatasourceDetails = [];
  tftabmodule: any = 'Overview';
  public FilterLoad: Observable<any>;
  public routeappData: any;
  public risktype = new BehaviorSubject('Preparation');
  public collaborationtype = new BehaviorSubject('All');
  public sectorsTeamesSectiontype = new BehaviorSubject('Lending');
  public sectorsTeamesSubSectiontype = new BehaviorSubject('NoOfProject');
  public infrastructureSectiontype = new BehaviorSubject('CommitmentbySector');
  public CollaborationReport_Cl1_Type = new BehaviorSubject('Lending');
  public CollaborationReport_Cl2_Type = new BehaviorSubject('Project');
  public RiskReport_R2_Type = new BehaviorSubject('Pipeline');
  public FMReport_FM1_Type = new BehaviorSubject('ProjectRisk');
  public tfDrillthroughReport = new Subject();
  public tffifsDrillthroughTable = new Subject();
  public drillSelectedreportID = [];
  public fifscontributionselectedfundID = '';
  public InfrastructureTabselectedVal = 'CommitmentbySector';
  public resTTL = '';
  public Status = '';
  GetMVPCategoryChange = new EventEmitter();
  public sectorsTeamesTreemapcolorcode = ['#3086c8', '#5998c9', '#6da1c9', '#81a9c9', '#8aadc9', '#8fafc9', '#91b0c9', '#93b1c9', '#9cb5c9', '#a7baca', '#cacaca', '#e4e1e1'];
  opts: CountUpOptions = {
    enableScrollSpy: true,
  };
  FilerResponse = [];
  PageModule: string;
  selectedDrillWidgetDetail = [];
  RemoveFilterFlag: string;
  powerBIReportexportReq = '';
  hrModuleName: string;
  rmModuleName: string;
  favreportpageload = '2';
  getpageload: string;
  tabload = '2';
  public MvpCategoryView = 'WBG Portfolio';
  dotnetservicereportIDs = ['P5.8', 'Cl2.2b', 'A9.2', 'ESF5.0']; // For more datas add report key in this array
  public taskTitle: any = '';
  trackwidgetTitle: any;
  TrackTabActive = '1';
  Impactvalues: any = '';
  sharepointURL = '';
  coFinUrl = '';
  tfhomecontriflag: any = '1';
  tfhomeannualflag: any = '1';
  selectedDonor = [];
  selectedfy = ['FY26'];
  drillSelecteddashboardOpt = [];
  selectedUmbrellaProgram = '';
  selectedTrusteeTTL = '';
  selectedUmbrellaPrgm = '';
  selectedUmbrellaPrgmMgrName: string = '';
  selectedTrusteeTTLName: string = '';
  fifscontibutionTitle = '';
  CoFilterDatas = []; // [{ 'category': 'Proj Status Name', name: 'Active' }];
  codefaultyear = [];
  CofinanceActiveTab = 'Co-financing Portfolio'; // Co-financing Portfolio, Co-Financier Dashboard
  projectCoFinFlag = 'other';
  coAfDBselectItem: any[];
  srExecutionTime = 0;
  coFinFlag: any = 'cofin';
  rmselectedcurrfy = '';
  rmselectedprevfy = '';
  rmcurprevCustomfilter = '';
  rmunitlevel = 'vpu';
  bpsdataasofdate = '';
  datauploadutilityurl = '';
  sustainabilitysharepointList = '';
  previousUrl = '';

  constructor(public userService: UserService, @Inject(DOCUMENT) document: any,
    public configService: ConfigurationService, public Actroute: ActivatedRoute,
    public fwService: FrameworkService, public http: HttpClient, private router: Router) {
    this.getUserInfo().pipe(shareReplay()).subscribe((userData: any) => {
      // tslint:disable-next-line:no-console
      console.log(userData, 'LoggedIn User Details ==>', this.userInfo);
      this.getUserData(userData);
    });

    this.reportReqURL = environment.azurePostReportDaxRequestURL;
    this.dashboardReqURL = environment.azurePostDashboardRequestURL;
    this.reportDotNetReqURL = environment.azurePostReportDotNetRequestURL;
    this.dashboardDotNetReqURL = environment.azurePostDashboardDotNetRequestURL;
    this.powerBIReportexportReq = environment.resourceURL[0];
    this.sharepointURL = environment.resourceURL[1];
    this.coFinUrl = environment.resourceURL[2];
    this.datauploadutilityurl = environment.resourceURL[0];
    this.EnvDatasourceDetails = environment.DatasourceDetails;
    this.sustainabilitysharepointList = environment.sustainabilitysharepointList;

    this.opts = {
      decimalPlaces: 2,
      separator: ',',
      duration: 2,
    };

    this.rmselectedcurrfy = '2024';
    // tslint:disable-next-line:radix
    this.rmselectedprevfy = (parseInt(this.rmselectedcurrfy) - 1).toString();
    this.onInitialLoad();
  }
  getUserData(userData) {
    // console.log('userData =>>>>>', userData)
    return this.http.get('https://reports.worldbank.org/BIPortalSecurity/rest/bisecurity/getUserProfile?input={"userUpi":"' + userData.upi + '"}').pipe(map((userProfile1: any) => {
      if (userProfile1.userVpu === null) {
        userProfile1.userVpu = userData.vpuUnit + 'VP';
      }
      if (userProfile1.userDept === null || userProfile1.userDept === '' || userProfile1.userDept === undefined) {
        userProfile1.userName = (userProfile1.userName === '' || userProfile1.userName === null) ? userData.name : userProfile1.userName;
        userProfile1.userUpi = (userProfile1.userUpi === '' || userProfile1.userUpi === null) ? userData.upi : userProfile1.userUpi;
        userProfile1.userDept = (userProfile1.userDept === '' || userProfile1.userDept === null) ? userData.unit : userProfile1.userDept;
        userProfile1.userName = (userProfile1.userName === '' || userProfile1.userName === null) ? userData.name : userProfile1.userName;
        userProfile1.companyCode = (userProfile1.companyCode === '' || userProfile1.companyCode === null) ? userData.companyName : userProfile1.companyCode;
      }
      this.userInfo = userProfile1;
      // tslint:disable-next-line: no-console
      // console.log('LoggedIn User Details sruserInfo ==>', this.userInfo);
      localStorage.setItem('sruserInfo', JSON.stringify(this.userInfo));
    }));
  }
  getHomePageDetail() {
    const response = JSON.parse(JSON.stringify(require('../assets/json/sr-dashboard.json')));
    return response;
  }
  onInitialLoad() {
    this.routeappData = this.fwService.apiGetAppData('routeParams');
    this.LoadFilterData();
    this.loadappData();
  }
  loadappData() {
    // For Testing
    /* this.daxJSONreq().subscribe(data => {
      // tslint:disable-next-line:no-console
      console.log('daxJSONreq data ==>', data);
    }); */
    this.routeappData = this.fwService.apiGetAppData('routeParams');
    if (this.routeappData !== undefined) {
      if (this.routeappData.module === 'Trust Funds New') {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/trustfundsapp.json')));
        // this.sectionReportlist = this.getReportListJSON();
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'External Funds');
      }
      // else if (this.routeappData.module === 'Trust Funds') {
      //   this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/tfapp.json')));
      //   // this.sectionReportlist = this.getReportListJSON();
      //   this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'External Funds');
      // } 
      else if (this.routeappData.module === 'BPS') {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/rmapp.json')));
        // this.sectionReportlist = this.getReportListJSON();
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'BPS');
      } else if (this.routeappData.module === 'Human Resource') {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/hrapp.json')));
        // this.sectionReportlist = this.getReportListJSON();
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'Human Resource');
      } else if (this.routeappData.module === 'Finance & Accounting') {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
        // this.sectionReportlist = this.getReportListJSON();
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'Finance & Accounting');
      } else if (this.routeappData.module === 'RAS Dashboard') {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/rasapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'RAS Dashboard');
      } else {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/srapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'Standard Reports');

        const trmappJSON = JSON.parse(JSON.stringify(require('../assets/json/rmapp.json')));
        const rmjsondata = trmappJSON.DashboardWidget.find(x => x.title === 'BPS');
        const tsrappJSON = JSON.parse(JSON.stringify(require('../assets/json/srapp.json')));
        const srjsondata = tsrappJSON.DashboardWidget.find(x => x.title === 'Standard Reports');
        const thrappJSON = JSON.parse(JSON.stringify(require('../assets/json/hrapp.json')));
        const hrjsondata = thrappJSON.DashboardWidget.find(x => x.title === 'Human Resource');
        const tfinaccappJSON = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
        const finaccjsondata = tfinaccappJSON.DashboardWidget.find(x => x.title === 'Finance & Accounting');
        const rasppJSON = JSON.parse(JSON.stringify(require('../assets/json/rasapp.json')));
        const rasjsondata = rasppJSON.DashboardWidget.find(x => x.title === 'RAS Dashboard');
        const tfppJSON = JSON.parse(JSON.stringify(require('../assets/json/trustfundsapp.json')));
        const tfppjsondata = tfppJSON.DashboardWidget.find(x => x.title === 'External Funds');

        this.dashboardWidgetDetails.graphUrls = [...rmjsondata.graphUrls, ...hrjsondata.graphUrls, ...srjsondata.graphUrls, ...finaccjsondata.graphUrls, ...rasjsondata.graphUrls,
        ...tfppjsondata.graphUrls];

      }
    } else {
      const combineParams = {
        module: 'Standard Reports',
        section: 'Home',
        path: window.location.pathname,
        Facets: ''
      };
      combineParams.module = 'Standard Reports';
      combineParams.section = 'Home';
      combineParams.path = window.location.pathname;
      combineParams.Facets = '';
      // this.fwService.apiSetAppData('routeParams', combineParams);
      if (window.location.pathname.indexOf('/tf') !== -1 || window.location.pathname.indexOf('/businessunitviews') !== -1) {
        // combineParams.module = 'Trust Funds';
        // this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/tfapp.json')));
        // this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'External Funds');
        combineParams.module = 'Trust Funds New';
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/trustfundsapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'External Funds');
      } else if (window.location.pathname.indexOf('/bps') !== -1) {
        combineParams.module = 'BPS';
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/rmapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'BPS');
      } else if (window.location.pathname.indexOf('/hr') !== -1) {
        combineParams.module = 'Human Resource';
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/hrapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'Human Resource');
      } else if (window.location.pathname.indexOf('accounting') !== -1) {
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'Finance & Accounting');
      } else if (window.location.pathname.indexOf('rasdashboard') !== -1) {
        combineParams.module = 'RAS Dashboard';
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/rasapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'RAS Dashboard');
      }
      // else if (window.location.pathname.indexOf('trust-funds') !== -1) {
      //   combineParams.module = 'Trust Funds New';
      //   this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/trustfundsapp.json')));
      //   this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'External Funds');
      // } 
      else {
        combineParams.module = 'Standard Reports';
        this.srappJSON = JSON.parse(JSON.stringify(require('../assets/json/srapp.json')));
        this.dashboardWidgetDetails = this.srappJSON.DashboardWidget.find(x => x.title === 'Standard Reports');
      }
      const pathname = window.location.pathname;
      const trmappJSON = JSON.parse(JSON.stringify(require('../assets/json/rmapp.json')));
      const rmjsondata = trmappJSON.DashboardWidget.find(x => x.title === 'BPS');
      const tsrappJSON = JSON.parse(JSON.stringify(require('../assets/json/srapp.json')));
      const srjsondata = tsrappJSON.DashboardWidget.find(x => x.title === 'Standard Reports');
      const thrappJSON = JSON.parse(JSON.stringify(require('../assets/json/hrapp.json')));
      const hrjsondata = thrappJSON.DashboardWidget.find(x => x.title === 'Human Resource');
      const tfinaccappJSON = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
      const finaccjsondata = tfinaccappJSON.DashboardWidget.find(x => x.title === 'Finance & Accounting');
      const rasppJSON = JSON.parse(JSON.stringify(require('../assets/json/rasapp.json')));
      const rasjsondata = rasppJSON.DashboardWidget.find(x => x.title === 'RAS Dashboard');
      // const tfppJSON = JSON.parse(JSON.stringify(require('../assets/json/tfapp.json')));
      // const tfppjsondata = tfppJSON.DashboardWidget.find(x => x.title === 'External Funds');
      const trustFundAppJSON = JSON.parse(JSON.stringify(require('../assets/json/trustfundsapp.json')));
      const trustfundAppjsondata = trustFundAppJSON.DashboardWidget.find(x => x.title === 'External Funds');
      this.dashboardWidgetDetails.graphUrls = [...rmjsondata.graphUrls, ...hrjsondata.graphUrls, ...srjsondata.graphUrls, ...finaccjsondata.graphUrls, ...rasjsondata.graphUrls,
      ...trustfundAppjsondata.graphUrls];
      this.fwService.apiSetAppData('routeParams', combineParams);
    }
  }
  loadGraphUrlData() {
    const trmappJSON = JSON.parse(JSON.stringify(require('../assets/json/rmapp.json')));
    const rmjsondata = trmappJSON.DashboardWidget.find(x => x.title === 'BPS');
    const tsrappJSON = JSON.parse(JSON.stringify(require('../assets/json/srapp.json')));
    const srjsondata = tsrappJSON.DashboardWidget.find(x => x.title === 'Standard Reports');
    const thrappJSON = JSON.parse(JSON.stringify(require('../assets/json/hrapp.json')));
    const hrjsondata = thrappJSON.DashboardWidget.find(x => x.title === 'Human Resource');
    const tfinaccappJSON = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
    const finaccjsondata = tfinaccappJSON.DashboardWidget.find(x => x.title === 'Finance & Accounting');
    const rasppJSON = JSON.parse(JSON.stringify(require('../assets/json/rasapp.json')));
    const rasjsondata = rasppJSON.DashboardWidget.find(x => x.title === 'RAS Dashboard');
    const tfppJSON = JSON.parse(JSON.stringify(require('../assets/json/trustfundsapp.json')));
    const tfppjsondata = tfppJSON.DashboardWidget.find(x => x.title === 'External Funds');

    this.dashboardWidgetDetails.graphUrls = [...rmjsondata.graphUrls, ...hrjsondata.graphUrls, ...srjsondata.graphUrls, ...finaccjsondata.graphUrls, ...rasjsondata.graphUrls,
    ...tfppjsondata.graphUrls];
    return this.dashboardWidgetDetails.graphUrls;
  }

  getDrilldownjsonData() {
    // DrillDown details
    if (window.location.pathname.indexOf('lending') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/lendingdrilldown.json')));
    } else if (window.location.pathname.indexOf('portfolio') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/portfoliodrilldown.json')));
    } else if (window.location.pathname.indexOf('asa') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/asadrilldown.json')));
    } else if (window.location.pathname.indexOf('ras') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/rasdrilldown.json')));
    } else if (window.location.pathname.indexOf('cpf') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/cpfdrilldown.json')));
    } else if (window.location.pathname.indexOf('knowledge') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/knowledgedrilldown.json')));
    } else if (window.location.pathname.indexOf('risk') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/riskdrilldown.json')));
    } else if (window.location.pathname.indexOf('collaboration') !== -1 && window.location.pathname.indexOf('bps') === -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/collaborationdrilldown.json')));
    } else if (window.location.pathname.indexOf('procurement') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/procurementdrilldown.json')));
    } else if (window.location.pathname.indexOf('safeguards') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/safeguarddrilldown.json')));
    } else if (window.location.pathname.indexOf('esf') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/esfdrilldown.json')));
    } else if (window.location.pathname.indexOf('financialmanagement') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/financialdrilldown.json')));
    } else if (window.location.pathname.indexOf('sectorsthemes') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/sectorandthemesdrilldown.json')));
    } else if (window.location.pathname.indexOf('infrastructure') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/infrastructuredrilldown.json')));
    } else if (window.location.pathname.indexOf('gender') !== -1) {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/genderdrilldown.json')));
    } else {
      this.srdrilldownJSON = JSON.parse(JSON.stringify(require('../assets/drilldownconfig/lendingdrilldown.json')));
    }
  }
  GetHrJsonData() {
    // tslint:disable-next-line:no-console
    console.log('environment ==>', environment.appEnv);
    const Datas = JSON.parse(JSON.stringify(require('../assets/json/hrapp.json')));
    if (environment.omnitureEnv === 'prod') {
      return Datas.powerBIReportsProd;
    } else if (environment.omnitureEnv === 'qa') {
      return Datas.powerBIReportsQA;
    } else {
      return Datas.powerBIReports;
    }
  }
  GetRmJsonData() {
    const Datas = JSON.parse(JSON.stringify(require('../assets/json/rmapp.json')));
    if (environment.omnitureEnv === 'prod') {
      return Datas.powerBIReportsProd;
    } else if (environment.omnitureEnv === 'qa') {
      return Datas.powerBIReportsQA;
    } else {
      return Datas.powerBIReports;
    }
  }
  GetAccountingJsonData() {
    const Datas = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
    return Datas.powerBIReports;
  }
  GetAccountingReportJsonData() {
    const Datas = JSON.parse(JSON.stringify(require('../assets/json/finaccapp.json')));
    return Datas.powerBIReports;
  }
  GetRasJsonData() {
    const Datas = JSON.parse(JSON.stringify(require('../assets/json/rasapp.json')));
    return Datas.powerBIReports;
  }
  trackingToolDetail() {
    this.router.navigate(['/bps_reforms_ideas/detail']);
  }
  public getUserDetails() {
    this.UserDetailsSubsribe = new Observable(userProfileObj => {

      if (localStorage.getItem('sruserInfo') || (this.user != null && this.userInfo != null)) {
        if (!(this.userInfo != null)) {
          this.userInfo = JSON.parse(localStorage.getItem('sruserInfo'));
          userProfileObj.next(this.userInfo);
          userProfileObj.complete();
        }
      } else {
        // tslint:disable-next-line: deprecation
        this.getUserInfo().pipe(shareReplay()).subscribe((userData: any) => {
          this.user = userData;
          userProfileObj.next(this.userInfo);
          userProfileObj.complete();
        });
      }
    }).pipe(shareReplay());
    return this.UserDetailsSubsribe;
  }

  getUserInfo() {
    return new Observable(userObj => {
      this.userService.getLoggedInUser().pipe(filter(item => item !== undefined && item !== null))
        // tslint:disable-next-line: deprecation
        .subscribe((user: any) => {
          this.user = user;
          if (this.userInfo.userVpu === null || this.userInfo.userVpu === '') {
            this.userInfo.userVpu = user.vpuUnit + 'VP';
          }
          this.userInfo.userUpi = this.user.upi;
          this.userInfo.userDept = this.user.unit;
          this.userInfo.userName = this.user.name;
          // this.userInfo.userVpu = this.user.vpuUnit;
          this.userInfo.userEmail = this.userService.getLoggedUserEmail();
          this.getUserData(user);
          localStorage.setItem('sruserInfo', JSON.stringify(this.userInfo));
          userObj.next(this.user);
          userObj.complete();
        }
        );
    }).pipe(shareReplay());
  }

  getUserProfile(upi) {
    return this.http.get('https://reports.worldbank.org/BIPortalSecurity/rest/bisecurity/getUserProfile?input={"userUpi":"' + upi + '"}');
  }


  /**** Dashboard Widget Request URL ****/

  getapiwidgetdataload(selectedwidgetId: any) {
    if (this.dashboardWidgetDetails.graphUrls.length === 0) {
      this.dashboardWidgetDetails.graphUrls = this.loadGraphUrlData();
    }

    const daxDetail: any = this.dashboardWidgetDetails.graphUrls.filter(x => x.id === selectedwidgetId);

    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === daxDetail[0].environmentName);
    const jsondata = {
      ignoreCache: true,
      query: this.getDaxJSONData(daxDetail),
      datasource: envdatasourceData[0].dataSource,
      InitialCatalog: envdatasourceData[0].InitialCatalog,
      dataSetId: envdatasourceData[0].dataSetId
    };
    // tslint:disable-next-line:no-console
    console.log(daxDetail[0].widgetTitle, ' Request URL ==>', jsondata.query);
    const reqURL = this.dashboardReqURL;
    /* if (this.windowpath.indexOf('home-dnetdaxquery') !== -1) {
      reqURL = this.dashboardDotNetReqURL;
    } */
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata;
    }));
  }
  getrmReportdataload(selectedReportDetail: any) { //
    const jsondata = {
      queries: [
        {
          query: this.getDaxJSONData(selectedReportDetail)
        }
      ],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === selectedReportDetail[0].environmentName);
    // tslint:disable-next-line:no-console
    //    console.log(selectedReportDetail[0].title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    // https://standardreportsbetaqaapi.asestg.worldbank.org/api/PowerBIRS/getDaxQueryResult
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    /* if (this.windowpath.indexOf('home-dnetdaxquery') !== -1) {
      reqURL = this.dashboardDotNetReqURL;
    } */
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata;
    }));
  }
  getrmapiwidgetdataload(selectedwidgetId: any) {
    const daxDetail = this.dashboardWidgetDetails.graphUrls.filter(x => x.id === selectedwidgetId);
    const jsondata = {
      queries: [
        {
          query: this.getDaxJSONData(daxDetail)
        }
      ],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === daxDetail[0].environmentName);
    // tslint:disable-next-line:no-console
    console.log(daxDetail[0].title, ' Request URL ==>ss', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    // https://standardreportsbetaqaapi.asestg.worldbank.org/api/PowerBIRS/getDaxQueryResult
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    /* if (this.windowpath.indexOf('home-dnetdaxquery') !== -1) {
      reqURL = this.dashboardDotNetReqURL;
    } */
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata;
    }));
  }
  // AG Grid selected Report Dax query logic
  getReportApidataload(selectedreport: any) {
    this.getDrilldownjsonData();
    const paths = window.location.pathname;
    const daxDetail = selectedreport; // this.dashboardWidgetDetails.reportUrls.filter(x => x.title === 'Lending Report');
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === daxDetail[0].environmentName);
    const jsondata = {
      ignoreCache: true,
      query: this.getDaxJSONData(daxDetail),
      datasource: envdatasourceData[0].dataSource,
      InitialCatalog: envdatasourceData[0].InitialCatalog,
      dataSetId: envdatasourceData[0].dataSetId
    };
    // tslint:disable-next-line:no-console
    console.log(daxDetail[0].title, 'daxQuery ==>', jsondata.query);
    let reqURL = this.reportReqURL;
    // if (this.windowpath.indexOf('home-dnetdaxquery') !== -1) {
    if (this.dotnetservicereportIDs.indexOf(selectedreport[0].key) !== -1) {
      reqURL = this.reportDotNetReqURL;
    }
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata;
    }));
  }
  getDaxJSONData(daxDetail: any) { // tfwid007
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = { headers: headers };
    let basequery = '';
    let basefilter = '';
    if (daxDetail[0].basequery !== '') {
      basequery = daxDetail[0].basequery;
      if ((daxDetail[0].basefilter !== '' || daxDetail[0].basecolumn !== '' || this.customFilter !== '')
        && daxDetail[0].queryType !== 'EVALUATE CALCULATETABLE' && daxDetail[0].id !== 'lastupdates01') {
        basequery += ',';
      }
    }

    if (this.customFilter !== '') {
      if (['tfwid016a'].indexOf(daxDetail[0].id) > -1 || ['tfswid067d'].indexOf(daxDetail[0].id) > -1) {
        let tempselectedFilterCategory = this.facetFilter.filter(element => element.category === 'Verticals');
        let cusfilter = '';
        if (tempselectedFilterCategory.length > 0) {
          let tempval = '';
          this.facetFilter.forEach(element => {
            if (element.category === 'Verticals') {
              tempval += '"' + element.value + '"';
              /* element.value.value.forEach((element1, index1) => {
                tempval += '"' + element1 + '"';
                if (index1 < (element.value.value.length - 1)) {
                  tempval += ',';
                }
              }); */
            }
          });
          // tslint:disable-next-line:max-line-length
          cusfilter += 'KEEPFILTERS( FILTER( ALL( \'BU Attributes\'[VPU Group] ), NOT( \'BU Attributes\'[VPU Group] IN {' + tempval + '} ))),';
          cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, Trustee[Trustee VPU Group Code] ))';
        } else {
          tempselectedFilterCategory = this.facetFilter.filter(element => element.category === 'Practice List' ||
            element.category === 'Region' || element.category === 'Central Unit');
          if (tempselectedFilterCategory.length > 0) {
            let tempval = '';
            this.facetFilter.forEach(element => {
              if (element.category !== 'Verticals') {
                tempval += '"' + element.value + '"';
                /* element.value.value.forEach((element1, index1) => {
                  tempval += '"' + element1 + '"';
                  if (index1 < (element.value.value.length - 1)) {
                    tempval += ',';
                  }
                }); */
              }
            });
            // tslint:disable-next-line:max-line-length
            cusfilter += 'KEEPFILTERS( FILTER( ALL( \'BU Attributes\'[Business Unit Code] ), NOT( \'BU Attributes\'[Business Unit Code] IN {' + tempval + '} ))),';
            cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, Trustee[Trustee BU Code] ))';
          }
        }
        basefilter = daxDetail[0].basefilter + ',' + cusfilter;
        if (daxDetail[0].basecolumn !== '') {
          basefilter += ',';
        }
        // console.log(cusfilter, 'tfwid016a ==>', basefilter);
      } else if (['tfwid022a', 'tfswid087b'].indexOf(daxDetail[0].id) > -1) {
        let tempselectedFilterCategory = this.facetFilter.filter(element => element.category === 'Verticals');
        let cusfilter = '';
        if (tempselectedFilterCategory.length > 0) {
          let tempval = '';
          this.facetFilter.forEach(element => {
            if (element.category === 'Verticals') {
              tempval += '"' + element.value + '"';
              /* element.value.value.forEach((element1, index1) => {
                tempval += '"' + element1 + '"';
                if (index1 < (element.value.value.length - 1)) {
                  tempval += ',';
                }
              }); */
            }
          });
          // tslint:disable-next-line:max-line-length
          // cusfilter += 'KEEPFILTERS( FILTER( ALL( Trustee[Trustee VPU Group Code]  ), NOT( Trustee[Trustee VPU Group Code]  IN {' + tempval + '} ))),';
          // cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, \'BU Attributes\'[VPU Group] ))';
          cusfilter += 'KEEPFILTERS( FILTER( ALL( \'BU Attributes\'[VPU Group]   ), NOT( \'BU Attributes\'[VPU Group]   IN {' + tempval + '} ))),';
          cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, Trustee[Trustee VPU Group Code] ))';
        } else {
          tempselectedFilterCategory = this.facetFilter.filter(element => element.category === 'Practice List' ||
            element.category === 'Region' || element.category === 'Central Unit');
          if (tempselectedFilterCategory.length > 0) {
            let tempval = '';
            this.facetFilter.forEach(element => {
              if (element.category !== 'Verticals') {
                tempval += '"' + element.value + '"';
                /* element.value.value.forEach((element1, index1) => {
                  tempval += '"' + element1 + '"';
                  if (index1 < (element.value.value.length - 1)) {
                    tempval += ',';
                  }
                }); */
              }
            });
            // tslint:disable-next-line:max-line-length
            cusfilter += 'KEEPFILTERS( FILTER( ALL( \'BU Attributes\'[Business Unit Code] ), NOT( \'BU Attributes\'[Business Unit Code] IN {' + tempval + '} ))),';
            cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, Trustee[Trustee BU Code] ))';
          }
        }
        basefilter = daxDetail[0].basefilter + ',' + cusfilter;
        if (daxDetail[0].basecolumn !== '') {
          basefilter += ',';
        }
        // console.log(cusfilter, 'tfwid016a ==>', basefilter);
      } else if (['tfwid022', 'tfswid087a'].indexOf(daxDetail[0].id) > -1) {
        let tempselectedFilterCategory = this.facetFilter.filter(element => element.category === 'Verticals');
        let cusfilter = '';
        if (tempselectedFilterCategory.length > 0) {
          let tempval = '';
          this.facetFilter.forEach(element => {
            if (element.category === 'Verticals') {
              tempval += '"' + element.value + '"';
              /* element.value.value.forEach((element1, index1) => {
                tempval += '"' + element1 + '"';
                if (index1 < (element.value.value.length - 1)) {
                  tempval += ',';
                }
              }); */
            }
          });
          // tslint:disable-next-line:max-line-length
          cusfilter += 'KEEPFILTERS( FILTER( ALL( Trustee[Trustee VPU Group Code]  ), NOT( Trustee[Trustee VPU Group Code]  IN {' + tempval + '} ))),';
          cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, \'BU Attributes\'[VPU Group] ))';
        } else {
          tempselectedFilterCategory = this.facetFilter.filter(element => element.category === 'Practice List' ||
            element.category === 'Region' || element.category === 'Central Unit');
          if (tempselectedFilterCategory.length > 0) {
            let tempval = '';
            this.facetFilter.forEach(element => {
              if (element.category !== 'Verticals') {
                tempval += '"' + element.value + '"';
                /* element.value.value.forEach((element1, index1) => {
                  tempval += '"' + element1 + '"';
                  if (index1 < (element.value.value.length - 1)) {
                    tempval += ',';
                  }
                }); */
              }
            });
            // tslint:disable-next-line:max-line-length
            cusfilter += 'KEEPFILTERS( FILTER( ALL( Trustee[Trustee BU Code] ), NOT( Trustee[Trustee BU Code] IN {' + tempval + '} ))),';
            cusfilter += 'KEEPFILTERS( TREATAS( {' + tempval + '}, \'BU Attributes\'[Business Unit Code] ))';
          }
        }
        basefilter = daxDetail[0].basefilter + ',' + cusfilter;
        if (daxDetail[0].basecolumn !== '') {
          basefilter += ',';
        }
        // console.log(cusfilter, 'tfwid016a ==>', basefilter);
      } else {
        if (daxDetail[0].basefilter !== '') {
          if (['rmwid003', 'rmwid004', 'rmwid005', 'rmwid006'].indexOf(daxDetail[0].id) !== -1) {
            basefilter = daxDetail[0].basefilter + ',' + this.rmcurprevCustomfilter;
          } else {
            let newcustomfilter = ''
            if (daxDetail[0].id !== 'tfswid094g' && daxDetail[0].id !== 'tfswid095' && daxDetail[0].id !== 'tfswid095a' && (window.location.pathname.includes('tf/landing-fifs/fif-summary-report') || window.location.pathname.includes('tf/landing-fifs/portfolioview-report'))) {
              newcustomfilter = this.customFilter.replace('KEEPFILTERS (TREATAS ({1},Parameter[Parameter Order])),', '');
              newcustomfilter = this.customFilter.replace('KEEPFILTERS (TREATAS ({0},Parameter[Parameter Order])),', '');
              basefilter = daxDetail[0].basefilter + ',' + newcustomfilter;
            } else {
              let customFilterData = this.customFilter;
              if (['tfswid081', 'tfswid081a', 'tfswid078', 'tfswid074', 'tfswid075a', 'tfswid080', 'tfswid083', 'tfswid083a', 'tfswid083b'].indexOf(daxDetail[0].id) > -1) {
                customFilterData = customFilterData.replace(/BU Attributes/gi, 'Grant BU Attributes');
              }
              basefilter = customFilterData != '' ? daxDetail[0].basefilter + ',' + customFilterData : daxDetail[0].basefilter;
            }
          }
          if (daxDetail[0].basecolumn !== '') {
            basefilter += ',';
          }
        } else {
          if (['rmwid003', 'rmwid004', 'rmwid005', 'rmwid006'].indexOf(daxDetail[0].id) !== -1) {
            basefilter = this.rmcurprevCustomfilter;
          } else {
            if (daxDetail[0].id === 'lastupdates01') {
              basefilter = '';
            }
            else {
              basefilter = this.customFilter;
            }
            //basefilter = this.customFilter;
          }
          if (daxDetail[0].basecolumn !== '') {
            basefilter += ',';
          } else {
            basefilter += '';
          }
        }
      }
    } else {
      if (daxDetail[0].basefilter !== '') {
        basefilter = daxDetail[0].basefilter;
        if (daxDetail[0].basecolumn !== '') {
          basefilter += ',';
        }
      }
      if (daxDetail[0].id === 'gen0001' || daxDetail[0].id === 'gen0002' || daxDetail[0].id === 'gen0003' || daxDetail[0].id === 'gen0004') {
        basefilter += 'KEEPFILTERS( TREATAS( {2024}, \'Project Key Dates\'[Approval FY] )),';
      } else if (daxDetail[0].id === 'gen0001a') {
        basefilter += ',KEEPFILTERS( TREATAS( {2024}, \'Project Key Dates\'[Approval FY] ))';
      }
    }
    /* =============================FACT Dropdown filters=====================================*/
    if (['tfwid041', 'tfwid042', 'tfwid042a', 'tfwid042b', 'tfwid043', 'tfwid044', 'tfswid057', 'tfswid058', 'tfswid059', 'tfswid060', 'tfswid061', 'tfswid062', 'tfswid062c'].indexOf(daxDetail[0].id) !== -1) {
      if (this.selectedDonor.length > 0) {
        let seldonor = '';
        this.selectedDonor.forEach((element, index) => {
          seldonor += '"' + element + '"';
          if (index < (this.selectedDonor.length - 1)) {
            seldonor += ',';
          }
        });
        seldonor = 'KEEPFILTERS( TREATAS( {' + seldonor + '}, \'Donor Agency\'[Reporting Donor Agency Name] )),';
        basefilter = seldonor + basefilter;
      }
      if (['tfwid041', 'tfswid057'].indexOf(daxDetail[0].id) === -1) {
        if (this.selectedfy.length > 0) {
          let selfy = '';
          this.selectedfy.forEach((element, index) => {
            selfy += '"' + element + '"';
            if (index < (this.selectedfy.length - 1)) {
              selfy += ',';
            }
          });
          selfy = 'KEEPFILTERS( TREATAS( {' + selfy + '}, \'TF Datasets\'[Fiscal Year (FAcT)] )),';
          basefilter = selfy + basefilter;
        }
      }
    }
    /* =============================Umbrella Program Dropdown filters=====================================*/
    if (['tfwid098', 'tfwid098a', 'tfwid097', 'tfwid099', 'tfwid099b', 'tfwid099a', 'tfswid091e', 'tfswid091f', 'tfswid091g', 'tfswid091h', 'tfswid091i', 'tfswid091j', 'tfswid091k', 'tfswid091m', 'tfswid091n', 'tfswid096a', 'tfswid097', 'tfswid098'].indexOf(daxDetail[0].id) !== -1) {
      if (this.selectedUmbrellaPrgm !== '' && this.selectedUmbrellaPrgm !== undefined) {
        let selumbrellapgrm = this.selectedUmbrellaPrgm;
        if (basefilter === '') {
          selumbrellapgrm = 'KEEPFILTERS( TREATAS( {' + selumbrellapgrm + '}, \'TF Datasets\'[PV Umbrella Manager UPI] ))';
        } else {
          if (daxDetail[0].id.includes('tfswid098')) {
            selumbrellapgrm = 'KEEPFILTERS( FILTER( ALL( Trustee[Umbrella Manager] ), SEARCH( {' + selumbrellapgrm + '}, Trustee[Umbrella Manager], 1, 0 ) >= 1 )),' //'KEEPFILTERS( TREATAS( {' + selumbrellapgrm + '}, \'TF Datasets\'[PV Umbrella Manager UPI] )),';            
          }
          else {
            selumbrellapgrm = 'KEEPFILTERS( TREATAS( {' + selumbrellapgrm + '}, \'TF Datasets\'[PV Umbrella Manager UPI] )),';
          }
        }
        basefilter = selumbrellapgrm + basefilter;
      }
    }
    /* ============================= Tustee TTL Dropdown filters=====================================*/
    if (['tfwid107', 'tfwid107a', 'tfwid107b', 'tfwid107c', 'tfwid107d', 'tfwid108', 'tfwid109', 'tfwid109a', 'tfwid109b', 'tfswid092', 'tfswid092a', 'tfswid092b', 'tfswid092c', 'tfswid092d', 'tfswid092e', 'tfswid092f', 'tfswid092g', 'tfswid093', 'tfswid093a', 'tfswid093b', 'tfswid091l', 'tfswid096b', 'tfswid097a', 'tfswid098a'].indexOf(daxDetail[0].id) !== -1) {
      if (this.selectedTrusteeTTL !== '' && this.selectedTrusteeTTL !== undefined) {
        let seltrusteettl = this.selectedTrusteeTTL;
        if (basefilter === '') {
          seltrusteettl = 'KEEPFILTERS( TREATAS( {' + seltrusteettl + '}, Trustee[TTL UPI] ))';
        } else {
          seltrusteettl = 'KEEPFILTERS( TREATAS( {' + seltrusteettl + '}, Trustee[TTL UPI] )),';
        }
        basefilter = seltrusteettl + basefilter;
      }
    }
    const indexcount = this.drillSelecteddashboardOpt.length - 1;
    if (daxDetail[0].id === 'tfwid042a' || daxDetail[0].id === 'tfwid042b' || daxDetail[0].id === 'tfswid059' || daxDetail[0].id === 'tfswid060') {
      basefilter = basefilter.replace('@@userUnit@@', this.drillSelecteddashboardOpt[indexcount].unit);
    }
    // TF - MVP: BU Portfolio
    if (this.MvpCategoryView === 'BU Portfolio') {
      // basefilter += 'KEEPFILTERS( TREATAS( {"PRS"},\'BU Attributes\'[VPU Group])),';
    }
    // DrillDown checking
    if (this.selectedDrillWidgetDetail.length > 0 && this.selectedDrillWidgetDetail[0].reportKey === daxDetail[0].key) {
      const drilldata = this.srdrilldownJSON.drilldown.filter(x => x.id === this.selectedDrillWidgetDetail[0].drilldownID &&
        x.reportkey === this.selectedDrillWidgetDetail[0].reportKey);
      // tslint:disable-next-line:no-console
      console.log(this.selectedDrillWidgetDetail, 'drilldata ==>', drilldata);
      if (drilldata.length > 0) {
        if (drilldata !== null && drilldata !== undefined) {
          /*==========Remove Default Filters and Set only Drilldown or Custom Filters==============*/
          if (drilldata[0].defaultfilters !== undefined && drilldata[0].defaultfilters !== '') {
            if (['prtfd0031', 'prtfd0032', 'prtfd0033', 'prtfd0034', 'prtfd0041', 'prtfd0042', 'prtfd0043', 'prtfd0044', 'asad0006', 'asad0014', 'lendd0083', 'lendd0084',
              'lendd0085', 'lendd0086', 'lendd0087', 'lendd0088', 'prtfd0046', 'prtfd0047', 'prtfd0048', 'prtfd0049', 'prtfd0050', 'prtfd0051', 'prtfd0052', 'prtfd0053',
              'prtfd0054', 'prtfd0055', 'prtfd0056', 'rasdril0024', 'rasdril0025', 'rasdril0026', 'rasdril0028', 'rasdril0029', 'rasdril0069', 'rasdril0070', 'rasdril0071',
              'rasdril0073', 'rasdril0005', 'rasdril0005a', 'rasdril0005b'].indexOf(drilldata[0].id) !== -1) {
              if (this.customFilter !== '') {
                basefilter = drilldata[0].defaultfilters + ',' + this.customFilter + ',';
              } else {
                basefilter = drilldata[0].defaultfilters + ',';
              }
            } else {
              basefilter += drilldata[0].defaultfilters;
              if (daxDetail[0].basecolumn !== '') {
                basefilter += ',';
              }
            }
          }
          basefilter = basefilter.replace('@selectedxaxis@', this.selectedDrillWidgetDetail[0].xaxisCategory).replace('@selectedCategory@', this.selectedDrillWidgetDetail[0].category).replace('@selectedname@', this.selectedDrillWidgetDetail[0].selectedName).replace('@selectedvalue@', this.selectedDrillWidgetDetail[0].selectedValue);
        }
        if (drilldata[0].queryType !== undefined) {
          daxDetail[0].queryType = drilldata[0].queryType;
        }
        if (drilldata[0].basecondition !== undefined) {
          daxDetail[0].basecondition = drilldata[0].basecondition;
        }
        if (drilldata[0].basequeryAdd !== undefined) {
          if ((daxDetail[0].basefilter !== '' || daxDetail[0].basecolumn !== '' || this.customFilter !== '')
            && daxDetail[0].queryType !== 'EVALUATE CALCULATETABLE') {
            basequery += drilldata[0].basequeryAdd + ',';
          }
        }
      }
    }

    // Dax query fitler table / column name replace --- Start
    const widgetID = ['tfwid011', 'tfwid012', 'tfwid060a', 'tfwid060b', 'tfwid013', 'tfwid020', 'tfwid020a', 'tfwid020b', 'tfwid021', 'tfwid021a', 'tfwid021b',
      'tfwid022', 'tfwid022a', 'tfwid023', 'tfwid023a', 'tfwid024', 'tfwid024a', 'tfwid077', 'tfwid077a', 'tfwid077b', 'tfwid017', 'tfwid017a', 'tfwid017b',
      'tfwid016', 'tfwid016a', 'tfwid014b', 'tfswid016a', 'tfswid016b', 'tfswid016c', 'tfswid067a', 'tfswid067b', 'tfswid067c', 'tfswid067d', 'tfswid069a', 'tfswid069b',
      'tfswid069c', 'tfswid069d', 'tfswid076', 'tfswid085a', 'tfswid085b', 'tfswid085c', 'tfswid086a', 'tfswid086b', 'tfswid086c', 'tfswid087a', 'tfswid087b', 'tfswid088a', 'tfswid088b', 'tfswid088c',
      'tfswid079', 'tfswid079a', 'tfswid079b', 'tfswid063', 'tfswid064', 'tfswid075', 'tfswid084', 'tfswid084a', 'tfswid070', 'tfswid070a', 'tfswid071', 'tfswid077', 'tfswid072', 'tfswid073', 'tfswid082', 'tfswid082a', 'tfswid082b'];
    if (widgetID.indexOf(daxDetail[0].id) !== -1) {
      basefilter = basefilter.replace(/BU Attributes/gi, 'Grant BU Attributes');
    }
    const widgetID1 = ['tfwid007', 'tfwid057a', 'tfwid014a', 'tfwid057', 'tfswid014a', 'tfswid014c', 'tfswid066a', 'tfswid014d', 'tfswid014b'];
    if (widgetID1.indexOf(daxDetail[0].id) !== -1) {
      basefilter = basefilter.replace(/\bBU Attributes\b/gi, 'BU Attributes_FAcT');
    }
    // Dax query fitler table / column name replace --- end
    let tempquery = '';
    if (daxDetail[0].queryType === 'EVALUATE SUMMARIZECOLUMNS') {
      tempquery = basequery + basefilter + daxDetail[0].basecolumn;
      tempquery = 'EVALUATE SUMMARIZECOLUMNS(' + tempquery + ')' + daxDetail[0].orderBy;
    }
    if (daxDetail[0].queryType === 'EVALUATE CALCULATETABLE') {
      if (basefilter !== '' && basefilter !== null) {
        tempquery = 'ROW(' + basequery + '),' + basefilter + daxDetail[0].basecolumn;
      } else {
        tempquery = 'ROW(' + basequery + ')' + daxDetail[0].basecolumn;
      }

      tempquery = 'EVALUATE CALCULATETABLE(' + tempquery + ')' + daxDetail[0].orderBy;
    }
    if (daxDetail[0].queryType === 'EVALUATE TOPN') {
      tempquery = basequery + basefilter + daxDetail[0].basecolumn;
      tempquery = 'EVALUATE TOPN(' + tempquery + ')' + daxDetail[0].orderBy;
    }
    if (daxDetail[0].queryType === 'EVALUATE UNION') {
      tempquery = basequery + basefilter + daxDetail[0].basecolumn;
      tempquery = 'EVALUATE UNION(' + tempquery + ')' + daxDetail[0].orderBy;
    }
    if (daxDetail[0].queryType === 'EVALUATE FILTER') {
      if (basefilter !== null && basefilter !== '' && basefilter !== undefined) {
        tempquery = 'KEEPFILTERS(SUMMARIZECOLUMNS(' + basequery + basefilter + daxDetail[0].basecolumn + ')),' + daxDetail[0].basecondition;
      } else {
        tempquery = 'KEEPFILTERS(SUMMARIZECOLUMNS(' + basequery + daxDetail[0].basecolumn + ')),' + daxDetail[0].basecondition;
      }

      tempquery = 'EVALUATE FILTER(' + tempquery + ')' + daxDetail[0].orderBy;
    }
    if (daxDetail[0].queryType === 'EVALUATE SELECTCOLUMNS') {
      tempquery = daxDetail[0].subqueryType + '(' + basequery + basefilter + daxDetail[0].basecolumn + '),' + daxDetail[0].selectcolumn;
      tempquery = 'EVALUATE SELECTCOLUMNS(' + tempquery + ')' + daxDetail[0].orderBy;
    }
    tempquery = tempquery.replace('@selectedfundID@', this.fifscontributionselectedfundID);


    /* const options = { headers: headers };
     const basequery = (daxDetail[0].basequery !== '') ? daxDetail[0].basequery : '';
     let basefilter = '';
     const basecolumn = (daxDetail[0].basecolumn !== '') ? ',' + daxDetail[0].basecolumn : '';
     if (this.customFilter !== '') {
       basefilter = ',' + daxDetail[0].basefilter + ',' + this.customFilter;
     } else {
       basefilter = (daxDetail[0].basefilter !== '') ? ',' + daxDetail[0].basefilter : '';
     }
     tempquery = basequery + basefilter + basecolumn;
     tempquery = 'EVALUATE SUMMARIZECOLUMNS(' + tempquery + ')' + daxDetail[0].orderBy;*/
    return tempquery;
  }

  setReportName(reportName: string) {
    this.getReportName.next({ command: 'apply', reportName: reportName });
  }
  getClearFilterEmitter(opt: any) {
    this.ClearfilterData.next({ command: 'filterApply' });
  }
  getRemoveFilterEmitter(opt: any) {
    this.RmovefilterData.next({ command: 'filterApply' });
  }
  getHomePageActive() {
    this.HomePagTabActive.next({ command: 'tapApply' });
  }
  gettoggleApply(value) {
    this.DataApplymillionk.next({ command: 'apply', status: value });
  }
  getHomeIBRDIDATabActive() {
    this.HomeIBRDIDATabActive.next({ command: 'tabApply' });
  }
  getChangeAccountingFilterEmitter() {
    this.filterData.next({ command: 'filterApply' });
  }
  getChangeFilterCopyEmitter(opt: any) {
    let filteredvalue = '';
    this.facetFilter.sort((a, b) => a.category > b.category ? 1 : -1);
    const categorylist = [];
    let filedName = '';
    this.customFilter = '';
    let valType = '';
    const Path = document.location.href;
    if (this.facetFilter.length > 0) {
      /* this.facetFilter.forEach(element => {
         if (categorylist.indexOf(element.category) === -1) {
           categorylist.push(element.category);
         }
       });*/
      // if (window.location.pathname.indexOf('lending') !== -1) {
      this.facetFilter.forEach((catelement, catIndex) => {
        /* let valType = 'string';
         const tempcatfacetlist = this.facetFilter.filter(x => x.category === catelement);
         tempcatfacetlist.forEach((element, index) => {
           const refinebyresult = this.getFacetsConfigJSON('lending');
           refinebyresult.forEach(element1 => {
             if (element1.title === element.category) {
               filedName = element1.children[0].facetQuery; // .measureQuery['code'];
               valType = (element1.children[0].valueType !== undefined) ? element1.children[0].valueType : valType;
             } else {
               const resindex = element1.children.findIndex(x => x.title === element.category);
               if (resindex !== -1) {
                 filedName = element1.children[resindex].facetQuery; // .measureQuery['code'];
                 valType = (element1.children[resindex].valueType !== undefined) ? element1.children[0].valueType : valType;
               }
             }
           });
         });*/
        filedName = catelement.facetType;
        valType = catelement.Typenumber;
        filteredvalue += 'FILTER(VALUES(' + filedName + '),';
        if (valType === 'number') {
          filteredvalue += '(' + filedName + ' = ' + catelement.value + ')';
        } else if (valType === 'string') {
          filteredvalue += '(' + filedName + ' = \"' + catelement.value + '\" )';
        }
        /*if (catIndex < (this.facetFilter.length - 1)) {
  filteredvalue += ' || ';
}*/
        /* tempcatfacetlist.forEach((element, index) => {
           if (valType === 'number') {
             filteredvalue += '(' + filedName + ' = ' + element.value + ')';
           } else if (valType === 'string') {
             filteredvalue += '(' + filedName + ' = \"' + element.value + '\" )';
           }
           if (index < (tempcatfacetlist.length - 1)) {
             filteredvalue += ' || ';
           }
         });*/
        filteredvalue += ')';
        if (catIndex < (this.facetFilter.length - 1)) {
          filteredvalue += ',';
        }
      });
      // }

      const urls = this.router.url;
      const urlview = urls.split('/');
      let pagename = '';
      if (urlview.length > 0) {
        const getpage = urlview[2].split('?');
        pagename = getpage[0];
      }
      if (pagename === 'detailpage') {
        if (this.facetFilter[0].category === 'Region') {
          filteredvalue = 'FILTER(VALUES(\'Region\'[Region Code]),';
          this.facetFilter.forEach((element, index) => {
            filteredvalue += '(Region[Region Code] = \"' + element.value + '\" )';
            if (index < (this.facetFilter.length - 1)) {
              filteredvalue += ' || ';
            }
          });
          filteredvalue += ')';
        }
        if (this.facetFilter[0].category === 'Country') {
          filteredvalue = 'FILTER(VALUES(\'Country\'[Country Code]),';
          this.facetFilter.forEach((element, index) => {
            filteredvalue += '(Country[Country Code] = \"' + element.value + '\" )';
            if (index < (this.facetFilter.length - 1)) {
              filteredvalue += ' || ';
            }
          });
          filteredvalue += ')';
        }
        if (this.facetFilter[0].category === 'Practice Group') {
          filteredvalue = 'FILTER(VALUES(\'Global Practice\'[Global Practice Code]),';
          this.facetFilter.forEach((element, index) => {
            filteredvalue += '(\'Global Practice\'[Global Practice Code] = \"' + element.value + '\" )';
            if (index < (this.facetFilter.length - 1)) {
              filteredvalue += ' || ';
            }
          });
          filteredvalue += ')';
        }
        if (this.facetFilter[0].category === 'Requesting Unit') {
          filteredvalue = 'FILTER(VALUES(\'Requesting Unit\'[Requesting Unit]),';
          this.facetFilter.forEach((element, index) => {
            filteredvalue += '(\'Requesting Unit\'[Requesting Unit] = \"' + element.value + '\" )';
            if (index < (this.facetFilter.length - 1)) {
              filteredvalue += ' || ';
            }
          });
          filteredvalue += ')';
        }
        if (this.facetFilter[0].category === 'Responsible Unit') {
          filteredvalue = 'FILTER(VALUES(\'Responsible Unit\'[Responsible Unit]),';
          this.facetFilter.forEach((element, index) => {
            filteredvalue += '(\'Responsible Unit\"[Responsible Unit] = \"' + element.value + '\" )';
            if (index < (this.facetFilter.length - 1)) {
              filteredvalue += ' || ';
            }
          });
          filteredvalue += ')';
        }
        if (this.facetFilter[0].category === 'Director Unit') {
          filteredvalue = 'FILTER(VALUES(\'Responsible Unit\'[Responsible Department]),';
          this.facetFilter.forEach((element, index) => {
            filteredvalue += '(\'Responsible Unit\'[Responsible Department] = \"' + element.value + '\" )';
            if (index < (this.facetFilter.length - 1)) {
              filteredvalue += ' || ';
            }
          });
          filteredvalue += ')';
        }
      }
    }
    this.LoadModuleFilter();
    // tslint:disable-next-line: max-line-length
    this.customFilter = filteredvalue;
    // tslint:disable-next-line: no-console
    if (opt === 'filterApply') {
      setTimeout(() => {
        this.filterData.next({ command: 'filterApply', Datas: this.facetFilter });
      }, 5);

    }
  }
  getChangeFilterEmitter(opt: any) {
    let filteredvalue = '';
    let rmcurprevfilteredvalue = '';
    this.facetFilter.sort((a, b) => a.category > b.category ? 1 : -1);
    const categorylist = [];
    let filedName = '';
    this.customFilter = '';
    this.rmcurprevCustomfilter = '';
    let valType = '';
    const Path = document.location.href;
    this.tabload = '1';
    if (this.facetFilter.length > 0) {
      this.facetFilter.forEach((catelement, catIndex) => {
        if (categorylist.indexOf(catelement.category) === -1) {
          categorylist.push(catelement.category);
        }
      });
    }
    if (this.facetFilter.length > 0) {
      categorylist.forEach((catlist, catlistindex) => {
        const selcategory = this.facetFilter.filter(x => x.category === catlist);
        if (selcategory !== undefined && selcategory !== null && selcategory.length > 0 &&
          ((['safegrd4%9', 'secthme2%7', 'prt2%8', 'aggrid1%5'].indexOf(selcategory[0].id)) === -1 ||
            ((['safegrd4%9', 'secthme2%7', 'prt2%8'].indexOf(selcategory[0].id)) !== -1 &&
              selcategory.length === 1 && (selcategory[0].value === 'Y' || selcategory[0].value === 'y')))) {
          filteredvalue += (catlistindex !== 0 && filteredvalue !== '') ? ',KEEPFILTERS(TREATAS ({' : 'KEEPFILTERS(TREATAS ({';
          rmcurprevfilteredvalue += (catlistindex !== 0 && filteredvalue !== '') ? ',KEEPFILTERS(TREATAS ({' : 'KEEPFILTERS(TREATAS ({';
          selcategory.forEach((catelement, catIndex) => {
            filedName = catelement.facetType;
            valType = catelement.Typenumber; //
            if (valType === 'number') {
              filteredvalue += (catIndex !== 0) ? (',' + catelement.value) : catelement.value;
              rmcurprevfilteredvalue += (catIndex !== 0) ? (',' + catelement.value) : catelement.value;
            } else if (valType === 'string') {
              if ((catelement.id === 'len2%10' || catelement.id === 'prt2%9' || catelement.id === 'safegrd2%9') && catelement.value === 'NVAL') {
                filteredvalue += ('"Y", "N"');
              } else {
                if (selcategory[0].id === 'rm1%5') {
                  this.rmselectedcurrfy = catelement.value;
                  // tslint:disable-next-line:radix
                  this.rmselectedprevfy = (parseInt(catelement.value) - 1).toString();
                }
                filteredvalue += (catIndex !== 0) ? (',"' + catelement.value + '"') : '"' + catelement.value + '"';
                // tslint:disable-next-line:radix
                rmcurprevfilteredvalue += (catIndex !== 0) ? (',"' + catelement.value + '"') : (selcategory[0].id === 'rm1%5') ? ('"' + this.rmselectedprevfy + '","' + this.rmselectedcurrfy + '"') :
                  '"' + catelement.value + '"';
              }
            }
          });
          filteredvalue += '},' + filedName + '))';
          rmcurprevfilteredvalue += '},' + filedName + '))';
        } else if ((['safegrd4%9', 'secthme2%7', 'prt2%8'].indexOf(selcategory[0].id)) !== -1 && selcategory.length === 1 && selcategory[0].value === '') {
          filteredvalue += (catlistindex !== 0 && filteredvalue !== '') ? ',KEEPFILTERS(FILTER (ALL(' : 'KEEPFILTERS(FILTER (ALL(';
          selcategory.forEach((catelement, catIndex) => {
            filedName = catelement.facetType;
            valType = catelement.Typenumber;
            filteredvalue += filedName + '), ' + filedName + '<>"Y"))';
          });
        } else if ((['aggrid1%5'].indexOf(selcategory[0].id)) !== -1 && selcategory.length === 1) {
          filteredvalue += (catlistindex !== 0 && filteredvalue !== '') ? ',KEEPFILTERS(FILTER (ALL(' : 'KEEPFILTERS(FILTER (ALL(';
          selcategory.forEach((catelement, catIndex) => {
            filedName = catelement.facetType;
            valType = catelement.Typenumber;
            filteredvalue += filedName + '), ' + filedName + ' <= ' + selcategory[0].value + '))';
          });
        }
        const selcategoryData = this.facetFilter.filter(x => x.category === 'Accounting_Date');
        if (selcategoryData.length > 0) {
          selcategoryData.forEach(x => {
            filteredvalue += ',';
            if (x.name === 'Accounting_Fromdate') {
              filteredvalue += 'KEEPFILTERS( FILTER( ALL( ' + x.facetType + '), SEARCH( "' + x.value + '", ' + x.facetType + ', 1, 0 ) >= 1 ))';
            }
            if (x.name === 'Accounting_Todate') {
              filteredvalue += 'KEEPFILTERS( FILTER( ALL( ' + x.facetType + '), SEARCH( "' + x.value + '", ' + x.facetType + ', 1, 0 ) =< 1 ))';
            }
          });
        }
      });
      // KEEPFILTERS(FILTER(ALL(Project[Additional Financing Flag]), Project[Additional Financing Flag]<>"Y"));
      /* this.facetFilter.forEach((catelement, catIndex) => {
        filedName = catelement.facetType;
        valType = catelement.Typenumber;
        filteredvalue += 'FILTER(VALUES(' + filedName + '),';
        if (valType === 'number') {
          filteredvalue += '(' + filedName + ' = ' + catelement.value + ')';
        } else if (valType === 'string') {
          filteredvalue += '(' + filedName + ' = \"' + catelement.value + '\" )';
        }
        filteredvalue += ')';
        if (catIndex < (this.facetFilter.length - 1)) {
          filteredvalue += ',';
        }
      }); */
      // tslint:disable-next-line:no-shadowed-variable
      const urls = this.router.url.split('/');
      if (urls.indexOf('region') !== -1 || urls.indexOf('country') !== -1 || urls.indexOf('practicegroup') !== -1
        || urls.indexOf('requnit') !== -1 || urls.indexOf('resunit') !== -1 || urls.indexOf('dirun') !== -1) {
        filteredvalue += ',';
      }
    }
    let filterData: any = '';
    const urls = window.location.pathname.split('/');
    filterData = urls[3];
    const TypeofCategory = urls[2];
    if (urls.indexOf('region') !== -1 || urls.indexOf('country') !== -1 || urls.indexOf('practicegroup') !== -1
      || urls.indexOf('requnit') !== -1 || urls.indexOf('resunit') !== -1 || urls.indexOf('dirun') !== -1
      || urls.indexOf('organization') !== -1 || urls.indexOf('hr_region') !== -1 || urls.indexOf('vpugroup') !== -1
      || urls.indexOf('fundcenter') !== -1) {
      if (filterData.indexOf('%20') !== -1) {
        const re = '%20';
        filterData = filterData.toString().replaceAll(re, ' ');
      }
      if (filterData.indexOf('%2520') !== -1) {
        const re = '%2520';
        filterData = filterData.toString().replaceAll(re, ' ');
      }
      if (TypeofCategory === 'region') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, Region[Region Code] ))';
      }
      if (TypeofCategory === 'country') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, Country[Country Code] ))';
      }
      if (TypeofCategory === 'practicegroup') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Global Practice\'[Global Practice Code] ))';
      }
      if (TypeofCategory === 'requnit') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Requesting Unit\'[Requesting Unit] ))';
      }
      if (TypeofCategory === 'resunit') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Responsible Unit\'[Responsible Unit] ))';
      }
      if (TypeofCategory === 'dirun') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Responsible Unit\'[Responsible Department] ))';
      }
      if (TypeofCategory === 'organization') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Official Staff on Board\'[Org Grp] ))';
      }
      if (TypeofCategory === 'hr_region') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Official Staff on Board\'[Bank Geographical Regions] ))';
      }
      if (TypeofCategory === 'vpugroup' && urls[1] === 'hr') {
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Official Staff on Board\'[VPU Grouping] ))';
      }
      if (TypeofCategory === 'vpugroup' && urls[1] === 'bps') {
        filteredvalue += (filteredvalue !== '') ? ',' : '';
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Funds Center\'[VPU Group Acronym] ))';
        rmcurprevfilteredvalue += (rmcurprevfilteredvalue !== '') ? ',' : '';
        rmcurprevfilteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Funds Center\'[VPU Group Acronym] ))';
      }
      if (TypeofCategory === 'fundcenter' && urls[1] === 'bps') {
        filteredvalue += (filteredvalue !== '') ? ',' : '';
        filteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Funds Center\'[VPU Acronym] ))';
        rmcurprevfilteredvalue += (rmcurprevfilteredvalue !== '') ? ',' : '';
        rmcurprevfilteredvalue += 'KEEPFILTERS( TREATAS( { "' + filterData + '"}, \'Funds Center\'[VPU Acronym] ))';
      }
    }
    this.LoadModuleFilter();
    this.customFilter = filteredvalue;
    if (window.location.pathname.includes('/tf/landing-fifs/tf-summary-report') || window.location.pathname.includes('/tf/landing-fifs/fif-summary-report') || window.location.pathname.includes('/tf/landing-fifs/portfolioview-report')) {
      this.customFilter = this.customFilter.split('T00:00:00').join('');
      this.customFilter = this.customFilter.replace('KEEPFILTERS(TREATAS ({"Commitments - Cash Transfer"},Parameter[Parameter]))', 'KEEPFILTERS (TREATAS ({1},Parameter[Parameter Order]))');
      this.customFilter = this.customFilter.replace('KEEPFILTERS(TREATAS ({"Allocation - Cash Transfer"},Parameter[Parameter]))', 'KEEPFILTERS (TREATAS ({0},Parameter[Parameter Order]))');
    }
    this.rmcurprevCustomfilter = rmcurprevfilteredvalue;
    if (opt === 'filterApply') {
      setTimeout(() => {
        this.filterData.next({ command: 'filterApply', Datas: this.facetFilter });
      }, 5);

    }
  }
  getChangeTFFilterEmitter(opt) {
    setTimeout(() => {
      this.filterData.next({ command: 'filterApply', Datas: this.facetFilter });
    }, 500);
  }
  LoadModuleFilter() {
    const modules = window.location.pathname.split('/');
    this.PageModuleName = modules[2];
    // if (modules[1] !== 'report') {
    if (window.location.pathname.indexOf('report') === -1) {
      this.selectedDrillWidgetDetail = [];
    }
  }
  /******** Report Fields load from JSON ************/
  getReportListJSON(sectionName: any) {
    let jsonlist: any;
    if (sectionName === 'lending' || sectionName === 'Lending') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/lendingreports.json')));
    } else if (sectionName === 'portfolio' || sectionName === 'Portfolio') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/portfolioreports.json')));
    } else if (sectionName === 'asa' || sectionName === 'ASA') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/asareports.json')));
    } else if (sectionName === 'ras' || sectionName === 'RAS') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/rasreports.json')));
    } else if (sectionName === 'knowledge' || sectionName === 'Knowledge') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/knowledgereports.json')));
    } else if (sectionName === 'cpf' || sectionName === 'CPF') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/cpfreports.json')));
    } else if (sectionName === 'collaboration' || sectionName === 'Collaboration') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/collaborationreports.json')));
    } else if (sectionName === 'risk' || sectionName === 'Risk') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/riskreports.json')));
    } else if (sectionName === 'procurement' || sectionName === 'Procurement') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/procurementreports.json')));
    } else if (sectionName === 'Safeguards' || sectionName === 'safeguards') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/safeguardsreports.json')));
    } else if (sectionName === 'ESF' || sectionName === 'esf') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/esfreports.json')));
    } else if (sectionName === 'Financial Management' || sectionName === 'financialmanagement') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/financialreports.json')));
    } else if (sectionName === 'Infrastructure' || sectionName === 'infrastructure') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/infrastructurereports.json')));
    } else if (sectionName === 'Gender' || sectionName === 'gender') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/genderreports.json')));
    } else if (sectionName === 'Sectors & Themes' || sectionName === 'sectorsthemes') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/sectorthemereports.json')));
    } else if (sectionName === 'bps' || sectionName === 'BPS') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/rmreports.json')));
    } else if (sectionName === 'snapshot' || sectionName === 'Snapshot') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/snapshotreports.json')));
    } else if (sectionName === 'accounting' || sectionName === 'Accounting') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/accountingReport.json')));
    } else if (sectionName === 'businessunitviews' || sectionName === 'mvp' || sectionName === 'ibrdidatfs' || sectionName === 'tflifecycle' || sectionName === 'tfgrants') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/standardreport/tfreports.json')));
    }
    return jsonlist;
  }
  getReportColumnListJSON(sectionName: any) {
    let jsonlist: any;
    if (sectionName === 'lending' || sectionName === 'Lending') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/lendingfieldcolumns.json')));
    } else if (sectionName === 'portfolio' || sectionName === 'Portfolio') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/portfoliofieldcolumns.json')));
    } else if (sectionName === 'asa' || sectionName === 'ASA') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/asafieldcolumns.json')));
    } else if (sectionName === 'ras' || sectionName === 'RAS') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/rasfieldcolumns.json')));
    } else if (sectionName === 'knowledge' || sectionName === 'Knowledge') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/knowledgefieldcolumns.json')));
    } else if (sectionName === 'cpf' || sectionName === 'CPF') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/cpffieldcolumns.json')));
    } else if (sectionName === 'collaboration' || sectionName === 'Collaboration') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/collaborationfieldcolumns.json')));
    } else if (sectionName === 'risk' || sectionName === 'Risk') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/riskfieldcolumns.json')));
    } else if (sectionName === 'procurement' || sectionName === 'Procurement') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/procurementfieldcolumns.json')));
    } else if (sectionName === 'ESF' || sectionName === 'esf') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/esffieldcolumns.json')));
    } else if (sectionName === 'Safeguards' || sectionName === 'safeguards') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/safeguardsfieldcolumns.json')));
    } else if (sectionName === 'Financial Management' || sectionName === 'financialmanagement') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/financialfieldcolumns.json')));
    } else if (sectionName === 'Infrastructure' || sectionName === 'infrastructure') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/infrastructurefieldcolumns.json')));
    } else if (sectionName === 'Gender' || sectionName === 'gender') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/genderfieldcolumns.json')));
    } else if (sectionName === 'Sector and Theme' || sectionName === 'sectorsthemes') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/sectorthemefieldcolumns.json')));
    } else if (sectionName === 'bps' || sectionName === 'BPS') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/rmfieldcolumns.json')));
    } else if (sectionName === 'accounting' || sectionName === 'accounting') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/accountingfieldcolimns.json')));
    } else if (sectionName === 'businessunitviews' || sectionName === 'mvp' || sectionName === 'ibrdidatfs' || sectionName === 'tflifecycle' || sectionName === 'tfgrants') {
      jsonlist = JSON.parse(JSON.stringify(require('../assets/gridconfig/fieldcolumnlist/tffieldcolumns.json')));
    }
    return jsonlist;
  }
  /********* Report Cell Style Update ***************/
  updateStyles(tablecolumnlist: any, ReportID: any, rowData: any, selectedReportDetail) {
    tablecolumnlist.forEach((column, index) => {
      if (ReportID === 'L3.3' || ReportID === 'L5.2a' || ReportID === 'L5.2b' || ReportID === 'L5.2c' || ReportID === 'L9.4'
        || ReportID === 'L10.5' || ReportID === 'L12.2' || ReportID === 'L14.1' || ReportID === 'FL9.4') {
        tablecolumnlist[index].cellStyle = (params: any) => {
          const rowIndex = params.node.rowIndex;
          let rowColor;
          if (column.field === 'Project Key Dates[Begin Appraisal Date]' && (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Begin Appraisal KPI Color]'];
          } else if (column.field === 'Project Key Dates[AIS Sign Off Date]' && (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[AIS Sign Off KPI Color]'];
          } else if (column.field === 'Project Key Dates[Appraisal ESRS Date]' && (params.data !== undefined && params.data['Project Key Dates[Appraisal ESRS KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Appraisal ESRS KPI Color]'];
          } else if (column.field === 'Project Key Dates[Quality Enhancement Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Quality Enhancement Review KPI Color]'];
          } else if (column.field === 'Project Key Dates[Decision Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Decision Review KPI Color]'];
          } else if (column.field === 'Project Key Dates[Disclosure Of Concept PID Date]' && (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'];
          } else if (column.field === 'Project Key Dates[Concept ESRS Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept ESRS KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept ESRS KPI Color]'];
          } else if (column.field === 'Project Key Dates[Disclosure Of Appraisal PID Date]' && (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'];
          } else if (column.field === 'Project Key Dates[Authorize Negotiations Date]' && (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Authorize Negotiations KPI Color]'];
          } else if (column.field === 'Project Key Dates[Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Approval KPI Color]'];
          } else if (column.field === 'Project[Overall Risk]' && (params.data !== undefined && params.data['Project[Overall Risk KPI Color]'] !== null)) {
            rowColor = params.data['Project[Overall Risk KPI Color]'];
          } else if (column.field === 'Project Key Dates[Concept Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept Review KPI Color]'];
          }

          return { backgroundColor: rowColor };

        };

      }
      if (ReportID === 'FL9.4' && column.headerName === 'Milestones') {
        column.children.forEach((children, index1) => {
          tablecolumnlist[index].children[index1].cellStyle = (params: any) => {
            let rowColor;
            if (children.field === 'Project Key Dates[Begin Appraisal Date]' && (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Begin Appraisal KPI Color]'];
            } else if (children.field === 'Project Key Dates[AIS Sign Off Date]' && (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[AIS Sign Off KPI Color]'];
            } else if (children.field === 'Project Key Dates[Appraisal ESRS Date]' && (params.data !== undefined && params.data['Project Key Dates[Appraisal ESRS KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Appraisal ESRS KPI Color]'];
            } else if (children.field === 'Project Key Dates[Quality Enhancement Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Quality Enhancement Review KPI Color]'];
            } else if (children.field === 'Project Key Dates[Decision Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Decision Review KPI Color]'];
            } else if (children.field === 'Project Key Dates[Disclosure Of Concept PID Date]' && (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'];
            } else if (children.field === 'Project Key Dates[Concept ESRS Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept ESRS KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Concept ESRS KPI Color]'];
            } else if (children.field === 'Project Key Dates[Disclosure Of Appraisal PID Date]' && (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'];
            } else if (children.field === 'Project Key Dates[Authorize Negotiations Date]' && (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Authorize Negotiations KPI Color]'];
            } else if (children.field === 'Project Key Dates[Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Approval KPI Color]'];
            } else if (children.field === 'Project Key Dates[Concept Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Concept Review KPI Color]'];
            } else if (children.field === 'Project Key Dates[Concept Review Status]' && (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Concept Review KPI Color]'];
            } else if (children.field === 'Project Key Dates[Decision Review Status]' && (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Decision Review KPI Color]'];
            } else if (children.field === 'Project Key Dates[Authorize Negotiations Status]' && (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Authorize Negotiations KPI Color]'];
            } else if (children.field === 'Project Key Dates[Approval Status]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Approval KPI Color]'];
            } else if (children.field === 'Project Key Dates[Begin Appraisal Status]' && (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Begin Appraisal KPI Color]'];
            }
            return { backgroundColor: rowColor };
          };
        });
      } else if (ReportID === 'P1.6' || ReportID === 'P5.6' || ReportID === 'P5.7' || ReportID === 'P5.10') {
        tablecolumnlist[index].cellStyle = (params: any) => {

          let rowColor;

          if (column.field === 'Portfolio[Latest Project Rating DO]' && (params.data !== undefined && params.data['Portfolio[Latest Project Rating DO KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating DO KPI Color]'];
          } else if (column.field === 'Portfolio[Latest Project Rating IP]' && (params.data !== undefined && params.data['Portfolio[Latest Project Rating IP KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating IP KPI Color]'];
          } else if ((column.field === 'Portfolio[Latest Project Rating Financial Management]'
            || column.field === 'Project[Project Ratings - Financial Management]') && (params.data !== undefined && params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'];
          } else if ((column.field === 'Portfolio[Latest Project Rating Project Management]'
            || column.field === 'Project[Project Ratings - Project Management]') && (params.data !== undefined && params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating Project Management KPI Color]'];
          } else if (column.field === 'Portfolio[Latest Project Rating Counterpart Funding]' && (params.data !== undefined && params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'];
          } else if (column.field === 'Portfolio[Latest Project Rating Procurement]' && (params.data !== undefined && params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating Procurement KPI Color]'];
          } else if ((column.field === 'Portfolio[Latest Project Rating Monitoring and Evaluation]'
            || column.field === 'Project[Project Ratings - Monitoring and Evaluation]') && (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== null)) {
            rowColor = params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'];
          } else if ((column.field === 'Portfolio[Overall Risk]' || column.field === 'Project[Overall Risk]') && (params.data !== undefined && params.data['Project[Overall Risk KPI Color]'] !== null)) {
            rowColor = params.data['Project[Overall Risk KPI Color]'];
          } else if (column.field === 'Project Key Dates[Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Approval KPI Color]'];
          }

          return { backgroundColor: rowColor };

        };

      } else if (ReportID === 'A8.9' || ReportID === 'A8.1' || ReportID === 'A8.8' || ReportID === 'A8.4' || ReportID === 'A8.2' || ReportID === 'A9.2' || ReportID === 'FA8.1' || ReportID === 'FA8.8' || ReportID === 'FA8.9') {

        tablecolumnlist[index].cellStyle = (params: any) => {

          let rowColor;
          if (column.field === 'Project Key Dates[AIS Sign Off Date]' && (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[AIS Sign Off KPI Color]'];
          } else if (column.field === 'Project Key Dates[Concept Note Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept Note Approval KPI Color]'];
          } else if ((column.field === 'Project Key Dates[Completion Original Revised Date]' || column.field === 'Project Key Dates[Completion Summary Status Code]') && (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[ACS Original or Revised KPI Color]'];
          } else if ((column.field === 'ASA[Management Approval Concept Date]' || column.field === 'Project Key Dates[Management Approval Of Concept Date]' || column.field === 'Project Key Dates[Management Approval Of Concept Status Code]') && (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Management Approval Of Concept KPI Color]'];
          } else if (column.field === 'ASA Deliverable[Deliverable Completion Date]' && (params.data !== undefined && params.data['ASA Deliverable[Deliverable Completion KPI Color]'] !== null)) {
            rowColor = params.data['ASA Deliverable[Deliverable Completion KPI Color]'];
          } else if (column.field === 'ASA[Progress Review Due Date]' && (params.data !== undefined && params.data['Project[Progress Review Due Date Color]'] !== null)) {
            rowColor = params.data['Project[Progress Review Due Date Color]'];
          }
          return { backgroundColor: rowColor };
        };
      } else if (ReportID === 'RAS1.1') {

        tablecolumnlist[index].cellStyle = (params: any) => {

          let rowColor;
          if (column.field === 'Project Key Dates[Concept Note Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept Note Approval KPI Color]'];
          }
          return { backgroundColor: rowColor };
        };
      } else if (ReportID === 'C3.2') {

        tablecolumnlist[index].cellStyle = (params: any) => {

          let rowColor;
          if (column.field === 'Project Key Dates[Concept Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept Review KPI Color]'];
          } else if (column.field === 'Project Key Dates[Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Approval KPI Color]'];
          } else if (column.field === 'Project Key Dates[Final Decision Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Final Decision Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Final Decision Review KPI Color]'];
          }
          return { backgroundColor: rowColor };
        };
      } else if (ReportID === 'Sg2.1' || ReportID === 'Sg2.3') {

        tablecolumnlist[index].cellStyle = (params: any) => {

          let rowColor;
          if (column.field === 'Project Key Dates[Concept Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept Review KPI Color]'];
          } else if (column.field === 'Project Key Dates[Begin Appraisal Date]' && (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Begin Appraisal KPI Color]'];
          } else if (column.field === 'Project Key Dates[Decision Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Decision Review KPI Color]'];
          } else if (column.field === 'Project Key Dates[Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Approval KPI Color]'];
          } else if (column.field === 'Project Key Dates[Authorize Negotiations Date]' && (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Authorize Negotiations KPI Color]'];
          }
          return { backgroundColor: rowColor };
        };
      } else if (ReportID === 'fm1.1' || ReportID === 'fm3.10') {
        tablecolumnlist[index].cellStyle = (params: any) => {
          let rowColor;
          if (column.field === 'Project Key Dates[Concept Review Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Concept Review KPI Color]'];
          } else if (column.field === 'Project Key Dates[Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== null)) {
            rowColor = params.data['Project Key Dates[Approval KPI Color]'];
          }
          return { backgroundColor: rowColor };
        };
      }
      if (ReportID === 'FA8.1' && column.headerName === 'Milestones' || column.headerName === 'ACS') {
        column.children.forEach((children, index1) => {
          tablecolumnlist[index].children[index1].cellStyle = (params: any) => {
            let rowColor;
            if (children.field === 'Project Key Dates[AIS Sign Off Date]' && (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[AIS Sign Off KPI Color]'];
            } else if (children.field === 'Project Key Dates[Concept Note Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Concept Note Approval KPI Color]'];
            } else if (children.field === 'Project Key Dates[Completion Original Revised Date]' && (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[ACS Original or Revised KPI Color]'];
            }
            return { backgroundColor: rowColor };
          };
        });
      }
      if (ReportID === 'FA8.8' && column.headerName === 'Milestones') {
        column.children.forEach((children, index1) => {
          tablecolumnlist[index].children[index1].cellStyle = (params: any) => {
            let rowColor;
            if (children.field === 'Project Key Dates[AIS Sign Off Date]' && (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[AIS Sign Off KPI Color]'];
            } else if (children.field === 'Project Key Dates[Completion Original Revised Date]' && (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[ACS Original or Revised KPI Color]'];
            } else if (children.field === 'ASA[Management Approval Concept Date]' && (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Management Approval Of Concept KPI Color]'];
            }
            return { backgroundColor: rowColor };
          };
        });
      }
      if (ReportID === 'FA8.9' && column.headerName === 'Milestones' || column.headerName === 'ACS') {
        column.children.forEach((children, index1) => {
          tablecolumnlist[index].children[index1].cellStyle = (params: any) => {
            let rowColor;
            if (children.field === 'Project Key Dates[AIS Sign Off Date]' && (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[AIS Sign Off KPI Color]'];
            } else if (children.field === 'Project Key Dates[Concept Note Approval Date]' && (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[Concept Note Approval KPI Color]'];
            } else if (children.field === 'Project Key Dates[Completion Original Revised Date]' && (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== null)) {
              rowColor = params.data['Project Key Dates[ACS Original or Revised KPI Color]'];
            }
            return { backgroundColor: rowColor };
          };
        });
      }
    });
    return tablecolumnlist;
  }
  ExcelStyleUpdate(ReportID: any, selectedSection: any) {
    if (ReportID === 'L3.3' || ReportID === 'L5.2a' || ReportID === 'L5.2b' || ReportID === 'L5.2c' || ReportID === 'L9.4'
      || ReportID === 'L10.5' || ReportID === 'L12.2' || ReportID === 'L14.1' || ReportID === 'FL9.4') {
      this.sectionReportColumnlist.forEach(element => {
        if (selectedSection === 'lending' && element.LatstOverRisk !== undefined) {
          element.LatstOverRisk = {
            'field': 'Project[Overall Risk]',
            'headerName': 'Latest Overall Risk',
            'width': 120,
            cellClassRules: {
              backgroundlightred: params => params.value === 'S' || params.value === 'H',
              backgroundlightyellow: params => params.value === 'M',
              backgroundlightgreen: params => params.value === 'L',
            }
          };
        }
        if (selectedSection === 'lending' && element.AISSignOff !== undefined) {
          element.AISSignOff = {
            'field': 'Project Key Dates[AIS Sign Off Date]',
            'headerName': 'AIS Sign Off',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.ConceptRew !== undefined) {
          element.ConceptRew = {
            'field': 'Project Key Dates[Concept Review Date]',
            'headerName': 'Concept Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.DisclosureConceptDate !== undefined) {
          element.DisclosureConceptDate = {
            'field': 'Project Key Dates[Disclosure Of Concept PID Date]',
            'headerName': 'Disclosure Of Concept PID Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Disclosure Of Concept PID KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.ConceptESRSDate !== undefined) {
          element.ConceptESRSDate = {
            'field': 'Project Key Dates[Concept ESRS Date]',
            'headerName': 'Concept ESRS Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept ESRS KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept ESRS KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept ESRS KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept ESRS KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept ESRS KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept ESRS KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.QualityEnhancementReviewDate !== undefined) {
          element.QualityEnhancementReviewDate = {
            'field': 'Project Key Dates[Quality Enhancement Review Date]',
            'headerName': 'Quality Enhancement Review Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Quality Enhancement Review KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.DescRew !== undefined) {
          element.DescRew = {
            'field': 'Project Key Dates[Decision Review Date]',
            'headerName': 'Decision Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.DisclosureAppraisalPIDDate !== undefined) {
          element.DisclosureAppraisalPIDDate = {
            'field': 'Project Key Dates[Disclosure Of Appraisal PID Date]',
            'headerName': 'Disclosure Of Appraisal PID Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Disclosure Of Appraisal PID KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.AppraisalESRSDate !== undefined) {
          element.AppraisalESRSDate = {
            'field': 'Project Key Dates[Appraisal ESRS Date]',
            'headerName': 'Appraisal ESRS Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Appraisal ESRS KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Appraisal ESRS KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Appraisal ESRS KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Appraisal ESRS KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Appraisal ESRS KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Appraisal ESRS KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.BeginAppsal !== undefined) {
          element.BeginAppsal = {
            'field': 'Project Key Dates[Begin Appraisal Date]',
            'headerName': 'Begin Appraisal',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.AuthNegotation !== undefined) {
          element.AuthNegotation = {
            'field': 'Project Key Dates[Authorize Negotiations Date]',
            'headerName': 'Authorize Negotiations',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
        if (selectedSection === 'lending' && element.ApprovalDate !== undefined) {
          element.ApprovalDate = {
            'field': 'Project Key Dates[Approval Date]',
            'headerName': 'Bank Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#FFFC8F';
                }
              }
            }
          };
        }
      });
    } else if (ReportID === 'P1.6' || ReportID === 'P5.6' || ReportID === 'P5.7' || ReportID === 'P5.10') {
      if (this.sectionReportColumnlist !== null && this.sectionReportColumnlist !== '' && this.sectionReportColumnlist !== undefined) {
        this.sectionReportColumnlist.forEach(element => {
          if (element.LatestProjectRatingDO !== undefined) {
            element.LatestProjectRatingDO = {
              'field': 'Portfolio[Latest Project Rating DO]',
              'headerName': 'Project Ratings - DO',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating DO KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating DO KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating DO KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating DO KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating DO KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating DO KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating DO KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating DO KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingIP !== undefined) {
            element.ProjectRatingIP = {
              'field': 'Portfolio[Latest Project Rating IP]',
              'headerName': 'Project Ratings - IP',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating IP KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating IP KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating IP KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating IP KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating IP KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating IP KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating IP KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating IP KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingFinancialManagement !== undefined) {
            element.ProjectRatingFinancialManagement = {
              'field': 'Portfolio[Latest Project Rating Financial Management]',
              'headerName': 'Project Ratings - Financial Management',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Financial Management KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingProjectManagement !== undefined) {
            element.ProjectRatingProjectManagement = {
              'field': 'Portfolio[Latest Project Rating Project Management]',
              'headerName': 'Project Ratings - Project Management',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Project Management KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingCounterpartFunding !== undefined) {
            element.ProjectRatingCounterpartFunding = {
              'field': 'Portfolio[Latest Project Rating Counterpart Funding]',
              'headerName': 'Project Ratings - Counterpart Funding',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Counterpart Funding KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingProcurement !== undefined) {
            element.ProjectRatingProcurement = {
              'field': 'Portfolio[Latest Project Rating Procurement]',
              'headerName': 'Project Ratings - Procurement',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Procurement KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingsMonitoringandEvaluation !== undefined) {
            element.ProjectRatingsMonitoringandEvaluation = {
              'field': 'Project[Project Ratings - Monitoring and Evaluation]',
              'headerName': 'Project Ratings - Monitoring and Evaluation',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingMonitoringEvaluation !== undefined) {
            element.ProjectRatingMonitoringEvaluation = {
              'field': 'Portfolio[Latest Project Rating Monitoring and Evaluation]',
              'headerName': 'Project Ratings - Monitoring and Evaluation',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Monitoring and Evaluation KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingsOverallSafeguardCompliance !== undefined) {
            element.ProjectRatingsOverallSafeguardCompliance = {
              'field': 'Project[Project Ratings - Overall Safeguard Compliance]',
              'headerName': 'Project Ratings - Overall Safeguard Compliance',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ProjectRatingSafeguardCompliance !== undefined) {
            element.ProjectRatingSafeguardCompliance = {
              'field': 'Portfolio[Latest Project Rating Overall Safeguard Compliance]',
              'headerName': 'Project Ratings - Overall Safeguard Compliance',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] !== undefined) {
                    return params.data['Portfolio[Latest Project Rating Overall Safeguard Compliance KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.OverallRisk !== undefined) {
            element.OverallRisk = {
              'field': 'Portfolio[Overall Risk]',
              'headerName': 'Overall Risk',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Project[Overall Risk KPI Color]'] !== undefined) {
                    return params.data['Project[Overall Risk KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Project[Overall Risk KPI Color]'] !== undefined) {
                    return params.data['Project[Overall Risk KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Project[Overall Risk KPI Color]'] !== undefined) {
                    return params.data['Project[Overall Risk KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Project[Overall Risk KPI Color]'] !== undefined) {
                    return params.data['Project[Overall Risk KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
          if (element.ApprovalDate !== undefined) {
            element.ApprovalDate = {
              'field': 'Project Key Dates[Approval Date]',
              'headerName': 'Approval Date',
              'width': 120,
              cellClassRules: {
                backgroundlightgreen: params => {
                  if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                    return params.data['Project Key Dates[Approval KPI Color]'] === '#D7F8D9';
                  }
                },
                backgroundlightred: params => {
                  if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                    return params.data['Project Key Dates[Approval KPI Color]'] === '#F0C1C1';
                  }
                },
                backgroundlightyellow: params => {
                  if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                    return params.data['Project Key Dates[Approval KPI Color]'] === '#FFFC8F';
                  }
                },
                backgroundlightorange: params => {
                  if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                    return params.data['Project Key Dates[Approval KPI Color]'] === '#F1D4B4';
                  }
                }
              }
            };
          }
        });
      }
    } else if (ReportID === 'A8.1' || ReportID === 'A8.2' || ReportID === 'A8.4' || ReportID === 'A8.8' || ReportID === 'A8.9' ||
      ReportID === 'A9.2' || ReportID === 'FA8.1' || ReportID === 'FA8.8' || ReportID === 'FA8.9') {
      this.sectionReportColumnlist.forEach(element => {
        if (element.AINSignOff !== undefined) {
          element.AINSignOff = {
            'field': 'Project Key Dates[AIS Sign Off Date]',
            'headerName': 'AIN Sign Off',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.AISSignOffDate !== undefined) {
          element.AISSignOffDate = {
            'field': 'Project Key Dates[AIS Sign Off Date]',
            'headerName': 'AIS Sign Off Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[AIS Sign Off KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[AIS Sign Off KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ConceptApprovalDate !== undefined) {
          element.ConceptApprovalDate = {
            'field': 'Project Key Dates[Concept Note Approval Date]',
            'headerName': 'CN Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ACSOriginalRevised !== undefined) {
          element.ACSOriginalRevised = {
            'field': 'Project Key Dates[Completion Original Revised Date]',
            'headerName': 'ACS Original or Revised Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.OriginalorRevisedStatus !== undefined) {
          element.OriginalorRevisedStatus = {
            'field': 'Project Key Dates[Completion Summary Status Code]',
            'headerName': 'ACS- Original or Revised Status',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[ACS Original or Revised KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[ACS Original or Revised KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ConceptNoteApproval !== undefined) {
          element.ConceptNoteApproval = {
            'field': 'ASA[Management Approval Concept Date]',
            'headerName': 'CN Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ConceptApproval !== undefined) {
          element.ConceptApproval = {
            'field': 'Project Key Dates[Management Approval Of Concept Date]',
            'headerName': 'Concept Note Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ConceptApprovalStatus !== undefined) {
          element.ConceptApprovalStatus = {
            'field': 'Project Key Dates[Management Approval Of Concept Status Code]',
            'headerName': 'Concept Note Approval Status',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Management Approval Of Concept KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.DeliverableCompletionDate !== undefined) {
          element.DeliverableCompletionDate = {
            'field': 'ASA Deliverable[Deliverable Completion Date]',
            'headerName': 'Deliverable Completion Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['ASA Deliverable[Deliverable Completion KPI Color]'] !== undefined) {
                  return params.data['ASA Deliverable[Deliverable Completion KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['ASA Deliverable[Deliverable Completion KPI Color]'] !== undefined) {
                  return params.data['ASA Deliverable[Deliverable Completion KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['ASA Deliverable[Deliverable Completion KPI Color]'] !== undefined) {
                  return params.data['ASA Deliverable[Deliverable Completion KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['ASA Deliverable[Deliverable Completion KPI Color]'] !== undefined) {
                  return params.data['ASA Deliverable[Deliverable Completion KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ProgressReview !== undefined) {
          element.ProgressReview = {
            'field': 'ASA[Progress Review Due Date]',
            'headerName': 'Progress Review Due Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project[Progress Review Due Date Color]'] !== undefined) {
                  return params.data['Project[Progress Review Due Date Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project[Progress Review Due Date Color]'] !== undefined) {
                  return params.data['Project[Progress Review Due Date Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project[Progress Review Due Date Color]'] !== undefined) {
                  return params.data['Project[Progress Review Due Date Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project[Progress Review Due Date Color]'] !== undefined) {
                  return params.data['Project[Progress Review Due Date Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
      });
    } else if (ReportID === 'RAS1.1') {
      this.sectionReportColumnlist.forEach(element => {
        if (element.CNApproval !== undefined) {
          element.CNApproval = {
            'field': 'Project Key Dates[Concept Note Approval Date]',
            'headerName': 'CN Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Note Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Note Approval KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
      });
    } else if (ReportID === 'C3.2') {
      this.sectionReportColumnlist.forEach(element => {
        if (element.ConceptReview !== undefined) {
          element.ConceptReview = {
            'field': 'Project Key Dates[Concept Review Date]',
            'headerName': 'Concept Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.Board !== undefined) {
          element.Board = {
            'field': 'Project Key Dates[Approval Date]',
            'headerName': 'Board',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.FinalDecisionReview !== undefined) {
          element.FinalDecisionReview = {
            'field': 'Project Key Dates[Final Decision Review Date]',
            'headerName': 'Final Decision Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Final Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Final Decision Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Final Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Final Decision Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Final Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Final Decision Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Final Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Final Decision Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
      });
    } else if (ReportID === 'Sg2.1' || ReportID === 'Sg2.3') {
      this.sectionReportColumnlist.forEach(element => {
        if (element.ConceptReviewDate !== undefined) {
          element.ConceptReviewDate = {
            'field': 'Project Key Dates[Concept Review Date]',
            'headerName': 'Concept Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.MilestonesConceptReviewDate !== undefined) {
          element.MilestonesConceptReviewDate = {
            'field': 'Project Key Dates[Concept Review Date]',
            'headerName': 'Milestones - Concept Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.BeginAppraisalDate !== undefined) {
          element.BeginAppraisalDate = {
            'field': 'Project Key Dates[Begin Appraisal Date]',
            'headerName': 'Begin Appraisal',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.MilestonesBeginAppraisalDate !== undefined) {
          element.MilestonesBeginAppraisalDate = {
            'field': 'Project Key Dates[Begin Appraisal Date]',
            'headerName': 'Milestones - Begin Appraisal',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Begin Appraisal KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Begin Appraisal KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.DecisionReviewDate !== undefined) {
          element.DecisionReviewDate = {
            'field': 'Project Key Dates[Decision Review Date]',
            'headerName': 'Decision Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.MilestonesDecisionReviewDate !== undefined) {
          element.MilestonesDecisionReviewDate = {
            'field': 'Project Key Dates[Decision Review Date]',
            'headerName': 'Milestones - Decision Review',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Decision Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Decision Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ApprovalDate !== undefined) {
          element.ApprovalDate = {
            'field': 'Project Key Dates[Approval Date]',
            'headerName': 'Bank Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.MilestonesApprovalDate !== undefined) {
          element.MilestonesApprovalDate = {
            'field': 'Project Key Dates[Approval Date]',
            'headerName': 'Milestones - Bank Approval',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.AuthorizeNegotiationsDate !== undefined) {
          element.AuthorizeNegotiationsDate = {
            'field': 'Project Key Dates[Authorize Negotiations Date]',
            'headerName': 'Milestones - Authorized to Negotiate',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Authorize Negotiations KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Authorize Negotiations KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
      });
    } else if (ReportID === 'fm1.1' || ReportID === 'fm3.10') {
      this.sectionReportColumnlist.forEach(element => {
        if (element.PCNDate !== undefined) {
          element.PCNDate = {
            'field': 'Project Key Dates[Concept Review Date]',
            'headerName': 'PCN Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Concept Review KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Concept Review KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
        if (element.ApprovalDate !== undefined) {
          element.ApprovalDate = {
            'field': 'Project Key Dates[Approval Date]',
            'headerName': 'Board Approval Date',
            'width': 120,
            cellClassRules: {
              backgroundlightgreen: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#D7F8D9';
                }
              },
              backgroundlightred: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F0C1C1';
                }
              },
              backgroundlightyellow: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#FFFC8F';
                }
              },
              backgroundlightorange: params => {
                if (params.data !== undefined && params.data['Project Key Dates[Approval KPI Color]'] !== undefined) {
                  return params.data['Project Key Dates[Approval KPI Color]'] === '#F1D4B4';
                }
              }
            }
          };
        }
      });
    }
  }
  getRegionlist() {
    const params = {
      IgnoreCache: true,
      id: 1,
      title: 'Region',
      query: 'EVALUATE SUMMARIZECOLUMNS(Region[Region Code],Region[Region Name],FILTER(KEEPFILTERS(VALUES(\'Region\'[Region Code])),(\'Region\'[Region Code]<> BLANK())),KEEPFILTERS( FILTER( ALL( Region[Region Code] ), NOT( Region[Region Code] IN {\"AFR\",\"OTH\"} )))) ORDER BY Region[Region Code] ASC,Region[Region Name] ASC',
      measureQuery: { code: 'Region[Region Code]', name: 'Region[Region Name]' },
      dataSource: 'Corporate - Operations',
      InitialCatalog: 'All Products',
      dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
    };
    return this.http.post(this.dashboardReqURL, params);
  }
  getHrRegionlist() {
    const category = {
      IgnoreCache: true,
      id: 1,
      title: 'Region',
      baseQuery: 'EVALUATE SUMMARIZECOLUMNS(\'Official Staff on Board\'[Bank Geographical Regions], KEEPFILTERS( FILTER( ALL( \'Official Staff on Board\'[Bank Geographical Regions] ), NOT( ISBLANK( \'Official Staff on Board\'[Bank Geographical Regions] ))))) ORDER BY \'Official Staff on Board\'[Bank Geographical Regions] ASC',
      measureQuery: { code: 'Official Staff on Board[Bank Geographical Regions]', name: 'Official Staff on Board[Bank Geographical Regions]' },
      dataSource: 'HRIDR QA',
      environmentName: 'HR-Facet',
      InitialCatalog: '',
      dataSetId: 'a5a3587c-7c93-45bf-8e1c-154150fd6e27'
    };
    const jsondata = {
      queries: [{ query: category.baseQuery }],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === category.environmentName);
    // tslint:disable-next-line:no-console
    console.log(category.title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata.results[0].tables[0].rows;
    }));
  }
  getHrOrganizationlist() {
    const category = {
      IgnoreCache: true,
      id: 1,
      title: 'Organization',
      baseQuery: 'EVALUATE SUMMARIZECOLUMNS(\'Official Staff on Board\'[Org Grp], KEEPFILTERS( TREATAS( {"Bank","IFC","MIGA"}, \'Official Staff on Board\'[Org Grp] ))) ORDER BY \'Official Staff on Board\'[Org Grp] ASC',
      measureQuery: { code: 'Official Staff on Board[Org Grp]', name: 'Official Staff on Board[Org Grp]' },
      dataSource: 'HRIDR QA',
      environmentName: 'HR-Facet',
      InitialCatalog: '',
      dataSetId: 'a5a3587c-7c93-45bf-8e1c-154150fd6e27'
    };
    const jsondata = {
      queries: [{ query: category.baseQuery }],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === category.environmentName);
    // tslint:disable-next-line:no-console
    console.log(category.title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata.results[0].tables[0].rows;
    }));
  }
  getHrVpuGrouplist() {
    const category = {
      IgnoreCache: true,
      id: 1,
      title: 'VPU Group',
      baseQuery: 'EVALUATE SUMMARIZECOLUMNS(\'Official Staff on Board\'[VPU Grouping], KEEPFILTERS( TREATAS( {"GPS-CCSA","Other Departments","VP - Africa, LAC and W.Europe","VP - Asia Pacific","VP - Asia, Eastern Europe, MENA","VP - Blended Finance  &   Partnerships","VP - Business Advisory","VP - Corporate Risk and Sustainability","VP - Corporate Strategy  &   Resources","VP - Economics  &   Private Sector Develop","VP - EMENA","VP - EMENA and Western Europe","VP - ES &  G Sustainability Advice  &   Solutions","VP - FPD","VP - General Counsel","VP - Global Client Services","VP - Global  Industries","VP - Global Partnerships","VP - Risk  &   Financial Sustainability","VP - Risk Management and Portfolio","VP - Treasury and Syndications"}, \'Official Staff on Board\'[VPU Grouping] ))) ORDER BY \'Official Staff on Board\'[VPU Grouping] ASC',
      measureQuery: { code: 'Official Staff on Board[VPU Grouping]', name: 'Official Staff on Board[VPU Grouping]' },
      dataSource: 'HRIDR QA',
      environmentName: 'HR-Facet',
      InitialCatalog: '',
      dataSetId: 'a5a3587c-7c93-45bf-8e1c-154150fd6e27'
    };
    const jsondata = {
      queries: [{ query: category.baseQuery }],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === category.environmentName);
    // tslint:disable-next-line:no-console
    console.log(category.title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata.results[0].tables[0].rows;
    }));
  }
  getRMVpuGrouplist() {
    const category = {
      IgnoreCache: true,
      id: 1,
      title: 'VPU Group',
      baseQuery: 'EVALUATE SUMMARIZECOLUMNS(\'Funds Center\'[VPU Group Acronym],KEEPFILTERS ( FILTER ( ALL ( \'Funds Center\'[VPU Group Acronym] ), NOT ( \'Funds Center\'[VPU Group Acronym] IN {"99999","99995","99997","99998","99999","BB0DUMMY","TF0DUMMY","UN0DUMMY","Dummy Fund Center" } ))),KEEPFILTERS( FILTER( ALL( \'Funds Center\'[VPU Group Acronym] ), NOT( ISBLANK( \'Funds Center\'[VPU Group Acronym] ))))) ORDER BY \'Funds Center\'[VPU Group Acronym] ASC',
      measureQuery: { code: 'Funds Center[VPU Group Acronym]', name: 'Funds Center[VPU Group Acronym]' },
      environmentName: 'RM-Facet',
      dataSource: 'Resource Management QA',
      InitialCatalog: 'ssrds_ResourceManagement',
      dataSetId: '0d8417c6-d043-407d-8daf-490a56a16cbb'
    };
    const jsondata = {
      queries: [{ query: category.baseQuery }],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === category.environmentName);
    // tslint:disable-next-line:no-console
    console.log(category.title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata.results[0].tables[0].rows;
    }));
  }
  getRMFundCenterVpulist() {
    const category = {
      IgnoreCache: true,
      id: 1,
      title: 'Fund Center VPU',
      baseQuery: 'EVALUATE SUMMARIZECOLUMNS(\'Funds Center\'[VPU Acronym],KEEPFILTERS( FILTER( ALL( \'Funds Center\'[VPU Acronym] ), NOT( ISBLANK( \'Funds Center\'[VPU Acronym] ))))) ORDER BY \'Funds Center\'[VPU Acronym] ASC',
      measureQuery: { code: 'Funds Center[VPU Acronym]', name: 'Funds Center[VPU Acronym]' },
      environmentName: 'RM-Facet',
      dataSource: 'Resource Management QA',
      InitialCatalog: 'ssrds_ResourceManagement',
      dataSetId: '0d8417c6-d043-407d-8daf-490a56a16cbb'
    };
    const jsondata = {
      queries: [{ query: category.baseQuery }],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === category.environmentName);
    // tslint:disable-next-line:no-console
    console.log(category.title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata.results[0].tables[0].rows;
    }));
  }
  getcountrylist() {
    const params = {
      IgnoreCache: true,
      id: 2,
      title: 'Country',
      query: 'EVALUATE SUMMARIZECOLUMNS(\'Country\'[Country Code],  \'Country\'[Country Name],FILTER (VALUES ( \'Country\'[Country Name] ),( \'Country\'[Country Name] <> "" ))) ORDER BY [Country Name]',
      measureQuery: { code: 'Country[Country Code]', name: 'Country[Country Name]' },
      dataSource: 'Corporate - Operations',
      InitialCatalog: 'All Products',
      dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
    };
    return this.http.post(this.dashboardReqURL, params);
  }
  getpracticegrouplist() {
    const params = {
      IgnoreCache: true,
      id: 3,
      title: 'Practice Group',
      query: 'EVALUATE SUMMARIZECOLUMNS(\'Global Practice\'[Practice Group], \'Global Practice\'[Global Practice Code],  \'Global Practice\'[Global Practice Name],FILTER (VALUES ( \'Global Practice\'[Global Practice Name] ),( \'Global Practice\'[Global Practice Name] <> "" )), FILTER (VALUES ( \'Global Practice\'[Practice Group] ),( \'Global Practice\'[Practice Group] <> "" ))) ORDER BY \'Global Practice\'[Practice Group] ASC',
      measureQuery: { code: 'Global Practice[Global Practice Code]', name: 'Global Practice[Global Practice Name]' },
      dataSource: 'Corporate - Operations',
      InitialCatalog: 'All Products',
      dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
    };
    return this.http.post(this.dashboardReqURL, params);
  }
  getrequestunitlist() {
    const params = {
      IgnoreCache: true,
      id: 4,
      title: 'Requesting Unit',
      query: 'EVALUATE SUMMARIZECOLUMNS(\'Requesting Unit\'[Requesting Unit],KEEPFILTERS( TREATAS( {1}, \'^Time - Lending\'[Current Approval FY Flag] )), KEEPFILTERS( FILTER( ALL( \'Requesting Unit\'[Requesting Unit] ), NOT( ISBLANK( \'Requesting Unit\'[Requesting Unit] )))))ORDER BY \'Requesting Unit\'[Requesting Unit] ASC',
      measureQuery: { code: 'Requesting Unit[Requesting Unit]', name: 'Requesting Unit[Requesting Unit]' },
      dataSource: 'Corporate - Operations',
      InitialCatalog: 'All Products',
      dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3',
    };
    return this.http.post(this.dashboardReqURL, params);
  }
  getresponseunitlist() {
    const params = {
      IgnoreCache: true,
      id: 5,
      title: 'Responsible Unit',
      query: 'EVALUATE SUMMARIZECOLUMNS(\'Responsible Unit\'[Responsible Unit], KEEPFILTERS( FILTER( ALL(\'Responsible Unit\'[Responsible Unit]), NOT( ISBLANK(\'Responsible Unit\'[Responsible Unit])))))ORDER BY \'Responsible Unit\'[Responsible Unit] ASC',
      measureQuery: { code: 'Responsible Unit[Responsible Unit]', name: 'Responsible Unit[Responsible Unit]' },
      dataSource: 'Corporate - Operations',
      InitialCatalog: 'All Products',
      dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
    };
    return this.http.post(this.dashboardReqURL, params);
  }
  getdirectorunitlist() {
    const params = {
      IgnoreCache: true,
      id: 6,
      title: 'Director Unit',
      query: 'EVALUATE SUMMARIZECOLUMNS(\'Responsible Unit\'[Responsible Department], KEEPFILTERS( FILTER( ALL(\'Responsible Unit\'[Responsible Department]), NOT( ISBLANK(\'Responsible Unit\'[Responsible Department])))))ORDER BY \'Responsible Unit\'[Responsible Department] ASC',
      measureQuery: { code: 'Responsible Unit[Responsible Department]', name: 'Responsible Unit[Responsible Department]' },
      dataSource: 'Corporate - Operations',
      InitialCatalog: 'All Products',
      dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
    };
    return this.http.post(this.dashboardReqURL, params);
  }
  LoadlendingPortfolioTotal(selectedReport, Data, flag, gridApi) {
    if (selectedReport === 'FL9.4') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0; Data.Grand_Cofinance = 0;
        Data.Grand_FYBBTF = 0; Data.Grand_CumBBTF = 0;
        Data.forEach(x => {
          if (x['[Lending Project Count]']) {
            Data.Grand_ProjectCount += x['[Lending Project Count]'];
          }
          if (x['[Total Commitment Amount]']) {
            const TotalCommitment = x['[Total Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[IBRD Commitment Amount]']) {
            const IBRDCommitment = x['[IBRD Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDCommitment);
          }
          if (x['[Other Commitment Amount]']) {
            const OtherCommitment = x['[Other Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OtherCommitment);
          }
          if (x['[IDA Commitment Amount]']) {
            const IDACommitment = x['[IDA Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDACommitment);
          }
          if (x['[Cofinance Amount]']) {
            const Cofinance = x['[Cofinance Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(Cofinance);
          }
          if (x['[FY BB+TF Expense]']) {
            const BBTFExpense = x['[FY BB+TF Expense]'].replace(/[^.\d]/g, '');
            Data.Grand_FYBBTF += parseFloat(BBTFExpense);
          }
          if (x['[Cumulative BB+TF Expense]']) {
            const BBTFExpense = x['[Cumulative BB+TF Expense]'].replace(/[^.\d]/g, '');
            Data.Grand_CumBBTF += parseFloat(BBTFExpense);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_FYBBTF = '$' + (Math.round(Data.Grand_FYBBTF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumBBTF = '$' + (Math.round(Data.Grand_CumBBTF * 100) / 100).toFixed(2) + 'K';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Project Count]': Data.Grand_ProjectCount, '[Total Commitment Amount]': Data.Grand_TotalCommitment,
          '[IBRD Commitment Amount]': Data.Grand_IBRDCommitment, '[IDA Commitment Amount]': Data.Grand_IDACommitment,
          '[Other Commitment Amount]': Data.Grand_OtherCommitment, '[Cofinance Amount]': Data.Grand_Cofinance,
          '[FY BB+TF Expense]': Data.Grand_FYBBTF, '[Cumulative BB+TF Expense]': Data.Grand_CumBBTF
        }
      ]);
    } else if (selectedReport === 'L3.3') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0; Data.Grand_Cofinance = 0;
        Data.Grand_FYBBTF = 0; Data.Grand_CumBBTF = 0;
        Data.forEach(x => {
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += x['[Lending Project #]'];
          }
          if (x['[Lending Total Commitment $]']) {
            const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IBRD Total Commitment $]']) {
            const IBRDCommitment = x['[Lending IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDCommitment);
          }
          if (x['[Lending Others Total Commitment $]']) {
            const OtherCommitment = x['[Lending Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OtherCommitment);
          }
          if (x['[Lending IDA Total Commitment $]']) {
            const IDACommitment = x['[Lending IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDACommitment);
          }
          if (x['[Lending PE Cofinance $]']) {
            const CoFinanceCommitment = x['[Lending PE Cofinance $]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(CoFinanceCommitment);
          }
          if (x['[Lending Current FY BB+TF Expense $]']) {
            const BBTFExpense = x['[Lending Current FY BB+TF Expense $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYBBTF += parseFloat(BBTFExpense);
          }
          if (x['[Lending Cumulative BB+TF Expense $]']) {
            const BBTFExpense = x['[Lending Cumulative BB+TF Expense $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumBBTF += parseFloat(BBTFExpense);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_FYBBTF = '$' + (Math.round(Data.Grand_FYBBTF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumBBTF = '$' + (Math.round(Data.Grand_CumBBTF * 100) / 100).toFixed(2) + 'K';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Project #]': Data.Grand_ProjectCount, '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment, '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment,
          '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment, '[Lending PE Cofinance $]': Data.Grand_Cofinance,
          '[Lending Current FY BB+TF Expense $]': Data.Grand_FYBBTF, '[Lending Cumulative BB+TF Expense $]': Data.Grand_CumBBTF
        }
      ]);
    } else if (selectedReport === 'L5.2a') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0;
        Data.forEach(x => {
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += x['[Lending Project #]'];
          }
          if (x['[Lending Total Commitment $]']) {
            const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IBRD Total Commitment $]']) {
            const IBRDCommitment = x['[Lending IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDCommitment);
          }
          if (x['[Lending Others Total Commitment $]']) {
            const OtherCommitment = x['[Lending Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OtherCommitment);
          }
          if (x['[Lending IDA Total Commitment $]']) {
            const IDACommitment = x['[Lending IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDACommitment);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Expected Board Week]': 'Total', '[Lending Project #]': Data.Grand_ProjectCount, 'Project[Project Id]': '',
          '[Lending Total Commitment $]': Data.Grand_TotalCommitment, '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment,
          '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment, '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment
        }
      ]);
    } else if (selectedReport === 'L5.2b') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0;
        Data.forEach(x => {
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += x['[Lending Project #]'];
          }
          if (x['[Lending Total Commitment $]']) {
            const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IBRD Total Commitment $]']) {
            const IBRDCommitment = x['[Lending IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDCommitment);
          }
          if (x['[Lending Others Total Commitment $]']) {
            const OtherCommitment = x['[Lending Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OtherCommitment);
          }
          if (x['[Lending IDA Total Commitment $]']) {
            const IDACommitment = x['[Lending IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDACommitment);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Name]': 'Total', '[Lending Project #]': Data.Grand_ProjectCount, 'Project[Project Id]': '',
          '[Lending Total Commitment $]': Data.Grand_TotalCommitment, '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment,
          '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment, '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment
        }
      ]);
    } else if (selectedReport === 'L5.2c') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0;
        Data.forEach(x => {
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += x['[Lending Project #]'];
          }
          if (x['[Lending Total Commitment $]']) {
            const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IBRD Total Commitment $]']) {
            const IBRDCommitment = x['[Lending IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDCommitment);
          }
          if (x['[Lending Others Total Commitment $]']) {
            const OtherCommitment = x['[Lending Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OtherCommitment);
          }
          if (x['[Lending IDA Total Commitment $]']) {
            const IDACommitment = x['[Lending IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDACommitment);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Global Practice[Practice Group Code]': 'Total', '[Lending Project #]': Data.Grand_ProjectCount, 'Project[Project Id]': '',
          '[Lending Total Commitment $]': Data.Grand_TotalCommitment, '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment,
          '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment, '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment
        }
      ]);
    } else if (selectedReport === 'L9.3') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0; Data.Grand_Cofinance = 0;
        Data.Grand_CumTotalExpense = 0; Data.Grand_CumBBExpense = 0; Data.Grand_CumTFExpense = 0;
        Data.Grand_CurrentFYTotal = 0; Data.Grand_CurrentFYBB = 0; Data.Grand_CurrentFYTF = 0;
        Data.Grand_PreparationCost = 0;
        Data.forEach(x => {
          if (x['[Project #]']) {
            Data.Grand_ProjectCount += x['[Project #]'];
          }
          if (x['[Total Commitment]']) {
            const TotalCommitment = x['[Total Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[IBRD Total Commitment]']) {
            const IBRDCommitment = x['[IBRD Total Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDCommitment);
          }
          if (x['[Others Total Commitment]']) {
            const OtherCommitment = x['[Others Total Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OtherCommitment);
          }
          if (x['[IDA Total Commitment]']) {
            const IDACommitment = x['[IDA Total Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDACommitment);
          }
          if (x['[PE Cofinance]']) {
            const Cofinance = x['[PE Cofinance]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(Cofinance);
          }
          if (x['[Project Total Cumulative Expenses]']) {
            const cummulative = x['[Project Total Cumulative Expenses]'].replace(/[^.\d]/g, '');
            Data.Grand_CumTotalExpense += parseFloat(cummulative);
          }
          if (x['[Project BB Cumulative Expenses]']) {
            const cummulative = x['[Project BB Cumulative Expenses]'].replace(/[^.\d]/g, '');
            Data.Grand_CumBBExpense += parseFloat(cummulative);
          }
          if (x['[Project TF Cumulative Expenses]']) {
            const cummulative = x['[Project TF Cumulative Expenses]'].replace(/[^.\d]/g, '');
            Data.Grand_CumTFExpense += parseFloat(cummulative);
          }
          if (x['[Project Total Cumulative Expenses Current FY]']) {
            const cummulative = x['[Project Total Cumulative Expenses Current FY]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentFYTotal += parseFloat(cummulative);
          }
          if (x['[Project BB Cumulative Expenses Current FY]']) {
            const cummulative = x['[Project BB Cumulative Expenses Current FY]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentFYBB += parseFloat(cummulative);
          }
          if (x['[Project TF Cumulative Expenses Current FY]']) {
            const cummulative = x['[Project TF Cumulative Expenses Current FY]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentFYTF += parseFloat(cummulative);
          }
          if (x['[Project Total Preparation Costs]']) {
            const Preparation = x['[Project Total Preparation Costs]'].replace(/[^.\d]/g, '');
            Data.Grand_PreparationCost += parseFloat(Preparation);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CumTotalExpense = '$' + (Math.round(Data.Grand_CumTotalExpense * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumBBExpense = '$' + (Math.round(Data.Grand_CumBBExpense * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumTFExpense = '$' + (Math.round(Data.Grand_CumTFExpense * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentFYTotal = '$' + (Math.round(Data.Grand_CurrentFYTotal * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentFYBB = '$' + (Math.round(Data.Grand_CurrentFYBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentFYTF = '$' + (Math.round(Data.Grand_CurrentFYTF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_PreparationCost = '$' + (Math.round(Data.Grand_PreparationCost * 100) / 100).toFixed(2) + 'K';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Project #]': Data.Grand_ProjectCount, '[Total Commitment]': Data.Grand_TotalCommitment,
          '[IBRD Total Commitment]': Data.Grand_IBRDCommitment, '[IDA Total Commitment]': Data.Grand_IDACommitment,
          '[Others Total Commitment]': Data.Grand_OtherCommitment, '[PE Cofinance]': Data.Grand_Cofinance,
          '[Project Total Cumulative Expenses]': Data.Grand_CumTotalExpense, '[Project BB Cumulative Expenses]': Data.Grand_CumBBExpense,
          '[Project TF Cumulative Expenses]': Data.Grand_CumTFExpense, '[Project Total Cumulative Expenses Current FY]': Data.Grand_CurrentFYTotal,
          '[Project BB Cumulative Expenses Current FY]': Data.Grand_CurrentFYBB, '[Project TF Cumulative Expenses Current FY]': Data.Grand_CurrentFYTF,
          '[Project Total Preparation Costs]': Data.Grand_PreparationCost
        }
      ]);
    } else if (selectedReport === 'L9.4') {
      if (flag === '2') {
        Data.Grand_TotalCommitment = 0; Data.Grand_ProjectCount = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0; Data.Grand_Cofinance = 0;
        Data.Grand_FYBBTF = 0; Data.Grand_CumBBTF = 0;
        Data.forEach(x => {
          if (x['[Total Commitment Amount]']) {
            const Grand_TotalCommitment = x['[Total Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(Grand_TotalCommitment);
          }
          if (x['[IBRD Commitment Amount]']) {
            const IBRD_Commitment = x['[IBRD Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRD_Commitment);
          }
          if (x['[IDA Commitment Amount]']) {
            const IDA_Commitment = x['[IDA Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDA_Commitment);
          }
          if (x['[Other Commitment Amount]']) {
            const Other_Commitment = x['[Other Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(Other_Commitment);
          }
          if (x['[Cofinance Amount]']) {
            const Cofinance_Commitment = x['[Cofinance Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(Cofinance_Commitment);
          }
          if (x['[FY BB+TF Expense]']) {
            const FYBBTF = x['[FY BB+TF Expense]'].replace(/[^.\d]/g, '');
            Data.Grand_FYBBTF += parseFloat(FYBBTF);
          }
          if (x['[Cumulative BB+TF Expense]']) {
            const CumBBTF = x['[Cumulative BB+TF Expense]'].replace(/[^.\d]/g, '');
            Data.Grand_CumBBTF += parseFloat(CumBBTF);
          }
          if (x['[Lending Project Count]']) {
            Data.Grand_ProjectCount += parseFloat(x['[Lending Project Count]']);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_FYBBTF = '$' + (Math.round(Data.Grand_FYBBTF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumBBTF = '$' + (Math.round(Data.Grand_CumBBTF * 100) / 100).toFixed(2) + 'K';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Project Count]': Data.Grand_ProjectCount,
          '[Total Commitment Amount]': Data.Grand_TotalCommitment, '[IBRD Commitment Amount]': Data.Grand_IBRDCommitment,
          '[IDA Commitment Amount]': Data.Grand_IDACommitment, '[Other Commitment Amount]': Data.Grand_OtherCommitment,
          '[Cofinance Amount]': Data.Grand_Cofinance, '[FY BB+TF Expense]': Data.Grand_FYBBTF,
          '[Cumulative BB+TF Expense]': Data.Grand_CumBBTF
        }
      ]);
    } else if (selectedReport === 'L9.6') {
      if (flag === '2') {
        const projectId = [];
        Data.GrandTotalCommit = 0; Data.GrandCofinance = 0; Data.GrandExpBBTF = 0;
        Data.forEach(x => {
          if (projectId.indexOf(x['Project[Project Id]']) === -1) {
            projectId.push(x['Project[Project Id]']);
            if (x['[Lending Total Commitment $]']) {
              const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
              Data.GrandTotalCommit += parseFloat(TotalCommitment);
            }
            if (x['[Lending PE Cofinance $]']) {
              const Cofinance = x['[Lending PE Cofinance $]'].replace(/[^.\d]/g, '');
              Data.GrandCofinance += parseFloat(Cofinance);
            }
            if (x['[Lending Current FY BB+TF Expense $]']) {
              const BBTFAmount = x['[Lending Current FY BB+TF Expense $]'].replace(/[^.\d]/g, '');
              Data.GrandExpBBTF += parseFloat(BBTFAmount);
            }
          }
        });
        Data.GrandTotalCommit = '$' + (Math.round(Data.GrandTotalCommit * 100) / 100).toFixed(2) + 'M';
        Data.GrandCofinance = '$' + (Math.round(Data.GrandCofinance * 100) / 100).toFixed(2) + 'M';
        Data.GrandExpBBTF = '$' + (Math.round(Data.GrandExpBBTF * 100) / 100).toFixed(2) + 'K';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Lending Program Outliers[Outliers Name]': 'Total', '[Lending Total Commitment $]': Data.GrandTotalCommit, 'Project[Project Id]': '',
          '[Lending PE Cofinance $]': Data.GrandCofinance, '[Lending Current FY BB+TF Expense $]': Data.GrandExpBBTF
        }
      ]);
    } else if (selectedReport === 'L10.5') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalCommitment = 0; Data.Grand_IBRDCommitment = 0;
        Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0; Data.Grand_Cofinance = 0;
        Data.Grand_IDACredit = 0; Data.Grand_IDAGrant = 0; Data.Grand_IDAGuarantee = 0;
        Data.Grand_IDASML = 0; Data.Grand_NationalTotal = 0; Data.Grand_NationalCredit = 0;
        Data.Grand_NationalGrant = 0; Data.Grand_NationalGuarantee = 0; Data.Grand_NationalSML = 0;
        Data.Grand_RegionalTotal = 0; Data.Grand_RegionalCredit = 0; Data.Grand_RegionalGrant = 0;
        Data.Grand_RegionalGuarantee = 0; Data.Grand_RefugeeTotal = 0; Data.Grand_RefugeeCredit = 0;
        Data.Grand_RefugeeGrant = 0; Data.Grand_CRWTotal = 0; Data.Grand_CRWCredit = 0;
        Data.Grand_CRWGrant = 0; Data.Grand_SUW = 0; Data.Grand_SUWRegular = 0; Data.Grand_SUWSML = 0;
        Data.Grand_TransitionalTotal = 0; Data.Grand_TransitionalCredit = 0;
        Data.forEach(x => {
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += x['[Lending Project #]'];
          }
          if (x['[Lending Total Commitment $]']) {
            const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IBRD Total Commitment $]']) {
            const IBRDTotalCommitment = x['[Lending IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(IBRDTotalCommitment);
          }
          if (x['[Lending Others Total Commitment $]']) {
            const OthersTotalCommitment = x['[Lending Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(OthersTotalCommitment);
          }
          if (x['[Lending PE Cofinance $]']) {
            const Cofinance = x['[Lending PE Cofinance $]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(Cofinance);
          }
          if (x['[Lending IDA Total Commitment $]']) {
            const IDATotalAmount = x['[Lending IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(IDATotalAmount);
          }
          if (x['[Project IDA Financing IDA Credit $]']) {
            const IDACreditAmount = x['[Project IDA Financing IDA Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACredit += parseFloat(IDACreditAmount);
          }
          if (x['[Project IDA Financing IDA Grant $]']) {
            const IDAGrantAmount = x['[Project IDA Financing IDA Grant $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDAGrant += parseFloat(IDAGrantAmount);
          }
          if (x['[Project IDA Financing IDA Guarantee $]']) {
            const IDAGuaranteeAmount = x['[Project IDA Financing IDA Guarantee $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDAGuarantee += parseFloat(IDAGuaranteeAmount);
          }
          if (x['[Project IDA Financing IDA Short Maturity $]']) {
            const IDAShortMaturityAmount = x['[Project IDA Financing IDA Short Maturity $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDASML += parseFloat(IDAShortMaturityAmount);
          }
          if (x['[Project IDA Financing National Total $]']) {
            const NationalTotal = x['[Project IDA Financing National Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_NationalTotal += parseFloat(NationalTotal);
          }
          if (x['[Project IDA Financing National Credit $]']) {
            const NationalCreditAmount = x['[Project IDA Financing National Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_NationalCredit += parseFloat(NationalCreditAmount);
          }
          if (x['[Project IDA Financing National Grant $]']) {
            const NationalGrantAmount = x['[Project IDA Financing National Grant $]'].replace(/[^.\d]/g, '');
            Data.Grand_NationalGrant += parseFloat(NationalGrantAmount);
          }
          if (x['[Project IDA Financing National Guarantee $]']) {
            const NationalGuaranteeAmount = x['[Project IDA Financing National Guarantee $]'].replace(/[^.\d]/g, '');
            Data.Grand_NationalGuarantee += parseFloat(NationalGuaranteeAmount);
          }
          if (x['[Project IDA Financing National Short Maturity $]']) {
            const NationalShortMaturityAmount = x['[Project IDA Financing National Short Maturity $]'].replace(/[^.\d]/g, '');
            Data.Grand_NationalSML += parseFloat(NationalShortMaturityAmount);
          }
          if (x['[Project IDA Financing Regional Total $]']) {
            const RegionalTotalAmount = x['[Project IDA Financing Regional Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_RegionalTotal += parseFloat(RegionalTotalAmount);
          }
          if (x['[Project IDA Financing Regional Credit $]']) {
            const RegionalCreditAmount = x['[Project IDA Financing Regional Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_RegionalCredit += parseFloat(RegionalCreditAmount);
          }
          if (x['[Project IDA Financing Regional Grant $]']) {
            const RegionalGrantAmount = x['[Project IDA Financing Regional Grant $]'].replace(/[^.\d]/g, '');
            Data.Grand_RegionalGrant += parseFloat(RegionalGrantAmount);
          }
          if (x['[Project IDA Financing Regional Guarantee $]']) {
            const RegionalGuaranteeAmount = x['[Project IDA Financing Regional Guarantee $]'].replace(/[^.\d]/g, '');
            Data.Grand_RegionalGuarantee += parseFloat(RegionalGuaranteeAmount);
          }
          if (x['[Project IDA Financing Refugee Total $]']) {
            const RefugeeTotalAmount = x['[Project IDA Financing Refugee Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_RefugeeTotal += parseFloat(RefugeeTotalAmount);
          }
          if (x['[Project IDA Financing Refugee Credit $]']) {
            const RefugeeCreditAmount = x['[Project IDA Financing Refugee Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_RefugeeCredit += parseFloat(RefugeeCreditAmount);
          }
          if (x['[Project IDA Financing Refugee Grant $]']) {
            const RefugeeGrantAmount = x['[Project IDA Financing Refugee Grant $]'].replace(/[^.\d]/g, '');
            Data.Grand_RefugeeGrant += parseFloat(RefugeeGrantAmount);
          }
          if (x['[Project IDA Financing CRW Total $]']) {
            const CRWTotalAmount = x['[Project IDA Financing CRW Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_CRWTotal += parseFloat(CRWTotalAmount);
          }
          if (x['[Project IDA Financing CRW Credit $]']) {
            const CRWCreditAmount = x['[Project IDA Financing CRW Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_CRWCredit += parseFloat(CRWCreditAmount);
          }
          if (x['[Project IDA Financing CRW Grant $]']) {
            const CRWGrantAmount = x['[Project IDA Financing CRW Grant $]'].replace(/[^.\d]/g, '');
            Data.Grand_CRWGrant += parseFloat(CRWGrantAmount);
          }
          if (x['[Project IDA Financing SUF Total $]']) {
            const SUFTotalAmount = x['[Project IDA Financing SUF Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_SUW += parseFloat(SUFTotalAmount);
          }
          if (x['[Project IDA Financing SUF Credit $]']) {
            const SUFCreditAmount = x['[Project IDA Financing SUF Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_SUWRegular += parseFloat(SUFCreditAmount);
          }
          if (x['[Project IDA Financing SUF Short Maturity $]']) {
            const SUFShortMaturityAmount = x['[Project IDA Financing SUF Short Maturity $]'].replace(/[^.\d]/g, '');
            Data.Grand_SUWSML += parseFloat(SUFShortMaturityAmount);
          }
          if (x['[Project IDA Financing Transitional Total $]']) {
            const TransitionalTotalAmount = x['[Project IDA Financing Transitional Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_TransitionalTotal += parseFloat(TransitionalTotalAmount);
          }
          if (x['[Project IDA Financing Transitional Credit $]']) {
            const TransitionalCreditAmount = x['[Project IDA Financing Transitional Credit $]'].replace(/[^.\d]/g, '');
            Data.Grand_TransitionalCredit += parseFloat(TransitionalCreditAmount);
          }
        });
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACredit = '$' + (Math.round(Data.Grand_IDACredit * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDAGrant = '$' + (Math.round(Data.Grand_IDAGrant * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDAGuarantee = '$' + (Math.round(Data.Grand_IDAGuarantee * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDASML = '$' + (Math.round(Data.Grand_IDASML * 100) / 100).toFixed(2) + 'M';
        Data.Grand_NationalTotal = (Math.round(Data.Grand_NationalTotal * 100) / 100).toFixed(2) + 'M';
        Data.Grand_NationalCredit = (Math.round(Data.Grand_NationalCredit * 100) / 100).toFixed(2) + 'M';
        Data.Grand_NationalGrant = (Math.round(Data.Grand_NationalGrant * 100) / 100).toFixed(2) + 'M';
        Data.Grand_NationalGuarantee = '$' + (Math.round(Data.Grand_NationalGuarantee * 100) / 100).toFixed(2) + 'M';
        Data.Grand_NationalSML = '$' + (Math.round(Data.Grand_NationalSML * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RegionalTotal = (Math.round(Data.Grand_RegionalTotal * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RegionalGrant = (Math.round(Data.Grand_RegionalGrant * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RegionalCredit = (Math.round(Data.Grand_RegionalCredit * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RegionalGuarantee = '$' + (Math.round(Data.Grand_RegionalGuarantee * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RefugeeTotal = (Math.round(Data.Grand_RefugeeTotal * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RefugeeGrant = (Math.round(Data.Grand_RefugeeGrant * 100) / 100).toFixed(2) + 'M';
        Data.Grand_RefugeeCredit = (Math.round(Data.Grand_RefugeeCredit * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CRWTotal = (Math.round(Data.Grand_CRWTotal * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CRWGrant = (Math.round(Data.Grand_CRWGrant * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CRWCredit = (Math.round(Data.Grand_CRWCredit * 100) / 100).toFixed(2) + 'M';
        Data.Grand_SUW = (Math.round(Data.Grand_SUW * 100) / 100).toFixed(2) + 'M';
        Data.Grand_SUWRegular = (Math.round(Data.Grand_SUWRegular * 100) / 100).toFixed(2) + 'M';
        Data.Grand_SUWSML = '$' + (Math.round(Data.Grand_SUWSML * 100) / 100).toFixed(2) + 'M';
        Data.Grand_TransitionalTotal = (Math.round(Data.Grand_TransitionalTotal * 100) / 100).toFixed(2) + 'M';
        Data.Grand_TransitionalCredit = (Math.round(Data.Grand_TransitionalCredit * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Code]': 'Total', '[Lending Total Commitment $]': Data.Grand_TotalCommitment, 'Project[Project Id]': '',
          '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment, '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment,
          '[Lending PE Cofinance $]': Data.Grand_Cofinance, '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment,
          '[Project IDA Financing IDA Credit $]': Data.Grand_IDACredit, '[Project IDA Financing IDA Grant $]': Data.Grand_IDAGrant,
          '[Project IDA Financing IDA Guarantee $]': Data.Grand_IDAGuarantee, '[Project IDA Financing IDA Short Maturity $]': Data.Grand_IDASML,
          '[Project IDA Financing National Total $]': Data.Grand_NationalTotal, '[Project IDA Financing National Credit $]': Data.Grand_NationalCredit,
          '[Project IDA Financing National Grant $]': Data.Grand_NationalGrant, '[Project IDA Financing National Guarantee $]': Data.Grand_NationalGuarantee,
          '[Project IDA Financing National Short Maturity $]': Data.Grand_NationalSML, '[Project IDA Financing Regional Total $]': Data.Grand_RegionalTotal,
          '[Project IDA Financing Regional Credit $]': Data.Grand_RegionalCredit, '[Project IDA Financing Regional Grant $]': Data.Grand_RegionalGrant,
          '[Project IDA Financing Regional Guarantee $]': Data.Grand_RegionalGuarantee, '[Project IDA Financing Refugee Total $]': Data.Grand_RefugeeTotal,
          '[Project IDA Financing Refugee Credit $]': Data.Grand_RefugeeCredit, '[Project IDA Financing Refugee Grant $]': Data.Grand_RefugeeGrant,
          '[Project IDA Financing CRW Total $]': Data.Grand_CRWTotal, '[Project IDA Financing CRW Credit $]': Data.Grand_CRWCredit,
          '[Project IDA Financing CRW Grant $]': Data.Grand_CRWGrant, '[Project IDA Financing SUF Total $]': Data.Grand_SUW,
          '[Project IDA Financing SUF Credit $]': Data.Grand_SUWRegular, '[Project IDA Financing SUF Short Maturity $]': Data.Grand_SUWSML,
          '[Project IDA Financing Transitional Total $]': Data.Grand_TransitionalTotal, '[Project IDA Financing Transitional Credit $]': Data.Grand_TransitionalCredit,
          '[Lending Project #]': Data.Grand_ProjectCount
        }
      ]);
    } else if (selectedReport === 'L12.1') {
      if (flag === '2') {
        Data.Grand_ReionalCeiling = 0; Data.Grand_Disbursement = 0; Data.Grand_Undisbursement = 0;
        Data.Grand_Commitment = 0; Data.Grand_Repayment = 0; Data.Grand_AvailableCommitment = 0;
        Data.Grand_LoanPPF = 0;
        Data.forEach(x => {
          if (x['[Regional Ceiling]']) {
            const RegionalCeiling = x['[Regional Ceiling]'].replace(/[^.\d]/g, '');
            Data.Grand_ReionalCeiling += parseFloat(RegionalCeiling);
          }
          if (x['[Commitment]']) {
            const Commitment = x['[Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_Commitment += parseFloat(Commitment);
          }
          if (x['[Undisbursement]']) {
            const Undisbursement = x['[Undisbursement]'].replace(/[^.\d]/g, '');
            Data.Grand_Undisbursement += parseFloat(Undisbursement);
          }
          if (x['[Disbursement]']) {
            const Disbursement = x['[Disbursement]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursement += parseFloat(Disbursement);
          }
          if (x['[Repayment]']) {
            const Repayment = x['[Repayment]'].replace(/[^.\d]/g, '');
            Data.Grand_Repayment += parseFloat(Repayment);
          }
          if (x['[Available for Commitment Amount]']) {
            const AvailableCommitment = x['[Available for Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_AvailableCommitment += parseFloat(AvailableCommitment);
          }
          if (x['[Loan PPF Active Project Past Closing Date Count]']) {
            Data.Grand_LoanPPF += parseFloat(x['[Loan PPF Active Project Past Closing Date Count]']);
          }
        });
        Data.Grand_ReionalCeiling = '$' + (Math.round(Data.Grand_ReionalCeiling * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Commitment = '$' + (Math.round(Data.Grand_Commitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Disbursement = '$' + (Math.round(Data.Grand_Disbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Undisbursement = '$' + (Math.round(Data.Grand_Undisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Repayment = '$' + (Math.round(Data.Grand_Repayment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_AvailableCommitment = '$' + (Math.round(Data.Grand_AvailableCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_LoanPPF = Data.Grand_LoanPPF;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Loan PPF Regional Ceiling[PPF Regional Ceiling Name]': 'Total', '[Regional Ceiling]': Data.Grand_ReionalCeiling,
          '[Commitment]': Data.Grand_Commitment, '[Disbursement]': Data.Grand_Disbursement, '[Undisbursement]': Data.Grand_Undisbursement,
          '[Repayment]': Data.Grand_Repayment, '[Available for Commitment Amount]': Data.Grand_AvailableCommitment,
          '[Loan PPF Active Project Past Closing Date Count]': Data.Grand_LoanPPF
        }
      ]);
    } else if (selectedReport === 'L12.2') {
      if (flag === '2') {
        Data.Grand_Commitment = 0; Data.Grand_Disbursement = 0; Data.Grand_Undisbursement = 0;
        Data.Grand_Ages = 0; Data.Grand_AccruedCharge = 0;
        Data.forEach(x => {
          if (x['[Loan PPF Commitment Amount]']) {
            const Commitment = x['[Loan PPF Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Commitment += parseFloat(Commitment);
          }
          if (x['[Loan PPF Disbursement Amount]']) {
            const Disbursement = x['[Loan PPF Disbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursement += parseFloat(Disbursement);
          }
          if (x['[Loan PPF Undisbursement Amount]']) {
            const Undisbursement = x['[Loan PPF Undisbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Undisbursement += parseFloat(Undisbursement);
          }
          if (x['[Loan PPF Accrued Charge Amount]']) {
            const Accrued = x['[Loan PPF Accrued Charge Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_AccruedCharge += parseFloat(Accrued);
          }
          if (x['[Loan PPF Average Ages (Months)]']) {
            Data.Grand_Ages += x['[Loan PPF Average Ages (Months)]'];
          }
        });
        Data.Grand_Commitment = '$' + (Math.round(Data.Grand_Commitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Disbursement = '$' + (Math.round(Data.Grand_Disbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Undisbursement = '$' + (Math.round(Data.Grand_Undisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_AccruedCharge = '$' + (Math.round(Data.Grand_AccruedCharge * 100) / 100).toFixed(2);
        Data.Grand_Ages = Data.Grand_Ages;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Name]': 'Total', '[Loan PPF Commitment Amount]': Data.Grand_Commitment,
          '[Loan PPF Disbursement Amount]': Data.Grand_Disbursement, '[Loan PPF Undisbursement Amount]': Data.Grand_Undisbursement,
          '[Loan PPF Accrued Charge Amount]': Data.Grand_AccruedCharge, '[Loan PPF Average Ages (Months)]': Data.Grand_Ages
        }
      ]);
    } else if (selectedReport === 'L12.3') {
      if (flag === '2') {
        Data.Grand_Commitment = 0; Data.Grand_Disbursement = 0; Data.Grand_Undisbursement = 0;
        Data.Grand_Ages = 0; Data.Grand_AccruedCharge = 0;
        Data.forEach(x => {
          if (x['[Loan PPF Commitment Amount]']) {
            const Commitment = x['[Loan PPF Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Commitment += parseFloat(Commitment);
          }
          if (x['[Loan PPF Disbursement Amount]']) {
            const Disbursement = x['[Loan PPF Disbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursement += parseFloat(Disbursement);
          }
          if (x['[Loan PPF Undisbursement Amount]']) {
            const Undisbursement = x['[Loan PPF Undisbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Undisbursement += parseFloat(Undisbursement);
          }
          if (x['[Loan PPF Accrued Charge Amount]']) {
            const Accrued = x['[Loan PPF Accrued Charge Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_AccruedCharge += parseFloat(Accrued);
          }
          if (x['[Loan PPF Average Ages (Months)]']) {
            Data.Grand_Ages += parseFloat(x['[Loan PPF Average Ages (Months)]']);
          }
        });
        Data.Grand_Commitment = '$' + (Math.round(Data.Grand_Commitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Disbursement = '$' + (Math.round(Data.Grand_Disbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Undisbursement = '$' + (Math.round(Data.Grand_Undisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_AccruedCharge = '$' + (Math.round(Data.Grand_AccruedCharge * 100) / 100).toFixed(2);
        Data.Grand_Ages = Data.Grand_Ages;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Name]': 'Total', '[Loan PPF Commitment Amount]': Data.Grand_Commitment,
          '[Loan PPF Disbursement Amount]': Data.Grand_Disbursement, '[Loan PPF Undisbursement Amount]': Data.Grand_Undisbursement,
          '[Loan PPF Accrued Charge Amount]': Data.Grand_AccruedCharge, '[Loan PPF Average Ages (Months)]': Data.Grand_Ages
        }
      ]);
    } else if (selectedReport === 'L14.1') {
      if (flag === '2') {
        Data.Grand_PhaseNo = 0; Data.Grand_TotalNoPhases = 0; Data.Grand_ProjectCount = 0;
        Data.Grand_TotalProgramCommitment = 0; Data.Grand_IBRDProgramCommitment = 0;
        Data.Grand_IDAProgramCommitment = 0; Data.Grand_OtherProgramCommitment = 0; Data.Grand_TotalCommitment = 0;
        Data.Grand_IBRDCommitment = 0; Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0;
        Data.Grand_FYExpense = 0; Data.Grand_CumExpense = 0; Data.Grand_Ages = 0;
        Data.forEach(x => {
          if (x['[Total_Program_Commitment]']) {
            const TotalProgramCommitmentAmount = x['[Total_Program_Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalProgramCommitment += parseFloat(TotalProgramCommitmentAmount);
          }
          if (x['[IBRD_Program_Commitment]']) {
            const IBRDProgramCommitmentAmount = x['[IBRD_Program_Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDProgramCommitment += parseFloat(IBRDProgramCommitmentAmount);
          }
          if (x['[IDA_Program_Commitment]']) {
            const IDAProgramCommitmentAmount = x['[IDA_Program_Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_IDAProgramCommitment += parseFloat(IDAProgramCommitmentAmount);
          }
          if (x['[Other_Program_Commitment]']) {
            const OtherProgramCommitmentAmount = x['[Other_Program_Commitment]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherProgramCommitment += parseFloat(OtherProgramCommitmentAmount);
          }
          if (x['[Total Commitment $]']) {
            const LendingTotalCommitment = x['[Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(LendingTotalCommitment);
          }
          if (x['[IBRD Total Commitment $]']) {
            const LendingIBRDTotalCommitment = x['[IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(LendingIBRDTotalCommitment);
          }
          if (x['[IDA Total Commitment $]']) {
            const LendingIDATotalCommitment = x['[IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(LendingIDATotalCommitment);
          }
          if (x['[Others Total Commitment $]']) {
            const LendingOthersTotalCommitment = x['[Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(LendingOthersTotalCommitment);
          }
          if (x['[Current FY Expense]']) {
            const FYExpense = x['[Current FY Expense]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpense += parseFloat(FYExpense);
          }
          if (x['[Cumulative Expenses]']) {
            const FYExpense = x['[Cumulative Expenses]'].replace(/[^.\d]/g, '');
            Data.Grand_CumExpense += parseFloat(FYExpense);
          }
          if (x['Associate Project[Phase No.]']) {
            x.PhaseNo = x['Associate Project[Phase No.]'];
            Data.Grand_PhaseNo += parseFloat(x['Associate Project[Phase No.]']);
          }
          if (x['Associate Project[No. of Phases]']) {
            x.NoOfPhases = x['Associate Project[No. of Phases]'];
            Data.Grand_TotalNoPhases += parseFloat(x['Associate Project[No. of Phases]']);
          }
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += parseFloat(x['[Lending Project #]']);
          }
          if (x['[Age__Months]']) {
            Data.Grand_Ages += parseFloat(x['[Age__Months]']);
          }
        });
        Data.Grand_TotalProgramCommitment = '$' + (Math.round(Data.Grand_TotalProgramCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDProgramCommitment = '$' + (Math.round(Data.Grand_IBRDProgramCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDAProgramCommitment = '$' + (Math.round(Data.Grand_IDAProgramCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherProgramCommitment = '$' + (Math.round(Data.Grand_OtherProgramCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_FYExpense = '$' + (Math.round(Data.Grand_FYExpense * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumExpense = '$' + (Math.round(Data.Grand_CumExpense * 100) / 100).toFixed(2) + 'K';
        Data.Grand_PhaseNo = Data.Grand_PhaseNo;
        Data.Grand_TotalNoPhases = Data.Grand_TotalNoPhases;
        Data.Grand_ProjectCount = Data.Grand_ProjectCount;
        Data.Grand_Ages = Data.Grand_Ages;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Associate Project[Associated Project Id]': 'Total', '[Total_Program_Commitment]': Data.Grand_TotalProgramCommitment,
          '[IBRD_Program_Commitment]': Data.Grand_IBRDProgramCommitment, '[IDA_Program_Commitment]': Data.Grand_IDAProgramCommitment,
          '[Other_Program_Commitment]': Data.Grand_OtherProgramCommitment, '[Total Commitment $]': Data.Grand_TotalCommitment,
          '[IBRD Total Commitment $]': Data.Grand_IBRDCommitment, '[IDA Total Commitment $]': Data.Grand_IDACommitment,
          '[Others Total Commitment $]': Data.Grand_OtherCommitment, '[Current FY Expense]': Data.Grand_FYExpense,
          '[Cumulative Expenses]': Data.Grand_CumExpense, 'PhaseNo': Data.Grand_PhaseNo,
          'NoOfPhases': Data.Grand_TotalNoPhases, '[Lending Project #]': Data.Grand_ProjectCount,
          '[Age__Months]': Data.Grand_Ages, 'Project[Board Schedule Status]': 'Board Approved', 'Project[Project Id]': ''
        }
      ]);
    } else if (selectedReport === 'P1.3d') {
      if (flag === '2') {
        Data.Grand_NetCommitment = 0; Data.Grand_Undisbursement = 0; Data.Grand_Months = 0;
        Data.Grand_ActionsTaken = 0; Data.Grand_DOIPUpgrade = 0; Data.Grand_Restructuring = 0;
        Data.Grand_Suspension = 0; Data.Grand_Closed = 0; Data.Grand_Cancelled = 0;
        Data.forEach(x => {
          if (x['[Portfolio Total Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio Total Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_NetCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Undisbursed Balance $]']) {
            const UndisbursedBalance = x['[Portfolio Total Undisbursed Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_Undisbursement += parseFloat(UndisbursedBalance);
          }
          if (x['[Portfolio In Problem Status (Months)]']) {
            Data.Grand_Months += parseFloat(x['[Portfolio In Problem Status (Months)]']);
          }
          if (x['[Proactivity Project With 12 Month Proactivity Action #]']) {
            Data.Grand_ActionsTaken += parseFloat(x['[Proactivity Project With 12 Month Proactivity Action #]']);
          }
          if (x['[Proactivity FY IPDO Upgraded #]']) {
            Data.Grand_DOIPUpgrade += parseFloat(x['[Proactivity FY IPDO Upgraded #]']);
          }
          if (x['[Proactivity FY Restructured #]']) {
            Data.Grand_Restructuring += parseFloat(x['[Proactivity FY Restructured #]']);
          }
          if (x['[Proactivity FY Suspended #]']) {
            Data.Grand_Suspension += parseFloat(x['[Proactivity FY Suspended #]']);
          }
          if (x['[Proactivity FY Closed #]']) {
            Data.Grand_Closed += parseFloat(x['[Proactivity FY Closed #]']);
          }
          if (x['[Proactivity FY Partial Cancelled #]']) {
            Data.Grand_Cancelled += parseFloat(x['[Proactivity FY Partial Cancelled #]']);
          }
        });
        Data.Grand_NetCommitment = '$' + (Math.round(Data.Grand_NetCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Undisbursement = '$' + (Math.round(Data.Grand_Undisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Months = Data.Grand_Months.toFixed(2);
        Data.Grand_ActionsTaken = Data.Grand_ActionsTaken;
        Data.Grand_DOIPUpgrade = Data.Grand_DOIPUpgrade;
        Data.Grand_Restructuring = Data.Grand_Restructuring;
        Data.Grand_Suspension = Data.Grand_Suspension;
        Data.Grand_Closed = Data.Grand_Closed;
        Data.Grand_Cancelled = Data.Grand_Cancelled;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Portfolio Total Net Commitment $]': Data.Grand_NetCommitment,
          '[Portfolio Total Undisbursed Balance $]': Data.Grand_Undisbursement, '[Portfolio In Problem Status (Months)]': Data.Grand_Months,
          '[Proactivity Project With 12 Month Proactivity Action #]': Data.Grand_ActionsTaken, '[Proactivity FY IPDO Upgraded #]': Data.Grand_DOIPUpgrade,
          '[Proactivity FY Restructured #]': Data.Grand_Restructuring, '[Proactivity FY Suspended #]': Data.Grand_Suspension,
          '[Proactivity FY Closed #]': Data.Grand_Closed, '[Proactivity FY Partial Cancelled #]': Data.Grand_Cancelled
        }
      ]);
    } else if (selectedReport === 'P1.5b') {
      if (flag === '2') {
        Data.Grand_NetCommitment = 0; Data.Grand_Disbursements = 0;
        Data.forEach(x => {
          if (x['[Portfolio Total Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio Total Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_NetCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Disbursement $]']) {
            const TotalCommitment = x['[Portfolio Total Disbursement $]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursements += parseFloat(TotalCommitment);
          }
        });
        Data.Grand_NetCommitment = '$' + (Math.round(Data.Grand_NetCommitment * 100) / 100).toFixed(2) + 'B';
        Data.Grand_Disbursements = '$' + (Math.round(Data.Grand_Disbursements * 100) / 100).toFixed(2) + 'B';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Portfolio[ICR Due Indicator]': 'Total',
          'Project[Project Id]': '',
          '[Portfolio Total Net Commitment $]': Data.Grand_NetCommitment,
          '[Portfolio Total Disbursement $]': Data.Grand_Disbursements
        }
      ]);
    } else if (selectedReport === 'P1.6') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_DisbursementDelay = 0; Data.Grand_TotalCommitment = 0;
        Data.Grand_IBRDCommitment = 0; Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0;
        Data.Grand_CummulativeDisbursement = 0; Data.Grand_UndisbursementBalance = 0; Data.Grand_TotalCancellation = 0;
        Data.Grand_UndisbursementPercent = 0; Data.Grand_DisbursementFY = 0; Data.Grand_Cofinance = 0;
        Data.Grand_CofinanceDisbursement = 0; Data.Grand_UndisbursementFY = 0;
        Data.forEach(x => {
          if (x['[Lending Project #]']) {
            Data.Grand_ProjectCount += parseFloat(x['[Lending Project #]']);
          }
          if (x['[Lending Total Commitment $]']) {
            const TotalCommitment = x['[Lending Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IBRD Total Commitment $]']) {
            const TotalCommitment = x['[Lending IBRD Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending IDA Total Commitment $]']) {
            const TotalCommitment = x['[Lending IDA Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(TotalCommitment);
          }
          if (x['[Lending Others Total Commitment $]']) {
            const TotalCommitment = x['[Lending Others Total Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Disbursement $]']) {
            const TotalCommitment = x['[Portfolio Total Disbursement $]'].replace(/[^.\d]/g, '');
            Data.Grand_CummulativeDisbursement += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Undisbursed Balance $]']) {
            const TotalCommitment = x['[Portfolio Total Undisbursed Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_UndisbursementBalance += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Cancellation $]']) {
            const TotalCommitment = x['[Portfolio Total Cancellation $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalCancellation += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Cofinancing Total Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio Cofinancing Total Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Cofinancing Total Disbursement $]']) {
            const TotalCommitment = x['[Portfolio Cofinancing Total Disbursement $]'].replace(/[^.\d]/g, '');
            Data.Grand_CofinanceDisbursement += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Undisbursed %]']) {
            const Commitment = x['[Portfolio Total Undisbursed %]'].replace(/[^.\d]/g, '');
            Data.Grand_UndisbursementPercent += parseFloat(Commitment);
          }
          if (x['[Portfolio Disbursement FY $]']) {
            const TotalCommitment = x['[Portfolio Disbursement FY $]'].replace(/[^.\d]/g, '');
            Data.Grand_DisbursementFY += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Begin FY Undisbursed Balance $]']) {
            const TotalCommitment = x['[Portfolio Total Begin FY Undisbursed Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_UndisbursementFY += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Effectiveness to Disbursement Lag]']) {
            const Disbursement = x['[Portfolio Effectiveness to Disbursement Lag]'].replace(/[^.\d]/g, '');
            Data.Grand_DisbursementDelay += parseFloat(Disbursement);
          }
        });
        Data.Grand_ProjectCount = Data.Grand_ProjectCount;
        Data.Grand_DisbursementDelay = (Data.Grand_DisbursementDelay).toFixed(1);
        Data.Grand_TotalCommitment = '$' + (Math.round(Data.Grand_TotalCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CummulativeDisbursement = '$' + (Math.round(Data.Grand_CummulativeDisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_UndisbursementBalance = '$' + (Math.round(Data.Grand_UndisbursementBalance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_TotalCancellation = '$' + (Math.round(Data.Grand_TotalCancellation * 100) / 100).toFixed(2) + 'M';
        Data.Grand_UndisbursementPercent = (Data.Grand_UndisbursementPercent).toFixed(1) + '%';
        Data.Grand_DisbursementFY = '$' + (Math.round(Data.Grand_DisbursementFY * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CofinanceDisbursement = '$' + (Math.round(Data.Grand_CofinanceDisbursement * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Project #]': Data.Grand_ProjectCount, '[Portfolio Total Net Commitment $]': Data.Grand_ProjectCount,
          '[Portfolio Effectiveness to Disbursement Lag]': Data.Grand_DisbursementDelay, '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment, '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment,
          '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment, '[Portfolio Total Disbursement $]': Data.Grand_CummulativeDisbursement,
          '[Portfolio Total Undisbursed Balance $]': Data.Grand_UndisbursementBalance, '[Portfolio Total Cancellation $]': Data.Grand_TotalCancellation,
          '[Portfolio Cofinancing Total Net Commitment $]': Data.Grand_Cofinance, '[Portfolio Cofinancing Total Disbursement $]': Data.Grand_CofinanceDisbursement,
          '[Portfolio Total Undisbursed %]': Data.Grand_UndisbursementPercent, '[Portfolio Disbursement FY $]': Data.Grand_DisbursementFY,
          '[Portfolio Total Begin FY Undisbursed Balance $]': Data.Grand_UndisbursementFY
        }
      ]);
    } else if (selectedReport === 'P5.6') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_EffectDisbursement = 0; Data.Grand_TotalNetCommitment = 0;
        Data.Grand_IBRDCommitment = 0; Data.Grand_IDACommitment = 0; Data.Grand_OtherCommitment = 0;
        Data.Grand_CumDisbursements = 0; Data.Grand_Undisbursement = 0; Data.Grand_Cancellation = 0;
        Data.Grand_FYUndisbusement = 0; Data.Grand_FYDisbursement = 0; Data.Grand_Cofinance = 0;
        Data.Grand_CofinanceDisb = 0; Data.Grand_PotentialProblem = 0; Data.Grand_CommitmentatRisk = 0;
        Data.forEach(x => {
          if (x['[Portfolio Project #]']) {
            Data.Grand_ProjectCount += parseFloat(x['[Portfolio Project #]']);
          }
          if (x['Portfolio[Potential Problem Project Indicator]']) {
            Data.Grand_PotentialProblem += parseFloat(x['Portfolio[Potential Problem Project Indicator]']);
          }
          if (x['[Portfolio Effectiveness to Disbursement Lag]']) {
            Data.Grand_EffectDisbursement += parseFloat(x['[Portfolio Effectiveness to Disbursement Lag]']);
          }
          if (x['[Portfolio Total Net Commitment Amount]']) {
            const TotalCommitment = x['[Portfolio Total Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalNetCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Commitment at Risk $]']) {
            const TotalCommitment = x['[Portfolio Commitment at Risk $]'].replace(/[^.\d]/g, '');
            Data.Grand_CommitmentatRisk += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio IBRD Net Commitment Amount]']) {
            const TotalCommitment = x['[Portfolio IBRD Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio IDA Net Commitment Amount]']) {
            const TotalCommitment = x['[Portfolio IDA Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Others Net Commitment Amount]']) {
            const TotalCommitment = x['[Portfolio Others Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Disbursement Amount]']) {
            const TotalCommitment = x['[Portfolio Total Disbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_CumDisbursements += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Undisbursed Balance Amount]']) {
            const TotalCommitment = x['[Portfolio Total Undisbursed Balance Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Undisbursement += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Cancellation Amount]']) {
            const TotalCommitment = x['[Portfolio Total Cancellation Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Cancellation += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Begin FY Undisbursed Balance Amount]']) {
            const TotalCommitment = x['[Portfolio Total Begin FY Undisbursed Balance Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_FYUndisbusement += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Disbursement FY Amount]']) {
            const TotalCommitment = x['[Portfolio Disbursement FY Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_FYDisbursement += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Cofinancing Total Net Commitment Amount]']) {
            const TotalCommitment = x['[Portfolio Cofinancing Total Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Cofinancing Total Disbursement Amount]']) {
            const TotalCommitment = x['[Portfolio Cofinancing Total Disbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_CofinanceDisb += parseFloat(TotalCommitment);
          }
        });
        Data.Grand_ProjectCount = Data.Grand_ProjectCount;
        Data.Grand_PotentialProblem = Data.Grand_PotentialProblem;
        Data.Grand_EffectDisbursement = (Data.Grand_EffectDisbursement).toFixed(1);
        Data.Grand_TotalNetCommitment = '$' + (Math.round(Data.Grand_TotalNetCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CumDisbursements = '$' + (Math.round(Data.Grand_CumDisbursements * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Undisbursement = '$' + (Math.round(Data.Grand_Undisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cancellation = '$' + (Math.round(Data.Grand_Cancellation * 100) / 100).toFixed(2) + 'M';
        Data.Grand_FYUndisbusement = '$' + (Math.round(Data.Grand_FYUndisbusement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_FYDisbursement = '$' + (Math.round(Data.Grand_FYDisbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CofinanceDisb = '$' + (Math.round(Data.Grand_CofinanceDisb * 100) / 100).toFixed(2) + 'M';
        Data.Grand_CommitmentatRisk = '$' + (Math.round(Data.Grand_CofinanceDisb * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Portfolio Effectiveness to Disbursement Lag]': Data.Grand_EffectDisbursement,
          '[Portfolio Total Net Commitment Amount]': Data.Grand_TotalNetCommitment, '[Portfolio IBRD Net Commitment Amount]': Data.Grand_IBRDCommitment,
          '[Portfolio IDA Net Commitment Amount]': Data.Grand_IDACommitment, '[Portfolio Others Net Commitment Amount]': Data.Grand_OtherCommitment,
          '[Portfolio Total Disbursement Amount]': Data.Grand_CumDisbursements, '[Portfolio Total Undisbursed Balance Amount]': Data.Grand_Undisbursement,
          '[Portfolio Total Cancellation Amount]': Data.Grand_Cancellation, '[Portfolio Total Begin FY Undisbursed Balance Amount]': Data.Grand_FYUndisbusement,
          '[Portfolio Disbursement FY Amount]': Data.Grand_FYDisbursement, '[Portfolio Cofinancing Total Net Commitment Amount]': Data.Grand_Cofinance,
          '[Portfolio Cofinancing Total Disbursement Amount]': Data.Grand_CofinanceDisb, '[Portfolio Project #]': Data.Grand_ProjectCount,
          'Portfolio[Potential Problem Project Indicator]': Data.Grand_PotentialProblem, '[Portfolio Commitment at Risk $]': Data.Grand_CommitmentatRisk
        }
      ]);
    } else if (selectedReport === 'P5.7') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_TotalNetCommitment = 0;
        Data.Grand_IBRDCommitment = 0; Data.Grand_IDACommitment = 0;
        Data.Grand_OtherCommitment = 0; Data.Grand_Cofinance = 0;
        Data.forEach(x => {
          if (x['[Portfolio Project #]']) {
            Data.Grand_ProjectCount += parseFloat(x['[Portfolio Project #]']);
          }
          if (x['[Portfolio_Total_Net_Commitment__]']) {
            const TotalCommitment = x['[Portfolio_Total_Net_Commitment__]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalNetCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio_IBRD_Net_Commitment__]']) {
            const TotalCommitment = x['[Portfolio_IBRD_Net_Commitment__]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio_IDA_Net_Commitment__]']) {
            const TotalCommitment = x['[Portfolio_IDA_Net_Commitment__]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio_Others_Net_Commitment__]']) {
            const TotalCommitment = x['[Portfolio_Others_Net_Commitment__]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio_Cofinancing_Total_Net_Commitment__]']) {
            const TotalCommitment = x['[Portfolio_Cofinancing_Total_Net_Commitment__]'].replace(/[^.\d]/g, '');
            Data.Grand_Cofinance += parseFloat(TotalCommitment);
          }
        });
        Data.Grand_ProjectCount = Data.Grand_ProjectCount;
        Data.Grand_TotalNetCommitment = '$' + (Math.round(Data.Grand_TotalNetCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cofinance = '$' + (Math.round(Data.Grand_Cofinance * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[Portfolio_Total_Net_Commitment__]': Data.Grand_TotalNetCommitment, '[Portfolio_IBRD_Net_Commitment__]': Data.Grand_IBRDCommitment,
          '[Portfolio_IDA_Net_Commitment__]': Data.Grand_IDACommitment, '[Portfolio_Others_Net_Commitment__]': Data.Grand_OtherCommitment,
          '[Portfolio_Cofinancing_Total_Net_Commitment__]': Data.Grand_Cofinance, '[Portfolio Project #]': Data.Grand_ProjectCount
        }
      ]);
    } else if (selectedReport === 'P5.8') {
      if (flag === '2') {
        Data.Grand_TotalNetCommitment = 0; Data.Grand_IBRDCommitment = 0; Data.Grand_IDACommitment = 0;
        Data.Grand_OtherCommitment = 0; Data.Grand_Disbursement = 0; Data.Grand_ProjectExitFY = 0;
        Data.Grand_EvaluatedIEG = 0; let Grand_EvaluatedIEGRatings = 0;
        Data.forEach(x => {
          if (x['[Portfolio Total Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio Total Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalNetCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio IBRD Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio IBRD Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IBRDCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio IDA Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio IDA Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_IDACommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Others Net Commitment $]']) {
            const TotalCommitment = x['[Portfolio Others Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_OtherCommitment += parseFloat(TotalCommitment);
          }
          if (x['[Portfolio Total Disbursement $]']) {
            const TotalCommitment = x['[Portfolio Total Disbursement $]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursement += parseFloat(TotalCommitment);
          }
          if (x['[IEG Ratings Project Exit FY #]']) {
            Data.Grand_ProjectExitFY += parseFloat(x['[IEG Ratings Project Exit FY #]']);
          }
          if (x['IEG Ratings[IEG Outcome Evaluated Exit FY]']) {
            Data.Grand_EvaluatedIEG += parseFloat(x['IEG Ratings[IEG Outcome Evaluated Exit FY]']);
          }
          if (x['[IEG Ratings IEG Outcome Evaluated Exit FY #]'] !== null && x['[IEG Ratings IEG Outcome Evaluated Exit FY #]'] !== '') {
            // tslint:disable-next-line:radix
            Grand_EvaluatedIEGRatings += parseInt(x['[IEG Ratings IEG Outcome Evaluated Exit FY #]']);
          }
        });
        Data.Grand_TotalNetCommitment = '$' + (Math.round(Data.Grand_TotalNetCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IBRDCommitment = '$' + (Math.round(Data.Grand_IBRDCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_IDACommitment = '$' + (Math.round(Data.Grand_IDACommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_OtherCommitment = '$' + (Math.round(Data.Grand_OtherCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Disbursement = '$' + (Math.round(Data.Grand_Disbursement * 100) / 100).toFixed(2) + 'M';
        Data.Grand_ProjectExitFY = (Data.Grand_ProjectExitFY);
        Data.Grand_EvaluatedIEG = (Data.Grand_EvaluatedIEG);
        Data.Grand_EvaluatedIEGRatings = Data.Grand_EvaluatedIEGRatings;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Portfolio Total Net Commitment $]': Data.Grand_TotalNetCommitment,
          '[Portfolio IBRD Net Commitment $]': Data.Grand_IBRDCommitment, '[Portfolio IDA Net Commitment $]': Data.Grand_IDACommitment,
          '[Portfolio Others Net Commitment $]': Data.Grand_OtherCommitment, '[Portfolio Total Disbursement $]': Data.Grand_Disbursement,
          '[IEG Ratings Project Exit FY #]': Data.Grand_ProjectExitFY, 'IEG Ratings[IEG Outcome Evaluated Exit FY]': Data.Grand_EvaluatedIEG,
          '[IEG Ratings IEG Outcome Evaluated Exit FY #]': Data.Grand_EvaluatedIEGRatings
        }
      ]);
    } else if (selectedReport === 'P5.9') {
      if (flag === '2') {
        Data.Grand_TotalNetCommitment = 0;
        Data.forEach(data => {
          if (data['[Portfolio Total Net Commitment $]']) {
            const Commitment = data['[Portfolio Total Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalNetCommitment += parseFloat(Commitment);
          }
        });
        Data.Grand_TotalNetCommitment = '$' + (Math.round(Data.Grand_TotalNetCommitment * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Portfolio Outliers[Outlier Name]': 'Total', '[Portfolio Total Net Commitment $]': Data.Grand_TotalNetCommitment,
          'Project[Project Id]': ''
        }
      ]);
    } else if (selectedReport === 'P5.10') {
      if (flag === '2') {
        Data.Grand_NetCommitment = 0;
        Data.Grand_Cancellation = 0;
        Data.Grand_Disbursements = 0;
        Data.Grand_UnDisbursements = 0;
        Data.Grand_UnDisbursementsBalance = 0;
        Data.Grand_DisbursementsFY = 0;
        Data.Grand_DisbursementsRatio = 0;
        Data.Grand_ProblemStatus = 0;
        const projectId = [];
        Data.forEach(x => {
          if (x['[Loan Summary Net Commitment $]']) {
            const TotalCommitment = x['[Loan Summary Net Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_NetCommitment += parseFloat(TotalCommitment);
          } else if (x['[Loan Summary Total Cancellation $]']) {
            const TotalCommitment = x['[Loan Summary Total Cancellation $]'].replace(/[^.\d]/g, '');
            Data.Grand_Cancellation += parseFloat(TotalCommitment);
          } else if (x['[Loan Summary Total Disbursement $]']) {
            const TotalCommitment = x['[Loan Summary Total Disbursement $]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursements += parseFloat(TotalCommitment);
          } else if (x['[Loan Summary Total Undisbursement $]']) {
            const TotalCommitment = x['[Loan Summary Total Undisbursement $]'].replace(/[^.\d]/g, '');
            Data.Grand_Undisbursements += parseFloat(TotalCommitment);
          } else if (x['[Loan Summary Undisbursed Balance Beginning FY including Closed Projects $]']) {
            const TotalCommitment = x['[Loan Summary Undisbursed Balance Beginning FY including Closed Projects $]'].replace(/[^.\d]/g, '');
            Data.Grand_UndisbursementsBalance += parseFloat(TotalCommitment);
          } else if (x['[Loan Disbursement in FY]']) {
            const TotalCommitment = x['[Loan Disbursement in FY]'].replace(/[^.\d]/g, '');
            Data.Grand_DisbursementFY += parseFloat(TotalCommitment);
          } else if (x['[Loan Disbursement Ratio]']) {
            const TotalCommitment = x['[Loan Disbursement Ratio]'].replace(/[^.\d]/g, '');
            Data.Grand_DisbursementsRatio += parseFloat(TotalCommitment);
          } else if (x['Portfolio[Month In Problem Status]']) {
            if (projectId.indexOf(x['Project[Project Id]']) === -1) {
              projectId.push(x['Project[Project Id]']);
              const TotalCommitment = x['Portfolio[Month In Problem Status]'].replace(/[^.\d]/g, '');
              Data.Grand_ProblemStatus += parseFloat(TotalCommitment);
            }
          }
        });
        Data.Grand_NetCommitment = '$' + (Math.round(Data.Grand_NetCommitment * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Cancellation = '$' + (Math.round(Data.Grand_Cancellation * 100) / 100).toFixed(2) + 'M';
        Data.Grand_Disbursements = '$' + (Math.round(Data.Grand_Disbursements * 100) / 100).toFixed(2) + 'M';
        Data.Grand_UnDisbursements = '$' + (Math.round(Data.Grand_UnDisbursements * 100) / 100).toFixed(2) + 'M';
        Data.Grand_UnDisbursementsBalance = '$' + (Math.round(Data.Grand_UnDisbursementsBalance * 100) / 100).toFixed(2) + 'M';
        Data.Grand_DisbursementsFY = '$' + (Math.round(Data.Grand_DisbursementsFY * 100) / 100).toFixed(2) + 'M';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[Loan Summary Net Commitment $]': Data.Grand_NetCommitment,
          '[Loan Summary Total Cancellation $]': Data.Grand_Cancellation,
          '[Loan Summary Total Disbursement $]': Data.Grand_Disbursements,
          '[Loan Summary Total Undisbursement $]': Data.Grand_UnDisbursements,
          '[Loan Summary Undisbursed Balance Beginning FY including Closed Projects $]': Data.Grand_UnDisbursementsBalance,
          '[Loan Disbursement in FY]': Data.Grand_DisbursementsFY,
          '[Loan Disbursement Ratio]': Data.Grand_DisbursementsRatio,
          'Portfolio[Month In Problem Status]': Math.round(Data.Grand_ProblemStatus * 100) / 100,
        }
      ]);
    } else if (selectedReport === 'P1.7a') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0;
        Data.Grand_LoanCount = 0;
        Data.Grand_BankFinancing = 0;
        Data.Grand_Disbursement = 0;
        // Data.Grand_UnDisbursement = 0;
        Data.Grand_FYDisbursement = 0;
        Data.Grand_FYDisbursementClosed = 0;
        Data.Grand_FYUnDisbursementClosed = 0;
        Data.Grand_IPFYTD = 0;
        Data.Grand_IPFAnnualized = 0;
        Data.forEach(x => {
          if (x['[Lending Project Count]']) {
            Data.Grand_ProjectCount += x['[Lending Project Count]'];
          }
          if (x['[Loan Active Loan Count]']) {
            Data.Grand_LoanCount += x['[Loan Active Loan Count]'];
          }
          if (x['[Loan Active Net Commitment Amount]']) {
            const TotalCommitment = x['[Loan Active Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_BankFinancing += parseFloat(TotalCommitment);
          }
          if (x['[Loan Active Disbursement Amount]']) {
            const TotalCommitment = x['[Loan Active Disbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursement += parseFloat(TotalCommitment);
          }
          // if (x['[Loan Undisbursement Amount including Closed Projects]']) {
          //   const TotalCommitment = x['[Loan Undisbursement Amount including Closed Projects]'].replace(/[^.\d]/g, '');
          //   Data.Grand_UnDisbursement += parseFloat(TotalCommitment);
          // }
          if (x['[Loan Active Disbursement Amount in FY]']) {
            Data.Grand_FYDisbursement += x['[Loan Active Disbursement Amount in FY]'].replace(/[^.\d]/g, '');
          }
          if (x['[Loan Disbursement Amount in FY including Closed Projects]']) {
            Data.Grand_FYDisbursementClosed += x['[Loan Disbursement Amount in FY including Closed Projects]'].replace(/[^.\d]/g, '');
          }
          if (x['[Loan Undisbursement Amount including Closed Projects]']) {
            Data.Grand_FYUnDisbursementClosed += x['[Loan Undisbursement Amount including Closed Projects]'].replace(/[^.\d]/g, '');
          }
          if (x['[Loan IPF Disbursement Ratio (YTD) including Closed Projects]']) {
            Data.Grand_IPFYTD += x['[Loan IPF Disbursement Ratio (YTD) including Closed Projects]'];
          }
          if (x['[Loan IPF Disbursement Ratio (Annualized) including Closed Projects]']) {
            Data.Grand_IPFAnnualized += x['[Loan IPF Disbursement Ratio (Annualized) including Closed Projects]'];
          }
        });
        Data.Grand_ProjectCount = (Data.Grand_ProjectCount);
        Data.Grand_LoanCount = (Data.Grand_LoanCount);
        Data.Grand_BankFinancing = '$' + (Math.round(Data.Grand_BankFinancing * 100) / 100).toFixed(2) + 'B';
        Data.Grand_Disbursement = '$' + (Math.round(Data.Grand_Disbursement * 100) / 100).toFixed(2) + 'B';
        // Data.Grand_UnDisbursement = '$' + (Math.round(Data.Grand_UnDisbursement * 100) / 100).toFixed(2) + 'B';
        Data.Grand_FYDisbursement = '$' + (Math.round(Data.Grand_FYDisbursement * 100) / 100).toFixed(2) + 'B';
        Data.Grand_FYDisbursementClosed = '$' + (Math.round(Data.Grand_FYDisbursementClosed * 100) / 100).toFixed(2) + 'B';
        Data.Grand_FYUnDisbursementClosed = '$' + (Math.round(Data.Grand_FYUnDisbursementClosed * 100) / 100).toFixed(2) + 'B';
        Data.Grand_IPFYTD = Math.round((Data.Grand_IPFYTD / Data.Data.length) * 10) / 10 + '%';
        Data.Grand_IPFAnnualized = Math.round((Data.Grand_IPFAnnualized / Data.Data.length) * 10) / 10 + '%';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Loan Summary[Loan Country Name]': 'Total',
          '[Loan Active Project Count]': Data.Grand_ProjectCount,
          '[Loan Active Loan Count]': Data.Grand_LoanCount,
          '[Loan Active Net Commitment Amount]': Data.Grand_BankFinancing,
          '[Loan Active Disbursement Amount]': Data.Grand_Disbursement,
          // '[Loan Undisbursement Amount including Closed Projects]': Data.Grand_UnDisbursement,
          '[Loan Active Disbursement Amount in FY]': Data.Grand_FYDisbursement,
          '[Loan Disbursement Amount in FY including Closed Projects]': Data.Grand_FYDisbursementClosed,
          '[Loan Undisbursement Amount including Closed Projects]': Data.Grand_FYUnDisbursementClosed,
          '[Loan IPF Disbursement Ratio (YTD) including Closed Projects]': Math.round((Data.Grand_IPFYTD / Data.Data.length) * 10) / 10,
          '[Loan IPF Disbursement Ratio (Annualized) including Closed Projects]': Math.round((Data.Grand_IPFAnnualized / Data.Data.length) * 10) / 10
        }
      ]);
    } else if (selectedReport === 'P1.7b') {
      if (flag === '2') {
        Data.Grand_ProjectCount = 0; Data.Grand_LoanCount = 0; Data.Grand_BankFinancing = 0;
        Data.Grand_Disbursement = 0;
        Data.forEach(x => {
          if (x['[Loan Active Loan Count]']) {
            Data.Grand_LoanCount += x['[Loan Active Loan Count]'];
          }
          if (x['[Loan Active Net Commitment Amount]']) {
            const TotalCommitment = x['[Loan Active Net Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_BankFinancing += parseFloat(TotalCommitment);
          }
          if (x['[Loan Active Disbursement Amount]']) {
            const TotalCommitment = x['[Loan Active Disbursement Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_Disbursement += parseFloat(TotalCommitment);
          }
        });
        Data.Grand_ProjectCount = (Data.Grand_ProjectCount);
        Data.Grand_LoanCount = (Data.Grand_LoanCount);
        Data.Grand_BankFinancing = '$' + (Math.round(Data.Grand_BankFinancing * 100) / 100).toFixed(2) + 'B';
        Data.Grand_Disbursement = '$' + (Math.round(Data.Grand_Disbursement * 100) / 100).toFixed(2) + 'B';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Loan Summary[Loan Country Name]': 'Total', '[Loan Active Loan Count]': Data.Grand_LoanCount,
          '[Loan Active Net Commitment Amount]': Data.Grand_BankFinancing, '[Loan Active Disbursement Amount]': Data.Grand_Disbursement
        }
      ]);
    } else if (selectedReport === 'A8.1' || selectedReport === 'A8.8' || selectedReport === 'A8.2' || selectedReport === 'FA8.1' || selectedReport === 'FA8.8') {
      if (flag === '2') {
        Data.Grand_CurrentBB = 0; Data.Grand_CurrentBETF = 0; Data.Grand_CurrentTot = 0;
        Data.Grand_LifetimeBB = 0; Data.Grand_LifetimeBETF = 0; Data.Grand_LifetimeTot = 0;
        Data.Grand_ASAAge = 0; Data.Grand_ProjectTot = 0; Data.Grand_AvrgASAAge = 0;
        Data.forEach(x => {
          if (x['[ASA Current FY Expenditure - BB $]']) {
            const Current_BB = x['[ASA Current FY Expenditure - BB $]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentBB += parseFloat(Current_BB);
          }
          if (x['[ASA Current FY Expenditure - BETF $]']) {
            const Current_BETF = x['[ASA Current FY Expenditure - BETF $]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentBETF += parseFloat(Current_BETF);
          }
          if (x['[ASA Current FY Expenditure $]']) {
            const Current_Tot = x['[ASA Current FY Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentTot += parseFloat(Current_Tot);
          }
          if (x['[ASA Total Lifetime Expenditure - BB $]']) {
            const Lifetime_BB = x['[ASA Total Lifetime Expenditure - BB $]'].replace(/[^.\d]/g, '');
            Data.Grand_LifetimeBB += parseFloat(Lifetime_BB);
          }
          if (x['[ASA Total Lifetime Expenditure - BETF $]']) {
            const Lifetime_BETF = x['[ASA Total Lifetime Expenditure - BETF $]'].replace(/[^.\d]/g, '');
            Data.Grand_LifetimeBETF += parseFloat(Lifetime_BETF);
          }
          if (x['[ASA Total Lifetime Expenditure $]']) {
            const Lifetime_Total = x['[ASA Total Lifetime Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_LifetimeTot += parseFloat(Lifetime_Total);
          }
          if (x['[ASA Age (Months)]']) {
            const ASA_Age = x['[ASA Age (Months)]'].replace(/[^.\d]/g, '');
            Data.Grand_ASAAge += parseFloat(ASA_Age);
            Data.Grand_AvrgASAAge = Data.Grand_ASAAge / Data.length;
          }
          if (x['[ASA Project #]']) {
            Data.Grand_ProjectTot += parseFloat(x['[ASA Project #]']);
          }
        });
        Data.Grand_CurrentBB = '$' + (Math.round(Data.Grand_CurrentBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentBETF = '$' + (Math.round(Data.Grand_CurrentBETF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentTot = '$' + (Math.round(Data.Grand_CurrentTot * 100) / 100).toFixed(2) + 'K';
        Data.Grand_LifetimeBB = '$' + (Math.round(Data.Grand_LifetimeBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_LifetimeBETF = '$' + (Math.round(Data.Grand_LifetimeBETF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_LifetimeTot = '$' + (Math.round(Data.Grand_LifetimeTot * 100) / 100).toFixed(2) + 'K';
        Data.Grand_AvrgASAAge = (Math.round(Data.Grand_AvrgASAAge * 100) / 100).toFixed(1);
        Data.Grand_ProjectTot = (Data.Grand_ProjectTot);
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[ASA Current FY Expenditure - BB $]': Data.Grand_CurrentBB,
          '[ASA Current FY Expenditure - BETF $]': Data.Grand_CurrentBETF, '[ASA Current FY Expenditure $]': Data.Grand_CurrentTot,
          '[ASA Total Lifetime Expenditure - BB $]': Data.Grand_LifetimeBB, '[ASA Total Lifetime Expenditure - BETF $]': Data.Grand_LifetimeBETF,
          '[ASA Total Lifetime Expenditure $]': Data.Grand_LifetimeTot, '[ASA Age (Months)]': Data.Grand_AvrgASAAge,
          '[ASA Project #]': Data.Grand_ProjectTot
        }
      ]);

    } else if (selectedReport === 'A8.9' || selectedReport === 'FA8.9') {
      if (flag === '2') {
        Data.Grand_CurrentExpBB = 0; Data.Grand_CurrentExpBETF = 0; Data.Grand_CurrentExpTot = 0;
        Data.Grand_LifetimeExpBB = 0; Data.Grand_LifetimeExpBETF = 0; Data.Grand_LifetimeExpTot = 0;
        Data.Grand_Age = 0; Data.Grand_ProjectTotal = 0; Data.Grand_AvgASAAge = 0;
        Data.forEach(x => {
          if (x['[ASA Current FY Expenditure Amount - BB]']) {
            const Current_BB = x['[ASA Current FY Expenditure Amount - BB]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentExpBB += parseFloat(Current_BB);
          }
          if (x['[ASA Current FY Expenditure Amount - BETF]']) {
            const Current_BETF = x['[ASA Current FY Expenditure Amount - BETF]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentExpBETF += parseFloat(Current_BETF);
          }
          if (x['[ASA Current FY Expenditure Amount - Total]']) {
            const Current_Tot = x['[ASA Current FY Expenditure Amount - Total]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentExpTot += parseFloat(Current_Tot);
          }
          if (x['[ASA Lifetime Expenditure Amount - BB]']) {
            const Lifetime_BB = x['[ASA Lifetime Expenditure Amount - BB]'].replace(/[^.\d]/g, '');
            Data.Grand_LifetimeExpBB += parseFloat(Lifetime_BB);
          }
          if (x['[ASA Lifetime Expenditure Amount - BETF]']) {
            const Lifetime_BETF = x['[ASA Lifetime Expenditure Amount - BETF]'].replace(/[^.\d]/g, '');
            Data.Grand_LifetimeExpBETF += parseFloat(Lifetime_BETF);
          }
          if (x['[ASA Lifetime Expenditure Amount - Total]']) {
            const Lifetime_Total = x['[ASA Lifetime Expenditure Amount - Total]'].replace(/[^.\d]/g, '');
            Data.Grand_LifetimeExpTot += parseFloat(Lifetime_Total);
          }
          if (x['[ASA Age (Months)]']) {
            const ASA_Age = x['[ASA Age (Months)]'].replace(/[^.\d]/g, '');
            Data.Grand_Age += parseFloat(ASA_Age);
            Data.Grand_AvgASAAge = Data.Grand_Age / Data.length;
          }
          if (x['[ASA Project Count]']) {
            Data.Grand_ProjectTotal += parseFloat(x['[ASA Project Count]']);
          }
        });
        Data.Grand_CurrentExpBB = '$' + (Math.round(Data.Grand_CurrentExpBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentExpBETF = '$' + (Math.round(Data.Grand_CurrentExpBETF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentExpTot = '$' + (Math.round(Data.Grand_CurrentExpTot * 100) / 100).toFixed(2) + 'K';
        Data.Grand_LifetimeExpBB = '$' + (Math.round(Data.Grand_LifetimeExpBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_LifetimeExpBETF = '$' + (Math.round(Data.Grand_LifetimeExpBETF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_LifetimeExpTot = '$' + (Math.round(Data.Grand_LifetimeExpTot * 100) / 100).toFixed(2) + 'K';
        Data.Grand_AvgASAAge = (Math.round(Data.Grand_AvgASAAge * 100) / 100).toFixed(1);
        Data.Grand_ProjectTotal = (Data.Grand_ProjectTotal);
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[ASA Current FY Expenditure Amount - BB]': Data.Grand_CurrentExpBB,
          '[ASA Current FY Expenditure Amount - BETF]': Data.Grand_CurrentExpBETF, '[ASA Current FY Expenditure Amount - Total]': Data.Grand_CurrentExpTot,
          '[ASA Lifetime Expenditure Amount - BB]': Data.Grand_LifetimeExpBB, '[ASA Lifetime Expenditure Amount - BETF]': Data.Grand_LifetimeExpBETF,
          '[ASA Lifetime Expenditure Amount - Total]': Data.Grand_LifetimeExpTot, '[ASA Age (Months)]': Data.Grand_AvgASAAge,
          '[ASA Project Count]': Data.Grand_ProjectTotal
        }
      ]);
    } else if (selectedReport === 'RAS1.3') {
      if (flag === '2') {
        Data.Grand_AgreementAmount = 0; Data.Grand_RASBudget = 0; Data.Grand_CumulativeExpenditure = 0;
        Data.Grand_CumulativeAgreeExp = 0; Data.Grand_AgreeRemainingBudget = 0; Data.Grand_WPAPlan = 0;
        Data.Grand_FYExpenditure = 0; Data.Grand_WPARemainingBalance = 0; Data.Grand_FYCommitment = 0;
        Data.Grand_FYExpenditureCommitment = 0; Data.Grand_WPARemainingBalanceAfComm = 0; Data.Grand_WPABurnRate = 0;
        Data.Grand_WPABurnRateAfComm = 0;
        Data.forEach(x => {
          if (x['[RAS Agreement $]']) {
            const RASAgreement = x['[RAS Agreement $]'].replace(/[^.\d]/g, '');
            Data.Grand_AgreementAmount += parseFloat(RASAgreement);
          }
          if (x['[RAS Current FY Budget Active/Closed $]']) {
            const RASBudget = x['[RAS Current FY Budget Active/Closed $]'].replace(/[^.\d]/g, '');
            Data.Grand_RASBudget += parseFloat(RASBudget);
          }
          if (x['[RAS Cumulative Expenditure $]']) {
            const RASCumulative = x['[RAS Cumulative Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumulativeExpenditure += parseFloat(RASCumulative);
          }
          if (x['[RAS Cumulative Agreement Level Expenditure $]']) {
            const RASCumulative = x['[RAS Cumulative Agreement Level Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumulativeAgreeExp += parseFloat(RASCumulative);
          }
          if (x['[RAS Agreement Level Remaining Budget $]']) {
            const RASAgreement = x['[RAS Agreement Level Remaining Budget $]'].replace(/[^.\d]/g, '');
            Data.Grand_AgreeRemainingBudget += parseFloat(RASAgreement);
          }
          if (x['[RAS WPA Plan $]']) {
            const RASWPAPlan = x['[RAS WPA Plan $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPAPlan += parseFloat(RASWPAPlan);
          }
          if (x['[RAS FY Expenditure $]']) {
            const RASExpenditure = x['[RAS FY Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpenditure += parseFloat(RASExpenditure);
          }
          if (x['[RAS WPA Remaining Balance $]']) {
            const RemainingBalance = x['[RAS WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPARemainingBalance += parseFloat(RemainingBalance);
          }
          if (x['[RAS FY Commitment $]']) {
            const FYCommitment = x['[RAS FY Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYCommitment += parseFloat(FYCommitment);
          }
          if (x['[RAS FY Expenditure + Commitment $]']) {
            const FYExpenditureCommitment = x['[RAS FY Expenditure + Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpenditureCommitment += parseFloat(FYExpenditureCommitment);
          }
          if (x['[RAS After Commitment WPA Remaining Balance $]']) {
            const RASCommitment = x['[RAS After Commitment WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPARemainingBalanceAfComm += parseFloat(RASCommitment);
          }
          if (x['[RAS WPA Burn Rate %]']) {
            Data.Grand_WPABurnRate += parseFloat(x['[RAS WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS After Commitment WPA Burn Rate %]']) {
            Data.Grand_WPABurnRateAfComm += parseFloat(x['[RAS After Commitment WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
        });
        Data.Grand_AgreementAmount = '$' + (Math.round(Data.Grand_AgreementAmount * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RASBudget = '$' + (Math.round(Data.Grand_RASBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeExpenditure = '$' + (Math.round(Data.Grand_CumulativeExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeAgreeExp = '$' + (Math.round(Data.Grand_CumulativeAgreeExp * 100) / 100).toFixed(2) + 'K';
        Data.Grand_AgreeRemainingBudget = '$' + (Math.round(Data.Grand_AgreeRemainingBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPAPlan = '$' + (Math.round(Data.Grand_WPAPlan * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpenditure = '$' + (Math.round(Data.Grand_FYExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPARemainingBalance = '$' + (Math.round(Data.Grand_WPARemainingBalance * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYCommitment = '$' + (Math.round(Data.Grand_FYCommitment * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpenditureCommitment = '$' + (Math.round(Data.Grand_FYExpenditureCommitment * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPARemainingBalanceAfComm = '$' + (Math.round(Data.Grand_WPARemainingBalanceAfComm * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPABurnRate = (Data.Grand_WPABurnRate / Data.length).toFixed(1) + '%';
        Data.Grand_WPABurnRateAfComm = (Data.Grand_WPABurnRateAfComm / Data.length).toFixed(1) + '%';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[RAS Agreement $]': Data.Grand_AgreementAmount, '[RAS Current FY Budget Active/Closed $]': Data.Grand_RASBudget,
          '[RAS Cumulative Expenditure $]': Data.Grand_CumulativeExpenditure, '[RAS Cumulative Agreement Level Expenditure $]': Data.Grand_CumulativeAgreeExp,
          '[RAS Agreement Level Remaining Budget $]': Data.Grand_AgreeRemainingBudget, '[RAS WPA Plan $]': Data.Grand_WPAPlan,
          '[RAS FY Expenditure $]': Data.Grand_FYExpenditure, '[RAS WPA Remaining Balance $]': Data.Grand_WPARemainingBalance,
          '[RAS FY Commitment $]': Data.Grand_FYCommitment, '[RAS FY Expenditure + Commitment $]': Data.Grand_FYExpenditureCommitment,
          '[RAS After Commitment WPA Remaining Balance $]': Data.Grand_WPARemainingBalanceAfComm, '[RAS WPA Burn Rate %]': Data.Grand_WPABurnRate,
          '[RAS After Commitment WPA Burn Rate %]': Data.Grand_WPABurnRateAfComm
        }
      ]);
    } else if (selectedReport === 'RAS1.4') {
      if (flag === '2') {
        Data.Grand_AgreementAmount = 0; Data.Grand_RASBudget = 0; Data.Grand_CumulativeExpenditure = 0;
        Data.Grand_CumulativeAgreeExp = 0; Data.Grand_AgreeRemainingBudget = 0; Data.Grand_WPAPlan = 0;
        Data.Grand_FYExpenditure = 0; Data.Grand_WPARemainingBalance = 0; Data.Grand_FYCommitment = 0;
        Data.Grand_FYExpenditureCommitment = 0; Data.Grand_WPARemainingBalanceAfComm = 0; Data.Grand_IndirectSustainingRate = 0;
        Data.Grand_BudgetBurnRate = 0; Data.Grand_WPABurnRate = 0; Data.Grand_WPABurnRateAfComm = 0;
        Data.forEach(x => {
          if (x['[RAS Agreement $]']) {
            const RASAgreement = x['[RAS Agreement $]'].replace(/[^.\d]/g, '');
            Data.Grand_AgreementAmount += parseFloat(RASAgreement);
          }
          if (x['[RAS Current FY Budget Active/Closed $]']) {
            const RASBudget = x['[RAS Current FY Budget Active/Closed $]'].replace(/[^.\d]/g, '');
            Data.Grand_RASBudget += parseFloat(RASBudget);
          }
          if (x['[RAS Cumulative Expenditure $]']) {
            const RASCumulative = x['[RAS Cumulative Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumulativeExpenditure += parseFloat(RASCumulative);
          }
          if (x['[RAS Cumulative Agreement Level Expenditure $]']) {
            const RASCumulative = x['[RAS Cumulative Agreement Level Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumulativeAgreeExp += parseFloat(RASCumulative);
          }
          if (x['[RAS Agreement Level Remaining Budget $]']) {
            const RASAgreement = x['[RAS Agreement Level Remaining Budget $]'].replace(/[^.\d]/g, '');
            Data.Grand_AgreeRemainingBudget += parseFloat(RASAgreement);
          }
          if (x['[RAS WPA Plan $]']) {
            const RASWPAPlan = x['[RAS WPA Plan $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPAPlan += parseFloat(RASWPAPlan);
          }
          if (x['[RAS FY Expenditure $]']) {
            const RASExpenditure = x['[RAS FY Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpenditure += parseFloat(RASExpenditure);
          }
          if (x['[RAS WPA Remaining Balance $]']) {
            const RemainingBalance = x['[RAS WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPARemainingBalance += parseFloat(RemainingBalance);
          }
          if (x['[RAS FY Commitment $]']) {
            const FYCommitment = x['[RAS FY Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYCommitment += parseFloat(FYCommitment);
          }
          if (x['[RAS FY Expenditure + Commitment $]']) {
            const FYExpenditureCommitment = x['[RAS FY Expenditure + Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpenditureCommitment += parseFloat(FYExpenditureCommitment);
          }
          if (x['[RAS After Commitment WPA Remaining Balance $]']) {
            const RASCommitment = x['[RAS After Commitment WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPARemainingBalanceAfComm += parseFloat(RASCommitment);
          }
          if (x['[RAS Indirect and Sustaining Rate %]']) {
            Data.Grand_IndirectSustainingRate += parseFloat(x['[RAS Indirect and Sustaining Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS Agreement Level Budget Burn Rate %]']) {
            Data.Grand_BudgetBurnRate += parseFloat(x['[RAS Agreement Level Budget Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS WPA Burn Rate %]']) {
            Data.Grand_WPABurnRate += parseFloat(x['[RAS WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS After Commitment WPA Burn Rate %]']) {
            Data.Grand_WPABurnRateAfComm += parseFloat(x['[RAS After Commitment WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
        });
        Data.Grand_AgreementAmount = '$' + (Math.round(Data.Grand_AgreementAmount * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RASBudget = '$' + (Math.round(Data.Grand_RASBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeExpenditure = '$' + (Math.round(Data.Grand_CumulativeExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeAgreeExp = '$' + (Math.round(Data.Grand_CumulativeAgreeExp * 100) / 100).toFixed(2) + 'K';
        Data.Grand_AgreeRemainingBudget = '$' + (Math.round(Data.Grand_AgreeRemainingBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPAPlan = '$' + (Math.round(Data.Grand_WPAPlan * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpenditure = '$' + (Math.round(Data.Grand_FYExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPARemainingBalance = '$' + (Math.round(Data.Grand_WPARemainingBalance * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYCommitment = '$' + (Math.round(Data.Grand_FYCommitment * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpenditureCommitment = '$' + (Math.round(Data.Grand_FYExpenditureCommitment * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPARemainingBalanceAfComm = '$' + (Math.round(Data.Grand_WPARemainingBalanceAfComm * 100) / 100).toFixed(2) + 'K';
        Data.Grand_IndirectSustainingRate = (Data.Grand_IndirectSustainingRate / Data.length).toFixed(1) + '%';
        Data.Grand_BudgetBurnRate = (Data.Grand_BudgetBurnRate / Data.length).toFixed(1) + '%';
        Data.Grand_WPABurnRate = (Data.Grand_WPABurnRate / Data.length).toFixed(1) + '%';
        Data.Grand_WPABurnRateAfComm = (Data.Grand_WPABurnRateAfComm / Data.length).toFixed(1) + '%';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[RAS Agreement $]': Data.Grand_AgreementAmount, '[RAS Current FY Budget Active/Closed $]': Data.Grand_RASBudget,
          '[RAS Cumulative Expenditure $]': Data.Grand_CumulativeExpenditure, '[RAS Cumulative Agreement Level Expenditure $]': Data.Grand_CumulativeAgreeExp,
          '[RAS Agreement Level Remaining Budget $]': Data.Grand_AgreeRemainingBudget, '[RAS WPA Plan $]': Data.Grand_WPAPlan,
          '[RAS FY Expenditure $]': Data.Grand_FYExpenditure, '[RAS WPA Remaining Balance $]': Data.Grand_WPARemainingBalance,
          '[RAS FY Commitment $]': Data.Grand_FYCommitment, '[RAS FY Expenditure + Commitment $]': Data.Grand_FYExpenditureCommitment,
          '[RAS After Commitment WPA Remaining Balance $]': Data.Grand_WPARemainingBalanceAfComm, '[RAS Indirect and Sustaining Rate %]': Data.Grand_IndirectSustainingRate,
          '[RAS Agreement Level Budget Burn Rate %]': Data.Grand_BudgetBurnRate, '[RAS WPA Burn Rate %]': Data.Grand_WPABurnRate,
          '[RAS After Commitment WPA Burn Rate %]': Data.Grand_WPABurnRateAfComm
        }
      ]);
    } else if (selectedReport === 'RAS1.1' || selectedReport === 'RAS1.2') {
      if (flag === '2') {
        Data.Grand_RASAgreement = 0; Data.Grand_CurrentFYBudget = 0; Data.Grand_CumulativeExpenditure = 0;
        Data.Grand_CumulativeAgreement = 0; Data.Grand_RemainingBudget = 0; Data.Grand_WPAPlan = 0;
        Data.Grand_FYExpenditure = 0; Data.Grand_WPARemainingBal = 0; Data.Grand_FYCommitment = 0;
        Data.Grand_FYExpCommt = 0; Data.Grand_RemainingAfterCommt = 0; Data.Grand_RASIndirect = 0;
        Data.Grand_BudgetBurnRate = 0; Data.Grand_WPABurnRate = 0; Data.Grand_BurnRateAfterComm = 0;
        Data.Grand_ActiveTaskPortfolio = 0; Data.Grand_TotalLegalAgreementsActive = 0;
        Data.forEach(x => {
          if (x['[RAS Agreement $]']) {
            const RAS_Agreement = x['[RAS Agreement $]'].replace(/[^.\d]/g, '');
            Data.Grand_RASAgreement += parseFloat(RAS_Agreement);
          }
          if (x['[RAS Current FY Budget Active/Closed $]']) {
            const Current_FYBudget = x['[RAS Current FY Budget Active/Closed $]'].replace(/[^.\d]/g, '');
            Data.Grand_CurrentFYBudget += parseFloat(Current_FYBudget);
          }
          if (x['[RAS Cumulative Expenditure $]']) {
            const Cumulative_Expenditure = x['[RAS Cumulative Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumulativeExpenditure += parseFloat(Cumulative_Expenditure);
          }
          if (x['[RAS Cumulative Agreement Level Expenditure $]']) {
            const Cumulative_Agreement = x['[RAS Cumulative Agreement Level Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_CumulativeAgreement += parseFloat(Cumulative_Agreement);
          }
          if (x['[RAS Agreement Level Remaining Budget $]']) {
            const Remaining_Budget = x['[RAS Agreement Level Remaining Budget $]'].replace(/[^.\d]/g, '');
            Data.Grand_RemainingBudget += parseFloat(Remaining_Budget);
          }
          if (x['[RAS WPA Plan $]']) {
            const WPA_Plan = x['[RAS WPA Plan $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPAPlan += parseFloat(WPA_Plan);
          }
          if (x['[RAS FY Expenditure $]']) {
            const FY_Expenditure = x['[RAS FY Expenditure $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpenditure += parseFloat(FY_Expenditure);
          }
          if (x['[RAS WPA Remaining Balance $]']) {
            const WPA_RemainingBal = x['[RAS WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_WPARemainingBal += parseFloat(WPA_RemainingBal);
          }
          if (x['RAS[FY Commitment Amount]']) {
            const FY_Commitment = x['RAS[FY Commitment Amount]'].replace(/[^.\d]/g, '');
            Data.Grand_FYCommitment += parseFloat(FY_Commitment);
          }
          if (x['[RAS FY Expenditure + Commitment $]']) {
            const FY_ExpCommitment = x['[RAS FY Expenditure + Commitment $]'].replace(/[^.\d]/g, '');
            Data.Grand_FYExpCommt += parseFloat(FY_ExpCommitment);
          }
          if (x['[RAS After Commitment WPA Remaining Balance $]']) {
            const Remaining_AfterCommt = x['[RAS After Commitment WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
            Data.Grand_RemainingAfterCommt += parseFloat(Remaining_AfterCommt);
          }
          if (x['[RAS Indirect and Sustaining Rate %]']) {
            Data.Grand_RASIndirect += parseFloat(x['[RAS Indirect and Sustaining Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS Agreement Level Budget Burn Rate %]']) {
            Data.Grand_BudgetBurnRate += parseFloat(x['[RAS Agreement Level Budget Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS WPA Burn Rate %]']) {
            Data.Grand_WPABurnRate += parseFloat(x['[RAS WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS After Commitment WPA Burn Rate %]']) {
            Data.Grand_BurnRateAfterComm += parseFloat(x['[RAS After Commitment WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS Total Legal Agreements Active $]']) {
            Data.Grand_ActiveTaskPortfolio += parseFloat(x['[RAS Total Legal Agreements Active $]'].replace(/[^.\d]/g, ''));
          }
          if (x['[RAS Active Task Portfolio Not Signed #]']) {
            Data.Grand_TotalLegalAgreementsActive += parseFloat(x['[RAS Active Task Portfolio Not Signed #]'].replace(/[^.\d]/g, ''));
          }
        });
        Data.Grand_RASAgreement = '$' + (Math.round(Data.Grand_RASAgreement * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentFYBudget = '$' + (Math.round(Data.Grand_CurrentFYBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeExpenditure = '$' + (Math.round(Data.Grand_CumulativeExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeAgreement = '$' + (Math.round(Data.Grand_CumulativeAgreement * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RemainingBudget = '$' + (Math.round(Data.Grand_RemainingBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPAPlan = '$' + (Math.round(Data.Grand_WPAPlan * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpenditure = '$' + (Math.round(Data.Grand_FYExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPARemainingBal = '$' + (Math.round(Data.Grand_WPARemainingBal * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYCommitment = '$' + (Math.round(Data.Grand_FYCommitment * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpCommt = '$' + (Math.round(Data.Grand_FYExpCommt * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RemainingAfterCommt = '$' + (Math.round(Data.Grand_RemainingAfterCommt * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RASIndirect = (Data.Grand_RASIndirect / Data.length).toFixed(1) + '%';
        Data.Grand_BudgetBurnRate = (Data.Grand_BudgetBurnRate / Data.length).toFixed(1) + '%';
        Data.Grand_WPABurnRate = (Data.Grand_WPABurnRate / Data.length).toFixed(1) + '%';
        Data.Grand_BurnRateAfterComm = (Data.Grand_BurnRateAfterComm / Data.length).toFixed(1) + '%';
        Data.Grand_TotalLegalAgreementsActive = '$' + + (Math.round(Data.Grand_TotalLegalAgreementsActive * 100) / 100).toFixed(2) + 'K';
        Data.Grand_ActiveTaskPortfolio = Data.Grand_ActiveTaskPortfolio;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[RAS Agreement $]': Data.Grand_RASAgreement,
          '[RAS Current FY Budget Active/Closed $]': Data.Grand_CurrentFYBudget,
          '[RAS Cumulative Expenditure $]': Data.Grand_CumulativeExpenditure,
          '[RAS Cumulative Agreement Level Expenditure $]': Data.Grand_CumulativeAgreement,
          '[RAS Agreement Level Remaining Budget $]': Data.Grand_RemainingBudget,
          '[RAS WPA Plan $]': Data.Grand_WPAPlan,
          '[RAS FY Expenditure $]': Data.Grand_FYExpenditure,
          '[RAS WPA Remaining Balance $]': Data.Grand_WPARemainingBal,
          'RAS[FY Commitment Amount]': Data.Grand_FYCommitment,
          '[RAS FY Expenditure + Commitment $]': Data.Grand_FYExpCommt,
          '[RAS After Commitment WPA Remaining Balance $]': Data.Grand_RemainingAfterCommt,
          '[RAS Indirect and Sustaining Rate %]': Data.Grand_RASIndirect,
          '[RAS Agreement Level Budget Burn Rate %]': Data.Grand_BudgetBurnRate,
          '[RAS WPA Burn Rate %]': Data.Grand_WPABurnRate,
          '[RAS After Commitment WPA Burn Rate %]': Data.Grand_BurnRateAfterComm,
          '[RAS Total Legal Agreements Active $]': Data.Grand_TotalLegalAgreementsActive,
          '[RAS Active Task Portfolio Not Signed #]': Data.Grand_ActiveTaskPortfolio,
        }
      ]);
    } else if (selectedReport === 'RAS1.7') {
      if (flag === '2') {
        Data.Grand_RASAgreement = 0;
        Data.Grand_RASIndirect = 0;
        Data.Grand_CumulativeExpenditure = 0;
        Data.Grand_CurrentFYBudget = 0;
        Data.Grand_CumulativeAgreement = 0;
        Data.Grand_RemainingBudget = 0;
        Data.Grand_BudgetBurnRate = 0;
        Data.Grand_WPAPlan = 0;
        Data.Grand_FYExpenditure = 0;
        Data.Grand_WPARemainingBal = 0;
        Data.Grand_WPABurnRate = 0;
        Data.Grand_FYCommitment = 0;
        Data.Grand_FYExpCommt = 0;
        Data.Grand_RemainingAfterCommt = 0;
        Data.Grand_BurnRateAfterComm = 0;
        Data.Grand_AuthorizingPublicDisclosureIndicator = 0;
        Data.Grand_ProjectRelatedIndicator = 0;
        Data.Grand_RASOutliers = 0;
        const projectlist = [];

        Data.forEach(x => {
          if (projectlist.indexOf(x['Project[Project Id]']) === -1) {
            projectlist.push(x['Project[Project Id]']);
            if (x['[RAS Agreement $]']) {
              const RAS_Agreement = x['[RAS Agreement $]'].replace(/[^.\d]/g, '');
              Data.Grand_RASAgreement += parseFloat(RAS_Agreement);
            }
            if (x['[RAS Indirect and Sustaining Rate %]']) {
              Data.Grand_RASIndirect += parseFloat(x['[RAS Indirect and Sustaining Rate %]'].replace(/[^.\d]/g, ''));
            }
            if (x['[RAS Total Direct Cost $]']) {
              const Current_FYBudget = x['[RAS Total Direct Cost $]'].replace(/[^.\d]/g, '');
              Data.Grand_CurrentFYBudget += parseFloat(Current_FYBudget);
            }
            if (x['[RAS Cumulative Expenditure $]']) {
              const Cumulative_Expenditure = x['[RAS Cumulative Expenditure $]'].replace(/[^.\d]/g, '');
              Data.Grand_CumulativeExpenditure += parseFloat(Cumulative_Expenditure);
            }
            if (x['[RAS Cumulative Agreement Level Expenditure $]']) {
              const Cumulative_Agreement = x['[RAS Cumulative Agreement Level Expenditure $]'].replace(/[^.\d]/g, '');
              Data.Grand_CumulativeAgreement += parseFloat(Cumulative_Agreement);
            }
            if (x['[RAS Agreement Level Remaining Budget $]']) {
              const Remaining_Budget = x['[RAS Agreement Level Remaining Budget $]'].replace(/[^.\d]/g, '');
              Data.Grand_RemainingBudget += parseFloat(Remaining_Budget);
            }
            if (x['[RAS Agreement Level Budget Burn Rate %]']) {
              Data.Grand_BudgetBurnRate += parseFloat(x['[RAS Agreement Level Budget Burn Rate %]'].replace(/[^.\d]/g, ''));
            }
            if (x['[RAS WPA Plan $]']) {
              const WPA_Plan = x['[RAS WPA Plan $]'].replace(/[^.\d]/g, '');
              Data.Grand_WPAPlan += parseFloat(WPA_Plan);
            }
            if (x['[RAS FY Expenditure $]']) {
              const FY_Expenditure = x['[RAS FY Expenditure $]'].replace(/[^.\d]/g, '');
              Data.Grand_FYExpenditure += parseFloat(FY_Expenditure);
            }
            if (x['[RAS WPA Remaining Balance $]']) {
              const WPA_RemainingBal = x['[RAS WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
              Data.Grand_WPARemainingBal += parseFloat(WPA_RemainingBal);
            }
            if (x['[RAS WPA Burn Rate %]']) {
              Data.Grand_WPABurnRate += parseFloat(x['[RAS WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
            }
            if (x['[RAS FY Commitment $]']) {
              const FYCommitment = x['[RAS FY Commitment $]'].replace(/[^.\d]/g, '');
              Data.Grand_FYCommitment += parseFloat(FYCommitment);
            }
            if (x['[RAS FY Expenditure + Commitment $]']) {
              const FY_ExpCommitment = x['[RAS FY Expenditure + Commitment $]'].replace(/[^.\d]/g, '');
              Data.Grand_FYExpCommt += parseFloat(FY_ExpCommitment);
            }
            if (x['[RAS After Commitment WPA Remaining Balance $]']) {
              const Remaining_AfterCommt = x['[RAS After Commitment WPA Remaining Balance $]'].replace(/[^.\d]/g, '');
              Data.Grand_RemainingAfterCommt += parseFloat(Remaining_AfterCommt);
            }
            if (x['[RAS After Commitment WPA Burn Rate %]']) {
              Data.Grand_BurnRateAfterComm += parseFloat(x['[RAS After Commitment WPA Burn Rate %]'].replace(/[^.\d]/g, ''));
            }
            if (x['[RAS Authorizing Public Disclosure #]']) {
              Data.Grand_AuthorizingPublicDisclosureIndicator += parseFloat(x['[RAS Authorizing Public Disclosure #]'].replace(/[^.\d]/g, ''));
            }
            if (x['[RAS Project Related #]']) {
              Data.Grand_ProjectRelatedIndicator += parseFloat(x['[RAS Project Related #]'].replace(/[^.\d]/g, ''));
            }
            if (x['[RAS Outliers #]']) {
              Data.Grand_RASOutliers += parseFloat(x['[RAS Outliers #]'].replace(/[^.\d]/g, ''));
            }
          }
        });

        Data.Grand_RASAgreement = '$' + (Math.round(Data.Grand_RASAgreement * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeExpenditure = '$' + (Math.round(Data.Grand_CumulativeExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CurrentFYBudget = '$' + (Math.round(Data.Grand_CurrentFYBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_CumulativeAgreement = '$' + (Math.round(Data.Grand_CumulativeAgreement * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RemainingBudget = '$' + (Math.round(Data.Grand_RemainingBudget * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPAPlan = '$' + (Math.round(Data.Grand_WPAPlan * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpenditure = '$' + (Math.round(Data.Grand_FYExpenditure * 100) / 100).toFixed(2) + 'K';
        Data.Grand_WPARemainingBal = '$' + (Math.round(Data.Grand_WPARemainingBal * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYCommitment = '$' + (Math.round(Data.Grand_FYCommitment * 100) / 100).toFixed(2) + 'K';
        Data.Grand_FYExpCommt = '$' + (Math.round(Data.Grand_FYExpCommt * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RemainingAfterCommt = '$' + (Math.round(Data.Grand_RemainingAfterCommt * 100) / 100).toFixed(2) + 'K';
        Data.Grand_BurnRateAfterComm = (Data.Grand_BurnRateAfterComm / Data.length).toFixed(1) + '%';
        // Data.Grand_AuthorizingPublicDisclosureIndicator = Data.Grand_AuthorizingPublicDisclosureIndicator;
        // Data.Grand_ProjectRelatedIndicator = '$' + (Math.round(Data.Grand_ProjectRelatedIndicator * 100) / 100).toFixed(2) + 'K';
        // Data.Grand_RASOutliers = '$' + (Math.round(Data.Grand_RASOutliers * 100) / 100).toFixed(2) + 'K';
        Data.Grand_RASIndirect = (Data.Grand_RASIndirect / Data.length).toFixed(1) + '%';
        Data.Grand_BudgetBurnRate = (Data.Grand_BudgetBurnRate / Data.length).toFixed(1) + '%';
        Data.Grand_WPABurnRate = (Data.Grand_WPABurnRate / Data.length).toFixed(1) + '%';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'RAS Outliers[Outlier Name]': 'Total',
          '[RAS Agreement $]': Data.Grand_RASAgreement,
          '[RAS Indirect and Sustaining Rate %]': Data.Grand_RASIndirect,
          '[RAS Total Direct Cost $]': Data.Grand_RASTotalDirectCost,
          '[RAS Cumulative Expenditure $]': Data.Grand_CumulativeExpenditure,
          '[RAS Cumulative Agreement Level Expenditure $]': Data.Grand_CumulativeAgreement,
          '[RAS Agreement Level Remaining Budget $]': Data.Grand_RemainingBudget,
          '[RAS Agreement Level Budget Burn Rate %]': Data.Grand_BudgetBurnRate,
          '[RAS WPA Plan $]': Data.Grand_WPAPlan,
          '[RAS FY Expenditure $]': Data.Grand_FYExpenditure,
          '[RAS WPA Remaining Balance $]': Data.Grand_WPARemainingBal,
          '[RAS WPA Burn Rate %]': Data.Grand_WPABurnRate,
          '[RAS FY Commitment $]': Data.Grand_FYCommt,
          '[RAS FY Expenditure + Commitment $]': Data.Grand_FYExpCommt,
          '[RAS After Commitment WPA Remaining Balance $]': Data.Grand_RemainingAfterCommt,
          '[RAS After Commitment WPA Burn Rate %]': Data.Grand_BurnRateAfterComm,
          '[RAS Authorizing Public Disclosure #]': Data.Grand_AuthorizingPublicDisclosureIndicator,
          '[RAS Project Related #]': Data.Grand_ProjectRelatedIndicator,
          '[RAS Outliers #]': Data.Grand_RASOutliers
        }
      ]);
    } else if (selectedReport === 'K1.3') {
      if (flag === '2') {
        Data.Grand_LegalAgrrement = 0; Data.Grand_ExpenditureBB = 0; Data.Grand_ExpenditureBETF = 0;
        Data.Grand_ExpenditureTotal = 0; Data.Grand_TotalExpenditureBB = 0; Data.Grand_TotalExpenditureBETF = 0;
        Data.Grand_TotalExpenditure = 0;
        // Data.Grand_ProjectCount = 0;  Data.Grand_CompletedFY = 0;
        // Data.Grand_PlannedFY = 0;
        Data.forEach(x => {
          if (x['[RAS Total Legal Agreement $]']) {
            const RAS_Agreement = x['[RAS Total Legal Agreement $]'].replace(/[^.\d]/g, '');
            Data.Grand_LegalAgrrement += parseFloat(RAS_Agreement);
          }
          if (x['[Project Expenses Current FY BB $]']) {
            const Current_FYBudget = x['[Project Expenses Current FY BB $]'].replace(/[^.\d]/g, '');
            Data.Grand_ExpenditureBB += parseFloat(Current_FYBudget);
          }
          if (x['[Project Expenses Current FY TF $]']) {
            const Cumulative_Expenditure = x['[Project Expenses Current FY TF $]'].replace(/[^.\d]/g, '');
            Data.Grand_ExpenditureBETF += parseFloat(Cumulative_Expenditure);
          }
          if (x['[Project Expenses Current FY Total $]']) {
            const Cumulative_Agreement = x['[Project Expenses Current FY Total $]'].replace(/[^.\d]/g, '');
            Data.Grand_ExpenditureTotal += parseFloat(Cumulative_Agreement);
          }
          if (x['[Project Expenses Total Cumulative BB $]']) {
            const Remaining_Budget = x['[Project Expenses Total Cumulative BB $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalExpenditureBB += parseFloat(Remaining_Budget);
          }
          if (x['[Project Expenses Total Cumulative TF $]']) {
            const WPA_Plan = x['[Project Expenses Total Cumulative TF $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalExpenditureBETF += parseFloat(WPA_Plan);
          }
          if (x['[Project Expenses Total Cumulative $]']) {
            const FY_Expenditure = x['[Project Expenses Total Cumulative $]'].replace(/[^.\d]/g, '');
            Data.Grand_TotalExpenditure += parseFloat(FY_Expenditure);
          }
        });
        Data.Grand_LegalAgrrement = '$' + (Math.round(Data.Grand_LegalAgrrement * 100) / 100).toFixed(2) + 'K';
        Data.Grand_ExpenditureBB = '$' + (Math.round(Data.Grand_ExpenditureBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_ExpenditureBETF = '$' + (Math.round(Data.Grand_ExpenditureBETF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_ExpenditureTotal = '$' + (Math.round(Data.Grand_ExpenditureTotal * 100) / 100).toFixed(2) + 'K';
        Data.Grand_TotalExpenditureBB = '$' + (Math.round(Data.Grand_TotalExpenditureBB * 100) / 100).toFixed(2) + 'K';
        Data.Grand_TotalExpenditureBETF = '$' + (Math.round(Data.Grand_TotalExpenditureBETF * 100) / 100).toFixed(2) + 'K';
        Data.Grand_TotalExpenditure = '$' + (Math.round(Data.Grand_TotalExpenditure * 100) / 100).toFixed(2) + 'K';
        // Data.Grand_ProjectCount = Data.Grand_ProjectCount;
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[RAS Total Legal Agreement $]': Data.Grand_LegalAgrrement,
          '[Project Expenses Current FY BB $]': Data.Grand_ExpenditureBB,
          '[Project Expenses Current FY TF $]': Data.Grand_ExpenditureBETF,
          '[Project Expenses Current FY Total $]': Data.Grand_ExpenditureTotal,
          '[Project Expenses Total Cumulative BB $]': Data.Grand_TotalExpenditureBB,
          '[Project Expenses Total Cumulative TF $]': Data.Grand_TotalExpenditureBETF,
          '[Project Expenses Total Cumulative $]': Data.Grand_TotalExpenditure,
          '[Knowledge Project #]': Data.Grand_ProjectCount,
          '[Knowledge Planned Completed in Current FY #]': Data.Grand_CompletedFY,
          '[Knowledge Planned in Current FY #]': Data.Grand_PlannedFY,
        }
      ]);
    } else if (selectedReport === 'C3.2') {
      if (flag === '2') {
        Data.Grand_Expense = 0;
        Data.forEach(x => {
          if (x['[CPF Total Expenses $]']) {
            const Grand_Engagement = x['[CPF Total Expenses $]'].replace(/[^.\d]/g, '');
            Data.Grand_Expense += parseFloat(Grand_Engagement);
          }
        });
        Data.Grand_Expense = '$' + (Math.round(Data.Grand_Expense * 100) / 100).toFixed(2) + 'K';
      }
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Responsible Unit[Responsible Unit]': 'Total', '[CPF Total Expenses $]': Data.Grand_Expense
        }
      ]);
    }
  }
  updateCellStyle(tablecolumnlist: any) {
    tablecolumnlist.forEach((element, index) => {
      if (element.cellStyle) {
        // Lending Report
        if (element.cellStyle === 'OverallRisk') {
          tablecolumnlist[index].cellStyle = params => {
            return {
              backgroundColor: ((['S', 'H']).indexOf(params.value) !== -1) ? '#F0C1C1' :
                ((['M']).indexOf(params.value) !== -1) ? '#FFFC8F' :
                  ((['L']).indexOf(params.value) !== -1) ? '#D7F8D9' : '#fff'
            };
          };
        }

        if (element.cellStyle === 'conceptReview') {
          tablecolumnlist[index].cellStyle = params => {
            return { backgroundColor: (params.value !== '') ? '#D7F8D9' : '#fff' };
          };
        }

        if (element.cellStyle === 'conceptReviewStatus' || element.cellStyle === 'disclosurePID-ISDS') {
          tablecolumnlist[index].cellStyle = params => {
            return { backgroundColor: (params.value !== '') ? '#D7F8D9' : '#fff' };
          };
        }

        // Portfolio Report
        if (element.cellStyle === 'projectRatingsDO' || element.cellStyle === 'ProjectRatingsIP' ||
          element.cellStyle === 'ProjectRatingsFM' || element.cellStyle === 'ProjectRatingsPM') {
          tablecolumnlist[index].cellStyle = params => {
            return {
              backgroundColor: ((['U', 'MU']).indexOf(params.value) !== -1) ? '#F0C1C1' :
                ((['MS']).indexOf(params.value) !== -1) ? '#FFFC8F' :
                  ((['S', 'HS']).indexOf(params.value) !== -1) ? '#D7F8D9' : '#fff'
            };
          };
        }
      }

      if (element.cellClassRules) {
        // Lending Reports
        if (element.cellClassRules === 'OverallRisk') {
          tablecolumnlist[index].cellClassRules = params => {
            return {
              backgroundColor: ((['S', 'H']).indexOf(params.value) !== -1) ? 'backgroundlightred' :
                ((['M']).indexOf(params.value) !== -1) ? 'backgroundlightyellow' :
                  ((['L']).indexOf(params.value) !== -1) ? 'backgroundlightgreen' : 'backgroundwhite'
            };
          };
        }

        if (element.cellClassRules === 'conceptReview') {
          tablecolumnlist[index].cellClassRules = params => {
            return ((params.value) !== '') ? 'backgroundlightgreen' : 'backgroundwhite';
          };
        }

        if (element.cellClassRules === 'conceptReviewStatus' || element.cellClassRules === 'disclosurePID-ISDS') {
          tablecolumnlist[index].cellClassRules = params => {
            return ((params.value) !== '') ? 'backgroundlightgreen' : 'backgroundwhite';
          };
        }

        // Portfolio Report
        if (element.cellClassRules === 'projectRatingsDO' || element.cellClassRules === 'ProjectRatingsIP' ||
          element.cellClassRules === 'ProjectRatingsFM' || element.cellClassRules === 'ProjectRatingsPM') {
          tablecolumnlist[index].cellStyle = params => {
            return {
              backgroundColor: ((['U', 'MU']).indexOf(params.value) !== -1) ? 'backgroundlightred' :
                ((['MS']).indexOf(params.value) !== -1) ? 'backgroundlightyellow' :
                  ((['S', 'HS']).indexOf(params.value) !== -1) ? 'backgroundlightgreen' : 'backgroundwhite'
            };
          };
        }
      }
    });
    return tablecolumnlist;
  }
  LoadGrandTotal(selectedReport, Data, flag, gridApi) {
    if (selectedReport === 'Cl2.2b') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Lending IBRD Total Commitment $]': Data.Grand_IBRDCommitment,
          '[Lending IDA Total Commitment $]': Data.Grand_IDACommitment,
          '[Lending Others Total Commitment $]': Data.Grand_OtherCommitment,
          '[Lending Current FY BB+TF Expense $]': Data.Grand_CurrentBBTF,
          '[Lending Cumulative BB+TF Expense $]': Data.Grand_CummulativeBBTF
        }
      ]);
    } else if (selectedReport === 'Cl2.3b') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[Portfolio Total Net Commitment $]': Data.Grand_TotalCommitment,
          '[Portfolio IBRD Net Commitment $]': Data.Grand_IBRDCommitment,
          '[Portfolio IDA Net Commitment $]': Data.Grand_IDACommitment,
          '[Portfolio Cofinancing Commitment $]': Data.Grand_CofinancingCommitment
        }
      ]);
    } else if (selectedReport === 'PR1.1a') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Procurement Activity[Activity Reference Number]': 'Total',
          '[Procurement Activity Contract Cost $]': Data.Grand_ContractCost,
          '[Procurement Activity Estimate Budget $]': Data.Grand_EstimateBudget,
          '[Procurement Contract Current FY Actual Cost $]': Data.Grand_ActualCost,
          '[Procurement Contract Current FY Actual Contract Cost $]': Data.Grand_ActualContractCost
        }
      ]);
    } else if (selectedReport === 'PR1.2a') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Procurement Contract[Contract Number]': 'Total',
          '[Procurement Contract Current FY Actual Cost $]': Data.Grand_ActualContractCost
        }
      ]);
    } else if (selectedReport === 'Sg2.1') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Code]': 'Total', '[IBRD Total Commitment $]': Data.Grand_IBRDCommitment,
          '[IDA Total Commitment $]': Data.Grand_IDACommitment, '[Grant Commitment $]': Data.Grand_Commitment,
          '[Safeguard Project #]': Data.Grand_TotalPolicy
        }
      ]);
    } else if (selectedReport === 'Sg2.2' || selectedReport === 'Sg2.4') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Code]': 'Total', '[Project #]': Data.Grand_ProjectCount,
          '[Total Net Commitment $]': Data.Grand_TotalCommitment, '[IBRD Net Commitment $]': Data.Grand_IBRDCommitment,
          '[IDA Net Commitment $]': Data.Grand_IDACommitment, '[Other Net Commitment $]': Data.Grand_OtherCommitment,
          '[Cofinancing Net Commitment $]': Data.Grand_Cofinancing, '[Cofinancing Disbursement $]': Data.Grand_CofinancingDisbursement
        }
      ]);
    } else if (selectedReport === 'Sg2.3') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Region[Region Code]': 'Total', '[Project #]': Data.Grand_ProjectCount,
          '[Total Commitment $]': Data.Grand_TotalCommitment, '[IBRD Total Commitment $]': Data.Grand_IBRDCommitment,
          '[IDA Total Commitment $]': Data.Grand_IDACommitment, '[Other Total Commitment $]': Data.Grand_OtherCommitment
        }
      ]);
    } else if (selectedReport === 'ESF5.1') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[ESF #]': Data.Grand_ProjectCount, '[Total Commitment $]': Data.Grand_Commitment
        }
      ]);
    } else if (selectedReport === 'fm1.1') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Portfolio Total Net Commitment $]': Data.Grand_NetCommitment, '[Portfolio Total Disbursement $]': Data.Grand_CommitmentDisbursement,
          'FM[Supervision Overdue Time (Months)]': Data.Grand_SPNOverdue, '[FM Condition Overdue #]': Data.Grand_OverdueFMConditions,
          '[FM Condition Upcoming #]': Data.Grand_UpcomingFMConditions, '[FM Issues Overdue Supervision #]': Data.Grand_OverdueSupervision,
          '[FM Issues Upcoming #]': Data.Grand_UpcomingIssues, '[FM IFR Overdue Status (Months)]': Data.Grand_OverdueIFRStatus,
          '[FM IFR Upcoming #]': Data.Grand_UpcomingIFRReports, '[FM IFR Overdue #]': Data.Grand_OverdueIFRReports,
          '[FM Audit Missing Arrangement #]': Data.Grand_MissingAuditArrangement, '[FM Audit Elimination #]': Data.Grand_EliminatedAuditArrangement
        }
      ]);
    } else if (selectedReport === 'fm3.9') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Portfolio Total Net Commitment $]': Data.Grand_NetTotalCommitment, '[Portfolio Total Disbursement $]': Data.Grand_DisbTotalCommitment
        }
      ]);
    } else if (selectedReport === 'fm2.7a') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[FM Schedule IFR Total Commitment $]': Data.Grand_TotalCommitment,
          '[FM Schedule IFR Total Net Commitment $]': Data.Grand_NetTotalCommitment, '[FM Schedule IFR Total Disbursement $]': Data.Grand_DisbTotalCommitment
        }
      ]);
    } else if (selectedReport === 'fm2.7b') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[FM Schedule Audit Total Commitment $]': Data.Grand_TotalCommitment,
          '[FM Schedule Audit Total Net Commitment $]': Data.Grand_NetTotalCommitment, '[FM Schedule Audit Total Disbursement $]': Data.Grand_DisbTotalCommitment
        }
      ]);
    } else if (selectedReport === 'fm3.1') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Portfolio Total Net Commitment $]': Data.Grand_NetCommitment, '[Portfolio Total Disbursement $]': Data.Grand_DisbCommitment
        }
      ]);
    } else if (selectedReport === 'fm3.4a') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[FM Schedule Audit Total Commitment $]': Data.Grand_TotalCommitment,
          '[FM Schedule Audit Total Net Commitment $]': Data.Grand_NetTotalCommitment, '[FM Schedule Audit Total Disbursement $]': Data.Grand_DisbTotalCommitment
        }
      ]);
    } else if (selectedReport === 'fm3.8') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Project Total Cumulative Expenses $]': Data.Grand_TotalCommitment,
          '[Portfolio Total Net Commitment $]': Data.Grand_NetTotalCommitment, '[Portfolio Total Disbursement $]': Data.Grand_DisbTotalCommitment
        }
      ]);
    } else if (selectedReport === 'Cl1.1a' || selectedReport === 'Cl1.1b' || selectedReport === 'Cl1.1c' || selectedReport === 'Cl1.1d') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Global Practice[Global Practice Name]': 'Total',
          '[Collaboration Lead GP Total Commitment $]': Data.Grand_CollaborationLeadGPTotalCommitment,
          '[Collaboration Contributing GP Total Commitment $]': Data.Grand_CollaborationContributingGPTotalCommitment,
          '[Collaboration Lead GP Project #]': Data.Grand_CollaborationLeadGPProject,
          '[Collaboration Contributing GP Project #]': Data.Grand_CollaborationContributingGPProject
        }
      ]);
    } else if (selectedReport === 'fm3.5') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Total Commitment $]': Data.Grand_TotalCommitment,
          '[Total Net Commitment $]': Data.Grand_NetTotalCommitment, '[Total Disbursement $]': Data.Grand_DisbTotalCommitment
        }
      ]);
    } else if (selectedReport === 'fm3.10') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Lending Total Commitment $]': Data.Grand_TotalCommitment,
          '[Portfolio Total Net Commitment $]': Data.Grand_NetCommitment, '[Portfolio Total Disbursement $]': Data.Grand_DisbCommitment
        }
      ]);
    } else if (selectedReport === 'ST3.5') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          '[Task Id]': 'Total'
        }
      ]);
    } else if (selectedReport === 'ST4.1') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Sector and Theme Project #]': Data.Grand_SectorThemeCount,
          '[Total Commitment $]': Data.Grand_TotalCommitment,
          // '[Sector and Theme Lending Commitment $]': Data.Grand_SectorThemeCommitment,
          '[IBRD Commitment $]': Data.Grand_IBRDCommitment, '[IDA Commitment $]': Data.Grand_IDACommitment,
          '[Other Commitment $]': Data.Grand_OtherCommitment, '[Cofinancing $]': Data.Grand_CofinancingCommitment
        }
      ]);
    } else if (selectedReport === 'ST4.2') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[Sector and Theme Project #]': Data.Grand_SectorThemeCount,
          '[Total Net Commitment $]': Data.Grand_TotalCommitment,
          // '[Sector and Theme Lending Commitment $]': Data.Grand_SectorThemeCommitment,
          '[IBRD Net Commitment $]': Data.Grand_IBRDCommitment, '[IDA Net Commitment $]': Data.Grand_IDACommitment,
          '[Other Net Commitment $]': Data.Grand_OtherCommitment, '[Cofinancing $]': Data.Grand_CofinancingCommitment
        }
      ]);
    } else if (selectedReport === 'fm3.4b') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total', '[FM Schedule Audit Total Commitment $]': Data.Grand_AuditTotalCommitment,
          '[FM Schedule Audit Total Net Commitment $]': Data.Grand_AuditNetCommitment, '[FM Schedule Audit Total Disbursement $]': Data.Grand_AuditDisbursement
        }
      ]);
    } else if (selectedReport === 'ST4.1a' || selectedReport === 'ST4.1b' || selectedReport === 'ST4.1c' || selectedReport === 'ST4.1d') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[Project #]': Data.Grand_SectorThemeCount,
          '[Total Commitment $]': Data.Grand_TotalCommitment,
          '[Sector/Theme Net Commitment $]': Data.Grand_SectorThemeCommitment,
          '[IBRD Commitment $]': Data.Grand_IBRDCommitment,
          '[IDA Commitment $]': Data.Grand_IDACommitment,
          '[Other Commitment $]': Data.Grand_OtherCommitment,
          '[Cofinancing $]': Data.Grand_CofinancingCommitment
        }
      ]);
    } else if (selectedReport === 'ST4.2a' || selectedReport === 'ST4.2b') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          'Project[Project Id]': 'Total',
          '[Project #]': Data.Grand_SectorThemeCount,
          '[Total Net Commitment $]': Data.Grand_TotalCommitment,
          '[Sector/Theme Net Commitment $]': Data.Grand_SectorThemeCommitment,
          '[IBRD Net Commitment $]': Data.Grand_IBRDCommitment,
          '[IDA Net Commitment $]': Data.Grand_IDACommitment,
          '[Other Net Commitment $]': Data.Grand_OtherCommitment,
          '[Cofinancing $]': Data.Grand_CofinancingCommitment
        }
      ]);
    } else if (selectedReport === 'ST4.3a' || selectedReport === 'ST4.3b' || selectedReport === 'ST4.3c' || selectedReport === 'ST4.3d') {
      gridApi.setGridOption('pinnedBottomRowData', [
        {
          '[Task Id]': 'Total',
          '[Project #]': Data.Grand_SectorThemeCount
        }
      ]);
    }
  }
  getNumberLoad() {
    const speed = 2;
    function incEltNbr(id, increament) {
      const elt = document.getElementById(id);
      const endNbr = Number(document.getElementById(id).innerHTML);
      incNbrRec(0, endNbr, elt, increament);
    }

    /*A recursive function to increase the number.*/
    function incNbrRec(i, endNbr, elt, increament) {
      if (i <= endNbr) {
        elt.innerHTML = i;
        setTimeout(function () {
          incNbrRec(i + increament, endNbr, elt, increament);
        }, speed);
      }
    }
    incEltNbr('nbr', 5), incEltNbr('nbr1', 1), incEltNbr('nbrs', 5), incEltNbr('nbr3', 2);
  }
  LoadFilterData() {
    let refinedaxData: any = []; let filterjsonData: any = []; let ModuleName = '';
    /*if (window.location.pathname.indexOf('lending') !== -1 || (window.location.pathname.indexOf('Lending') !== -1)) {
      filterjsonData = this.getFacetsConfigJSON('lending');
      ModuleName = 'lending';
    }*/
    if (window.location.pathname.indexOf('lending') !== -1 || window.location.pathname.indexOf('Lending') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('lending');
      ModuleName = 'lending';
    } else if (window.location.pathname.indexOf('tf/landing-fifs/portfolioview-report') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tf-summary-report');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('portfolio') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('portfolio');
      ModuleName = 'portfolio';
    } else if (window.location.pathname.indexOf('infrastructure') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('infrastructure');
      ModuleName = 'infrastructure';
    } else if (window.location.pathname.indexOf('asa') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('asa');
      ModuleName = 'asa';
    } else if (window.location.pathname.indexOf('/rasdashboard') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('rasdashboard');
      ModuleName = 'rasdashboard';
    } else if (window.location.pathname.indexOf('ras') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('ras');
      ModuleName = 'ras';
    } else if (window.location.pathname.indexOf('knowledge') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('knowledge');
      ModuleName = 'knowledge';
    } else if (window.location.pathname.indexOf('cpf') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('cpf');
      ModuleName = 'cpf';
    } else if (window.location.pathname.indexOf('risk') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('risk');
      ModuleName = 'risk';
    } else if (window.location.pathname.indexOf('collaboration') !== -1 && window.location.pathname.indexOf('bps') === -1) {
      filterjsonData = this.getFacetsConfigJSON('collaboration');
      ModuleName = 'collaboration';
    } else if (window.location.pathname.indexOf('procurement') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('procurement');
      ModuleName = 'procurement';
    } else if (window.location.pathname.indexOf('financialmanagement') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('financialmanagement');
      ModuleName = 'financialmanagement';
    } else if (window.location.pathname.indexOf('safeguards') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('safeguards');
      ModuleName = 'safeguards';
    } else if (window.location.pathname.indexOf('esf') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('esf');
      ModuleName = 'esf';
    } else if (window.location.pathname.indexOf('sectorsthemes') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('sectorsthemes');
      ModuleName = 'sectorsthemes';
    } else if (window.location.pathname.indexOf('gender') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('gender');
      ModuleName = 'gender';
    } else if (window.location.pathname.indexOf('tflifecycle') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tflifecycle');
      ModuleName = 'tflifecycle';
    } else if (window.location.pathname.indexOf('businessunitviews') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('businessunitviews');
      ModuleName = 'businessunitviews';
    } else if (window.location.pathname.indexOf('mvp') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('mvp');
      ModuleName = 'mvp';
    } else if (window.location.pathname.indexOf('fact') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('fact');
      ModuleName = 'fact';
    } else if (window.location.pathname.indexOf('tfp') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tfp');
      ModuleName = 'tfp';
    } else if (window.location.pathname.indexOf('cof') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('cof');
      ModuleName = 'cof';
    } else if (window.location.pathname.indexOf('disbursingaccounts') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('disbursingaccounts');
      ModuleName = 'disbursingaccounts';
    } else if (window.location.pathname.indexOf('agreementsigned') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('agreementsigned');
      ModuleName = 'agreementsigned';
    } else if (window.location.pathname.indexOf('tfgrants') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tfgrants');
      ModuleName = 'tfgrants';
    } else if (window.location.pathname.indexOf('/tf') !== -1 && this.TFHomepageTab === 'FIFs') {
      filterjsonData = this.getFacetsConfigJSON('fifsportfolioviews');
      ModuleName = 'fifsportfolioviews';
    } else if (window.location.pathname.indexOf('tf/landing-fifs/tf-summary-report') !== -1 || window.location.pathname.indexOf('tf/landing-fifs/fif-summary-report') !== -1 || window.location.pathname.indexOf('/tf/landing-fifs/portfolioview-report')) {
      filterjsonData = this.getFacetsConfigJSON('tf-summary-report');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('/tf') !== -1 && window.location.pathname.indexOf('/landing-fifs')) {
      filterjsonData = this.getFacetsConfigJSON('fifsportfolioviews');
      ModuleName = 'fifsportfolioviews';
    }
    this.FilterLoad = new Observable(data => {
      if (this.PageModuleName === ModuleName && filterjsonData.length > 0) {
        data.next(this.FilerResponse);
        data.complete();
      } else {
        let envdatasourceData: any;
        if (window.location.pathname.indexOf('tf/tflifecycle') !== -1 || window.location.pathname.indexOf('tf/businessunitviews') !== -1 || window.location.pathname.indexOf('tf/fact') !== -1) {
          envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport');
        } else if (window.location.pathname.indexOf('tf/mvp') !== -1) {
          envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport_umb_report');
        } else {
          envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'SR-App-AllProduct');
        }
        filterjsonData.forEach((element, index) => {
          element.children.forEach((element1, index1) => {
            const temprefinedaxQuery = {
              IgnoreCache: true,
              id: 1,
              title: (element1['title'] === '') ? element['title'] : element1['title'],
              query: element1.baseQuery,
              measureQuery: element1.measureQuery,
              // dataSource: 'Corporate - Operations',
              // dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
              InitialCatalog: envdatasourceData[0].InitialCatalog,
              dataSource: envdatasourceData[0].dataSource,
              dataSetId: envdatasourceData[0].dataSetId
            };
            this.getrefineByResponse(temprefinedaxQuery).subscribe(data1 => {
              filterjsonData[index].children[index1].data = data1;
              refinedaxData = data1;
            });
          });
        });
        this.FilerResponse = filterjsonData;
        data.next(this.FilerResponse);
        data.complete();
      }
    }).pipe(shareReplay());
    return this.FilterLoad;

  }
  getrefineByResponse(temprefinedaxQuery: any) {
    return this.http.post(this.dashboardReqURL, temprefinedaxQuery).pipe(map((data: any) => {
      return data.results[0].tables[0].rows;
    }));
  }

  // Get the Facets config JSON file
  getFacetsConfigJSON(facetsKey: string): any[] {
    // console.log('facetsKey ==>', facetsKey);
    // debugger;
    switch (facetsKey.toLowerCase()) {
      case 'lending':
        return cloneDeep(lendingFacetsConfig);
      case 'portfolio':
        return cloneDeep(portfolioFacetsConfig);
      case 'asa':
        return cloneDeep(asaFacetsConfig);
      case 'ras':
        return cloneDeep(rasFacetsConfig);
      case 'knowledge':
        return cloneDeep(knowledgeFacetsConfig);
      case 'cpf':
        return cloneDeep(cpfFacetsConfig);
      case 'collaboration':
        return cloneDeep(collaborationFacetsConfig);
      case 'risk':
        return cloneDeep(riskFacetsConfig);
      case 'safeguards':
        return cloneDeep(safeguardFacetsConfig);
      case 'esf':
        return cloneDeep(esfFacetsConfig);
      case 'procurement':
        return cloneDeep(procurementFacetsConfig);
      case 'financialmanagement':
        return cloneDeep(fmFacetsConfig);
      case 'infrastructure':
        return cloneDeep(infrastructureFacetsConfig);
      case 'sectorsthemes':
        return cloneDeep(sectorsandthemesFacetsConfig);
      case 'gender':
        return cloneDeep(genderFacetsConfig);
      case 'bps':
        return cloneDeep(rmFacetsConfig);
      case 'hr':
        return cloneDeep(hrFacetsConfig);
      case 'fa':
        return cloneDeep(faFacetsConfig);
      case 'tflifecycle':
        return cloneDeep(tfLifecycleFacetsConfig);
      case 'mvp':
        return cloneDeep(MVPFacets);
      case 'tfp':
        return cloneDeep(TfpFacets);
      case 'cof':
        return cloneDeep(CoFFacets);
      case 'disbursingaccounts':
        return cloneDeep(DisbursingAccFacets);
      case 'agreementsigned':
        return cloneDeep(AgreementSignedFacets);
      case 'tfgrants':
        return cloneDeep(TfGrantsFacets);
      case 'businessunitviews':
        return cloneDeep(BusinessUnitViewsFacets);
      case 'fact':
        return cloneDeep(factFacetsConfig);
      case 'fifsportfolioviews':
        return cloneDeep(portfolioViewsFacetsConfig);
      case 'rasdashboard':
        return cloneDeep(rasdashboardFacetsConfig);
      case 'tf-summary-report':
        return cloneDeep(fifsummaryReportConfig);
      default:
        return [];
    }
  }

  drillthroughclick(drillID, reportkey) {
    const dataJson = {
      drilldownID: drillID,
      reportKey: reportkey,
      sectionName: this.PageModuleName
    };
    // tslint:disable-next-line:no-console
    //  console.log('routeParams', this.fwService.apiGetAppData('routeParams'));
    this.drillthroughreport(dataJson);
  }
  drillthroughvalueclick(drillID, reportkey, selectedQuarter, selectedFlag) {
    const dataJson = {
      drilldownID: drillID,
      reportKey: reportkey,
      sectionName: this.PageModuleName,
      xaxisCategory: selectedQuarter,
      category: selectedFlag
    };
    // tslint:disable-next-line:no-console
    //  console.log('routeParams', this.fwService.apiGetAppData('routeParams'));
    this.drillthroughreport(dataJson);
  }
  drillthroughreportvalueclick(drillID, reportkey, selectedQuarter, selectedFlag, name, value) {
    const dataJson = {
      drilldownID: drillID,
      reportKey: reportkey,
      sectionName: this.PageModuleName,
      xaxisCategory: selectedQuarter,
      category: selectedFlag,
      selectedName: name,
      selectedValue: value
    };
    this.drillthroughreport(dataJson);
  }
  drillthroughreport(data: any) {
    this.FavReportData = '';
    this.selectedDrillWidgetDetail = [];
    // this.srServicesService.reportsDetails = data;
    const reportkey = data.reportKey;
    const drillthroughselectedWidget = data;
    this.selectedDrillWidgetDetail.push(drillthroughselectedWidget);
    // tslint:disable-next-line:no-console
    const path = window.location.pathname;
    const PathName = path.split('/');
    const urls = this.router.url.split('/');
    let filterdata = {};
    if (data.sectionName === 'lending') {
      filterdata = {
        category: 'Small RE',
        value: 'N',
        name: 'Small RE',
        id: 'len2%10',
      };
    }
    if (data.sectionName === 'portfolio') {
      filterdata = {
        category: 'Small RE',
        value: 'N',
        name: 'Small RE',
        id: 'prt2%9',
      };
    }
    if (data.sectionName === 'safeguards') {
      filterdata = {
        category: 'Small RE',
        value: 'N',
        name: 'Small RE',
        id: 'safegrd2%9',
      };
    }
    if (data.sectionName === 'gender' && this.facetFilter.length === 0) {
      filterdata = {
        category: 'Approval FY',
        value: '2024',
        name: '2024',
        id: 'gndr1%5',
        facetType: '\'Project Key Dates\'[Approval FY]',
        Typenumber: 'number'
      };
    }
    const queryParams: any = {}; const values = [];
    if (data.sectionName === 'lending' || data.sectionName === 'portfolio' || data.sectionName === 'safeguards'
      || (data.sectionName === 'gender' && this.facetFilter.length === 0)) {
      this.facetFilter.push(filterdata);
    }
    if (this.facetFilter.length > 0) {
      this.facetFilter.forEach(x => {
        const datas1 = x.id + '~' + x.value;
        values.push(datas1);
      });
      this.facetFilterQueryParams = JSON.stringify(values);
      queryParams.filter = JSON.stringify(values);
    }
    queryParams.filter = JSON.stringify(values);
    if (urls.indexOf('region') !== -1 || urls.indexOf('country') !== -1 || urls.indexOf('practicegroup') !== -1
      || urls.indexOf('requnit') !== -1 || urls.indexOf('resunit') !== -1 || urls.indexOf('dirun') !== -1) {
      this.router.navigate(['/ops/' + PathName[2] + '/' + PathName[3] + '/report/' + PathName[4] + '/' + reportkey]);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      if (this.facetFilter.length > 0) {
        this.router.navigate(['/report/' + data.sectionName + '/' + reportkey], navigationExtras);
      } else {
        this.router.navigate(['/report/' + data.sectionName + '/' + reportkey]);
      }
    }
  }
  Favdrillthroughreport(data: any, DrillData: any, params: any) {
    this.selectedDrillWidgetDetail = [];
    const reportkey = data.reportid;
    const drillthroughselectedWidget = DrillData;
    this.selectedDrillWidgetDetail.push(drillthroughselectedWidget);
    this.router.navigate([data.url], params);
  }
  LoadFilterJsonData() {
    let filterjsonData: any = [];
    if (window.location.pathname.indexOf('lending') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('lending');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('tf/landing-fifs/portfolioview-report') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tf-summary-report');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('portfolio') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('portfolio');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('infrastructure') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('infrastructure');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('asa') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('asa');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('/rasdashboard') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('rasdashboard');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('ras') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('ras');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('knowledge') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('knowledge');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('cpf') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('cpf');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('risk') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('risk');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('collaboration') !== -1 && window.location.pathname.indexOf('bps') === -1) {
      filterjsonData = this.getFacetsConfigJSON('collaboration');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('procurement') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('procurement');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('financialmanagement') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('financialmanagement');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('safeguards') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('safeguards');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('esf') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('esf');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('sectorsthemes') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('sectorsthemes');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('gender') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('gender');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('bps') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('bps');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('hr') !== -1 || window.location.pathname.indexOf('hr-dashboard') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('hr');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('tflifecycle') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tflifecycle');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('mvp') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('mvp');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('tfp') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tfp');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('cof') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('cof');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('disbursingaccounts') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('disbursingaccounts');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('agreementsigned') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('agreementsigned');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('tfgrants') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tfgrants');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('tf/report/businessunitviews') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('businessunitviews');
      filterjsonData = filterjsonData.filter(data => data.reportView === true);
      return filterjsonData;
    } else if (window.location.pathname.indexOf('businessunitviews') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('businessunitviews');
      filterjsonData = filterjsonData.filter(data => data.reportView !== true);
      return filterjsonData;
    } else if (window.location.pathname.indexOf('fact') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('fact');
      return filterjsonData;
    } else if (window.location.pathname.indexOf('tf/landing-fifs/tf-summary-report') !== -1 || window.location.pathname.indexOf('tf/landing-fifs/fif-summary-report') !== -1 || window.location.pathname.indexOf('tf/landing-fifs/portfolioview-report') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('tf-summary-report');
      return filterjsonData;
    } else if ((window.location.pathname.indexOf('/tf') !== -1 || window.location.pathname.indexOf('/fifs') !== -1) && this.TFHomepageTab === 'FIFs') {
      filterjsonData = this.getFacetsConfigJSON('fifsportfolioviews');
      return filterjsonData;
    } else if ((window.location.pathname.indexOf('/tf') !== -1 && window.location.pathname.indexOf('/landing-fifs') !== -1)) {
      filterjsonData = this.getFacetsConfigJSON('fifsportfolioviews');
      return filterjsonData;
    } if (window.location.pathname.indexOf('accounting') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('fa');
      return filterjsonData;
    }
  }
  LoadAccountingFilterJsonData() {
    let filterjsonData: any = [];
    if (window.location.pathname.indexOf('accounting') !== -1) {
      filterjsonData = this.getFacetsConfigJSON('fa');
      return filterjsonData;
    }
  }
  // Get SR refiner
  getFilterChildData(element1) {
    let envdatasourceData: any;
    if (window.location.pathname.indexOf('/tfp') !== -1 || window.location.pathname.indexOf('/cof') !== -1
      || window.location.pathname.indexOf('/disbursingaccounts') !== -1 || window.location.pathname.indexOf('/agreementsigned') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'TF-Home_App');
    } else if (window.location.pathname.indexOf('/tf1') !== -1 && this.TFHomepageTab === 'FIFs') {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'ExternalFunds_FIF_Inflows');
    } else if (window.location.pathname.indexOf('/tf/landing-fifs/tf-summary-report') !== -1 || window.location.pathname.indexOf('/tf/landing-fifs/fif-summary-report') !== -1 || window.location.pathname.indexOf('/tf/landing-fifs/portfolioview-report') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'FIFs_Summary_Report');
    } else if (window.location.pathname.indexOf('/tf') !== -1 && window.location.pathname.indexOf('/landing-fifs') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'ExternalFunds_FIF_Inflows');
    } else if (window.location.pathname.indexOf('tf/mvp') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport_umb_report');
    } else if (window.location.pathname.indexOf('tf/ibrdidatfs/mvp') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport_umb_report');
    } else if (window.location.pathname.indexOf('tf/tflifecycle') !== -1 || window.location.pathname.indexOf('tf/businessunitviews') !== -1 || window.location.pathname.indexOf('tf/fact') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport');
    } else if (window.location.pathname.indexOf('tf/ibrdidatfs/tflifecycle') !== -1 || window.location.pathname.indexOf('tf/ibrdidatfs/businessunitviews') !== -1 || window.location.pathname.indexOf('tf/ibrdidatfs/fact') !== -1 || window.location.pathname.indexOf('/tfgrants') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport');
    } else if (window.location.pathname.indexOf('tf/report/businessunitviews') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport');
    } else {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'SR-App-AllProduct');
    } //
    const temprefinedaxQuery = {
      IgnoreCache: true,
      id: 1,
      title: element1['title'],
      query: element1.baseQuery,
      measureQuery: element1.measureQuery,
      // dataSource: 'Corporate - Operations',
      // dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
      dataSource: envdatasourceData[0].dataSource,
      InitialCatalog: envdatasourceData[0].InitialCatalog,
      dataSetId: envdatasourceData[0].dataSetId
    };
    return this.http.post(this.dashboardReqURL, temprefinedaxQuery).pipe(map((data: any) => {
      return data.results[0].tables[0].rows;
    }));
  }
  // Get TF SR refiner
  getTfFilterChildData(element1) {
    let envdatasourceData: any;
    if (window.location.pathname.indexOf('/tfp') !== -1 || window.location.pathname.indexOf('/cof') !== -1
      || window.location.pathname.indexOf('/disbursingaccounts') !== -1 || window.location.pathname.indexOf('/agreementsigned') !== -1 || window.location.pathname.indexOf('/tfgrants') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'TF-Home_App');
    } else if (window.location.pathname.indexOf('/tf') !== -1 && this.TFHomepageTab === 'FIFs') {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'ExternalFunds_FIF_Inflows');
    } else if (window.location.pathname.indexOf('mvp') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport_umb_report');
    } else if (window.location.pathname.indexOf('tflifecycle') !== -1 || window.location.pathname.indexOf('businessunitviews') !== -1 || window.location.pathname.indexOf('fact') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport');
    } else if (window.location.pathname.indexOf('businessunitviews') !== -1) {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'tfreport');
    } else {
      envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === 'SR-App-AllProduct');
    } //
    const temprefinedaxQuery = {
      IgnoreCache: true,
      id: 1,
      title: element1['title'],
      query: element1.baseQuery,
      measureQuery: element1.measureQuery,
      // dataSource: 'Corporate - Operations',
      // dataSetId: '249caffe-c19b-452b-ad6a-c5e3516fa1c3'
      dataSource: envdatasourceData[0].dataSource,
      InitialCatalog: envdatasourceData[0].InitialCatalog,
      dataSetId: envdatasourceData[0].dataSetId
    };
    return this.http.post(this.dashboardReqURL, temprefinedaxQuery).pipe(map((data: any) => {
      return data.results[0].tables[0].rows;
    }));
  }
  // Get RM refiner
  getrmFilterChildData(category: any) {
    const jsondata = {
      queries: [
        {
          query: category.baseQuery

        }
      ],
      serializerSettings: {
        includeNulls: true
      }
    };
    const envdatasourceData = this.EnvDatasourceDetails.filter(x => x.name === category.environmentName);
    // tslint:disable-next-line:no-console
    console.log(category.title, ' Request URL ==>', 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries', ' : JSONData =>', jsondata);
    const reqURL = 'https://api.powerbi.com/v1.0/myorg/datasets/' + envdatasourceData[0].dataSetId + '/executeQueries';
    return this.http.post(reqURL, jsondata).pipe(map((resdata: any) => {
      return resdata.results[0].tables[0].rows;
    }));
  }

  GetApplyFilter() {
    const datas = this.facetFilter;
    const values = [];
    datas.forEach(x => {
      if (x.category === 'Region') {
        x.id = 'len1%9';
      }
      if (x.category === 'Country') {
        x.id = 'len2%9';
      }
      if (x.category === 'Practice Group') {
        x.id = 'len1%11';
      }
      if (x.category === 'Requesting Unit') {
        x.id = 'len2%12';
      }
      if (x.category === 'Responsible Unit') {
        x.id = 'len3%11';
      }
      if (x.category === 'Director Unit') {
        x.id = 'len2%11';
      }
      // tslint:disable-next-line:no-shadowed-variable
      const datas = x.id + '~' + x.value;
      values.push(datas);
    });
    const queryParams: any = {};
    if (values.length > 0) {
      queryParams.filter = JSON.stringify(values);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      return navigationExtras;
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      return navigationExtras;
    }
  }
  GetTfApplyFilter() {
    const datas = this.facetFilter;
    const values = [];
    datas.forEach(x => {
      const datas1 = x.id + '~' + x.value;
      values.push(datas1);
    });
    const queryParams: any = {};
    if (values.length > 0) {
      queryParams.filter = JSON.stringify(values);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      return navigationExtras;
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      return navigationExtras;
    }
  }
  async SuccessToast(message) {
    // tslint:disable-next-line:no-shadowed-variable
    // const Swal = require('sweetalert2');
    /*const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: true,
      timer: 10000,
      timerProgressBar: true
    });
    await Toast.fire({
      icon: 'success',
      title: message
    });*/
    Swal.fire(
      message,
      '',
      'success'
    );
  }
  async ErrorToast(message) {
    // tslint:disable-next-line:no-shadowed-variable
    /* const Swal = require('sweetalert2');
     const Toast = Swal.mixin({
       toast: true,
       position: 'top-right',
       iconColor: 'white',
       customClass: {
         popup: 'colored-toast'
       },
       showConfirmButton: true,
       timer: 10000,
       timerProgressBar: true
     });
     await Toast.fire({
       icon: 'error',
       title: message
     });*/
    Swal.fire(
      message,
      '',
      'error'
    );
  }
  onGoToHome() {
    this.FavReportData = '';
    const combineParams = {
      module: 'Standard Reports',
      section: 'Home',
      path: window.location.pathname,
      Facets: ''
    };
    this.facetFilter = [];
    this.facetFilterQueryParams = '';
    this.fwService.apiSetAppData('routeParams', combineParams);
    this.loadappData();
    if (window.location.pathname.indexOf('/tf') !== -1) {
      this.tftabmodule = 'Overview';
      this.facetFilter = [];
      this.customFilter = '';
      this.TFHomepageTab = 'Overview';
      this.router.navigate(['/tf']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  public exportPBIReport(groupId, reportId) {
    /* const httpHeaders = new HttpHeaders(
      {
        Accept: 'application/zip'
      });
    return this.http.get(this.powerBIReportexportReq + '/api/PowerBIRS/exportPowerBIReport?groupId=' + groupId + '&reportId=' + reportId,
      { headers: httpHeaders, responseType: 'blob' }); */
    return this.http.get('https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports/' + reportId + '/Export',
      { responseType: 'blob' });
  }
  public righttrialToggle() {
    this.fwService.apiToggleRightNav(false);
  }

  // For testing
  daxJSONreq() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    const testrequrl = this.powerBIReportexportReq + '/api/PowerBIRS/getJSONDaxQueryResult?WidgetID=lendingwid&Level=region&code=ECA';
    return this.http.get(testrequrl).pipe(map((resdata: any) => {
      // tslint:disable-next-line:no-console
      console.log('jsondax result ==>', resdata);
      return resdata;
    }));
  }
  getFormaterValues(selectedSection, report) {
    if (report === 'L3.3' || report === 'L9.3' || report === 'L9.4' || report === 'L9.6' || report === 'L10.5' || report === 'P1.3c' || report === 'P1.4b'
      || report === 'P1.5b' || report === 'P1.5c' || report === 'P1.6' || report === 'P5.6' || report === 'P5.7' || report === 'P5.8' || report === 'P5.9'
      || report === 'P5.10' || report === 'P1.7a' || report === 'A8.1' || report === 'A8.2' || report === 'A8.4' || report === 'A8.8' || report === 'A8.9'
      || report === 'RAS1.1' || report === 'RAS1.2' || report === 'RAS1.3' || report === 'RAS1.4' || report === 'RAS1.7' || report === 'C3.2' || report === 'K1.3'
      || report === 'Cl2.3b' || report === 'PR1.1a' || report === 'PR1.2a' || report === 'fm1.1' || report === 'fm3.1' || report === 'fm3.4a' || report === 'fm3.4b'
      || report === 'fm3.5' || report === 'fm3.8' || report === 'fm3.9' || report === 'fm3.10' || report === 'fm2.7a' || report === 'fm2.7b' || report === 'Sg2.1'
      || report === 'Sg2.2' || report === 'Sg2.3' || report === 'Sg2.4' || report === 'ESF5.1' || report === 'ST4.1' || report === 'ST4.2' || report === 'Gen1.3') {
      this.sectionReportColumnlist.forEach(element => {
        if (element.TotalComm !== undefined) {
          element.TotalComm = {
            'field': '[Total Commitment]',
            'headerName': 'Total Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Gen1.3' && element.PECofinance !== undefined) {
          element.PECofinance = {
            'field': '[PE Cofinance $]',
            'headerName': 'CO-Financing($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Gen1.3' && element.PECofinance !== undefined) {
          element.PECofinance = {
            'field': '[PE Cofinance]',
            'headerName': 'Co-Financing',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.FYExpBBTF !== undefined) {
          element.FYExpBBTF = {
            'field': 'FYExpBBTF',
            'headerName': 'FY Exp.(BB + TF)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (report === 'fm3.8' && element.TotalCommitment !== undefined) {
          element.TotalCommitment = {
            'field': '[Project Total Cumulative Expenses $]',
            'headerName': 'Total Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if ((report === 'Sg2.3' || report === 'ST4.1' || report === 'Gen1.3') && element.TotalCommitment !== undefined) {
          element.TotalCommitment = {
            'field': '[Total Commitment $]',
            'headerName': 'Commitments ($M) - Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ESF5.1' && element.TotalCommitment !== undefined) {
          element.TotalCommitment = {
            'field': '[Total Commitment $]',
            'headerName': 'Commitments ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if ((report !== 'fm3.8' && report !== 'Sg2.3' && report !== 'ESF5.1' && report !== 'ST4.1' && report !== 'Gen1.3') && element.TotalCommitment !== undefined) {
          element.TotalCommitment = {
            'field': '[Lending Total Commitment $]',
            'headerName': 'Total Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Sg2.1' && element.IBRDTotalCommitment !== undefined) {
          element.IBRDTotalCommitment = {
            'field': '[IBRD Total Commitment $]',
            'headerName': 'IBRD Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Gen1.3' && element.IBRDTotalCommitment !== undefined) {
          element.IBRDTotalCommitment = {
            'field': '[IBRD Total Commitment $]',
            'headerName': 'Commitments($M) - IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Sg2.1' && report !== 'Gen1.3' && element.IBRDTotalCommitment !== undefined) {
          element.IBRDTotalCommitment = {
            'field': '[Lending IBRD Total Commitment $]',
            'headerName': 'IBRD Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Sg2.1' && element.IDATotalCommitment !== undefined) {
          element.IDATotalCommitment = {
            'field': '[IDA Total Commitment $]',
            'headerName': 'IDA Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Gen1.3' && element.IDATotalCommitment !== undefined) {
          element.IDATotalCommitment = {
            'field': '[IDA Total Commitment $]',
            'headerName': 'Commitments($M) - IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Sg2.1' && report !== 'Gen1.3' && element.IDATotalCommitment !== undefined) {
          element.IDATotalCommitment = {
            'field': '[Lending IDA Total Commitment $]',
            'headerName': 'IDA Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Sg2.3' && element.OtherCommitment !== undefined) {
          element.OtherCommitment = {
            'field': '[Other Total Commitment $]',
            'headerName': 'Commitments ($M) - Others',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.1' && element.OtherCommitment !== undefined) {
          element.OtherCommitment = {
            'field': '[Other Commitment $]',
            'headerName': 'Commitment - ($M) - Other',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if ((report !== 'Sg2.3' && report !== 'ST4.1') && element.OtherCommitment !== undefined) {
          element.OtherCommitment = {
            'field': '[Lending Others Total Commitment $]',
            'headerName': 'Others Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LendingPECofinance !== undefined) {
          element.LendingPECofinance = {
            'field': '[Lending PE Cofinance $]',
            'headerName': 'Co-financing',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Cl2.2b' && element.FYBBTFExpense !== undefined) {
          element.FYBBTFExpense = {
            'field': '[Lending Current FY BB+TF Expense $]',
            'headerName': 'FY Exp. BB+TF',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Cl2.2b' && element.FYBBTFExpense !== undefined) {
          element.FYBBTFExpense = {
            'field': '[Lending Current FY BB+TF Expense $]',
            'headerName': 'FY BB+TF Expense',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (report === 'Cl2.2b' && element.CumulativeBBTFExpense !== undefined) {
          element.CumulativeBBTFExpense = {
            'field': '[Lending Cumulative BB+TF Expense $]',
            'headerName': 'Cum. Exp. BB+TF',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Gen1.3' && element.CumulativeBBTFExpense !== undefined) {
          element.CumulativeBBTFExpense = {
            'field': '[Cumulative BB+TF Expense $]',
            'headerName': 'Cum. Exp. BB+TF($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (report !== 'Cl2.2b' && report !== 'Gen1.3' && element.CumulativeBBTFExpense !== undefined) {
          element.CumulativeBBTFExpense = {
            'field': '[Lending Cumulative BB+TF Expense $]',
            'headerName': 'Cumulative BB+TF Expense',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.TotalCommitmentAmount !== undefined) {
          element.TotalCommitmentAmount = {
            'field': '[Total Commitment Amount]',
            'headerName': 'Total Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IBRDCommitmentAmount !== undefined) {
          element.IBRDCommitmentAmount = {
            'field': '[IBRD Commitment Amount]',
            'headerName': 'IBRD Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDACommitmentAmount !== undefined) {
          element.IDACommitmentAmount = {
            'field': '[IDA Commitment Amount]',
            'headerName': 'IDA Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.OtherCommitmentAmount !== undefined) {
          element.OtherCommitmentAmount = {
            'field': '[Other Commitment Amount]',
            'headerName': 'Other Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinanceAmount !== undefined) {
          element.CofinanceAmount = {
            'field': '[Cofinance Amount]',
            'headerName': 'Co-Financing',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.FYExpenseBBTF !== undefined) {
          element.FYExpenseBBTF = {
            'field': '[FY BB+TF Expense]',
            'headerName': 'FY Exp. BB+TF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CumulativeBExpenseBTF !== undefined) {
          element.CumulativeBExpenseBTF = {
            'field': '[Cumulative BB+TF Expense]',
            'headerName': 'Cum. Exp. BB+TF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        // if (element.IDATotalCommitment !== undefined) {
        //   element.IDATotalCommitment = {
        //     'field': '[Lending IDA Total Commitment $]',
        //     'headerName': 'IDA Commitment',
        //     'type': 'rightAligned',
        //     valueFormatter: this.numberFormatter,
        //   };
        // }
        if (element.IDAFinancingCredit !== undefined) {
          element.IDAFinancingCredit = {
            'field': '[Project IDA Financing IDA Credit $]',
            'headerName': 'IDA Credit',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingGrant !== undefined) {
          element.IDAFinancingGrant = {
            'field': '[Project IDA Financing IDA Grant $]',
            'headerName': 'IDA Grant',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingGuarantee !== undefined) {
          element.IDAFinancingGuarantee = {
            'field': '[Project IDA Financing IDA Guarantee $]',
            'headerName': 'IDA Guarantee',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingShortMaturity !== undefined) {
          element.IDAFinancingShortMaturity = {
            'field': '[Project IDA Financing IDA Short Maturity $]',
            'headerName': 'IDA SML',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingNationalTotal !== undefined) {
          element.IDAFinancingNationalTotal = {
            'field': '[Project IDA Financing National Total $]',
            'headerName': 'National Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingNationalCredit !== undefined) {
          element.IDAFinancingNationalCredit = {
            'field': '[Project IDA Financing National Credit $]',
            'headerName': 'National Credit',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingNationalGrant !== undefined) {
          element.IDAFinancingNationalGrant = {
            'field': '[Project IDA Financing National Grant $]',
            'headerName': 'National Grant',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingNationalGuarantee !== undefined) {
          element.IDAFinancingNationalGuarantee = {
            'field': '[Project IDA Financing National Guarantee $]',
            'headerName': 'National Guarantee',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingNationalShortMaturity !== undefined) {
          element.IDAFinancingNationalShortMaturity = {
            'field': '[Project IDA Financing National Short Maturity $]',
            'headerName': 'National SML',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRegionalTotal !== undefined) {
          element.IDAFinancingRegionalTotal = {
            'field': '[Project IDA Financing Regional Total $]',
            'headerName': 'Regional Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRegionalCredit !== undefined) {
          element.IDAFinancingRegionalCredit = {
            'field': '[Project IDA Financing Regional Credit $]',
            'headerName': 'Regional Credit',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRegionalGrant !== undefined) {
          element.IDAFinancingRegionalGrant = {
            'field': '[Project IDA Financing Regional Grant $]',
            'headerName': 'Regional Grant',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRegionalGuarantee !== undefined) {
          element.IDAFinancingRegionalGuarantee = {
            'field': '[Project IDA Financing Regional Guarantee $]',
            'headerName': 'Regional Guarantee',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRefugeeTotal !== undefined) {
          element.IDAFinancingRefugeeTotal = {
            'field': '[Project IDA Financing Refugee Total $]',
            'headerName': 'Refugee Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRefugeeCredit !== undefined) {
          element.IDAFinancingRefugeeCredit = {
            'field': '[Project IDA Financing Refugee Credit $]',
            'headerName': 'Refugee Credit',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingRefugeeGrant !== undefined) {
          element.IDAFinancingRefugeeGrant = {
            'field': '[Project IDA Financing Refugee Grant $]',
            'headerName': 'Refugee Grant',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingCRWTotal !== undefined) {
          element.IDAFinancingCRWTotal = {
            'field': '[Project IDA Financing CRW Total $]',
            'headerName': 'CRW Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingCRWCredit !== undefined) {
          element.IDAFinancingCRWCredit = {
            'field': '[Project IDA Financing CRW Credit $]',
            'headerName': 'CRW Credit',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingCRWGrant !== undefined) {
          element.IDAFinancingCRWGrant = {
            'field': '[Project IDA Financing CRW Grant $]',
            'headerName': 'CRW Grant',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingSUFTotal !== undefined) {
          element.IDAFinancingSUFTotal = {
            'field': '[Project IDA Financing SUF Total $]',
            'headerName': 'SUW',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingSUFCredit !== undefined) {
          element.IDAFinancingSUFCredit = {
            'field': '[Project IDA Financing SUF Credit $]',
            'headerName': 'SUW Regular',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingSUFSML !== undefined) {
          element.IDAFinancingSUFSML = {
            'field': '[Project IDA Financing SUF Short Maturity $]',
            'headerName': 'SUW SML',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingTransitionlTotal !== undefined) {
          element.IDAFinancingTransitionlTotal = {
            'field': '[Project IDA Financing Transitional Total $]',
            'headerName': 'Transitional Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDAFinancingTransitionalCredit !== undefined) {
          element.IDAFinancingTransitionalCredit = {
            'field': '[Project IDA Financing Transitional Credit $]',
            'headerName': 'Transitional Credit',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.NetCommAmt !== undefined) {
          element.NetCommAmt = {
            'field': '[Portfolio Total Net Commitment $]',
            'headerName': 'Net Comm. Amt. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.UndisbBal !== undefined) {
          element.UndisbBal = {
            'field': '[Portfolio Total Undisbursed Balance $]',
            'headerName': 'Undisb. Bal. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Sg2.2' && element.TotalNetCommitment !== undefined) {
          element.TotalNetCommitment = {
            'field': '[Total Net Commitment $]',
            'headerName': 'Total Net Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.2' && element.TotalNetCommitment !== undefined) {
          element.TotalNetCommitment = {
            'field': '[Total Net Commitment $]',
            'headerName': 'Net Commitment - ($M) - Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Sg2.2' && report !== 'ST4.2' && element.TotalNetCommitment !== undefined) {
          element.TotalNetCommitment = {
            'field': '[Portfolio Total Net Commitment $]',
            'headerName': 'Net Comm.(IBRD, IDA and TF)',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (element.PortfolioDisbursement !== undefined) {
          element.PortfolioDisbursement = {
            'field': '[Portfolio Total Disbursement $]',
            'headerName': 'Disbursements',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (report === 'Cl2.2b' && element.LendingTotalCommitment !== undefined) {
          element.LendingTotalCommitment = {
            'field': '[Lending Total Commitment $]',
            'headerName': 'Total Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if ((report === 'fm1.1' || report === 'fm3.9' || report === 'fm3.10') && element.LendingTotalCommitment !== undefined) {
          element.LendingTotalCommitment = {
            'field': '[Lending Total Commitment $]',
            'headerName': 'Total Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'P1.6' && element.LendingTotalCommitment !== undefined) {
          element.LendingTotalCommitment = {
            'field': '[Lending Total Commitment $]',
            'headerName': 'Total Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LendingIBRDCommitment !== undefined) {
          element.LendingIBRDCommitment = {
            'field': '[Lending IBRD Total Commitment $]',
            'headerName': 'IBRD Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LendingIDACommitment !== undefined) {
          element.LendingIDACommitment = {
            'field': '[Lending IDA Total Commitment $]',
            'headerName': 'IDA Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LendingOthersCommitment !== undefined) {
          element.LendingOthersCommitment = {
            'field': '[Lending Others Total Commitment $]',
            'headerName': 'Others Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if ((report === 'fm1.1' || report === 'fm3.8' || report === 'fm3.9' || report === 'fm3.10') && element.PortfolioTotalDisbursement !== undefined) {
          element.PortfolioTotalDisbursement = {
            'field': '[Portfolio Total Disbursement $]',
            'headerName': 'Cum. Disb. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'P1.6' && element.PortfolioTotalDisbursement !== undefined) {
          element.PortfolioTotalDisbursement = {
            'field': '[Portfolio Total Disbursement $]',
            'headerName': 'Cum.Disb.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.UndisbBalAmount !== undefined) {
          element.UndisbBalAmount = {
            'field': '[Portfolio Total Undisbursed Balance $]',
            'headerName': 'Undisb. Bal.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.TotalCancellation !== undefined) {
          element.TotalCancellation = {
            'field': '[Portfolio Total Cancellation $]',
            'headerName': 'Total Cancel',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.TotalBeginFYUndisbursedBalance !== undefined) {
          element.TotalBeginFYUndisbursedBalance = {
            'field': '[Portfolio Total Begin FY Undisbursed Balance $]',
            'headerName': 'Beginning FY Undisb.Bal.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioDisbursementFY !== undefined) {
          element.PortfolioDisbursementFY = {
            'field': '[Portfolio Disbursement FY $]',
            'headerName': 'Disb. in FY',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingTotalNetCommitment !== undefined) {
          element.CofinancingTotalNetCommitment = {
            'field': '[Portfolio Cofinancing Total Net Commitment $]',
            'headerName': 'Cofinancing Amt',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingTotalDisbursement !== undefined) {
          element.CofinancingTotalDisbursement = {
            'field': '[Portfolio Cofinancing Total Disbursement $]',
            'headerName': 'Cofinancing Disb.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.TotalNetCommitmentAmount !== undefined) {
          element.TotalNetCommitmentAmount = {
            'field': '[Portfolio Total Net Commitment Amount]',
            'headerName': 'Net Comm. Amt. - Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioCommitmentatRisk$ !== undefined) {
          element.PortfolioCommitmentatRisk$ = {
            'field': '[Portfolio Commitment at Risk $]',
            'headerName': 'Portfolio Commitment at Risk $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IBRDNetCommitmentAmount !== undefined) {
          element.IBRDNetCommitmentAmount = {
            'field': '[Portfolio IBRD Net Commitment Amount]',
            'headerName': 'Net Comm. Amt. - IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.IDANetCommitmentAmount !== undefined) {
          element.IDANetCommitmentAmount = {
            'field': '[Portfolio IDA Net Commitment Amount]',
            'headerName': 'Net Comm. Amt. - IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.OthersNetCommitmentAmount !== undefined) {
          element.OthersNetCommitmentAmount = {
            'field': '[Portfolio Others Net Commitment Amount]',
            'headerName': 'Net Comm. Amt. - Others',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.TotalDisbursementAmount !== undefined) {
          element.TotalDisbursementAmount = {
            'field': '[Portfolio Total Disbursement Amount]',
            'headerName': 'Disbursements - Cum. Disb.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.UndisbursedBalanceAmount !== undefined) {
          element.UndisbursedBalanceAmount = {
            'field': '[Portfolio Total Undisbursed Balance Amount]',
            'headerName': 'Undisb. Bal.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.TotalCancellationAmount !== undefined) {
          element.TotalCancellationAmount = {
            'field': '[Portfolio Total Cancellation Amount]',
            'headerName': 'Cancelled Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.BeginFYUndisbursedBalance !== undefined) {
          element.BeginFYUndisbursedBalance = {
            'field': '[Portfolio Total Begin FY Undisbursed Balance Amount]',
            'headerName': 'Begining FY Undisb. Balance',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.DisbursementsFYAmount !== undefined) {
          element.DisbursementsFYAmount = {
            'field': '[Portfolio Disbursement FY Amount]',
            'headerName': 'Disbursements FY Disb.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingNetCommitmentAmount !== undefined) {
          element.CofinancingNetCommitmentAmount = {
            'field': '[Portfolio Cofinancing Total Net Commitment Amount]',
            'headerName': 'Cofinancing Amt',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Sg2.4' && element.CofinancingDisbursementAmount !== undefined) {
          element.CofinancingDisbursementAmount = {
            'field': '[Cofinancing Disbursement $]',
            'headerName': 'Cofinancing Disb. Amt. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Sg2.4' && element.CofinancingDisbursementAmount !== undefined) {
          element.CofinancingDisbursementAmount = {
            'field': '[Portfolio Cofinancing Total Disbursement Amount]',
            'headerName': 'Cofinancing Disb. Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Cl2.3b' && element.PortfolioTotalNetCommitment !== undefined) {
          element.PortfolioTotalNetCommitment = {
            'field': '[Portfolio Total Net Commitment $]',
            'headerName': 'Total Net Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if ((report === 'fm1.1' || report === 'fm3.8' || report === 'fm3.9') && element.PortfolioTotalNetCommitment !== undefined) {
          element.PortfolioTotalNetCommitment = {
            'field': '[Portfolio Total Net Commitment $]',
            'headerName': 'Net Commitment Amount ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'P5.7' && element.PortfolioTotalNetCommitment !== undefined) {
          element.PortfolioTotalNetCommitment = {
            'field': '[Portfolio_Total_Net_Commitment__]',
            'headerName': 'Portfolio Total Net Commitment $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioIBRDNetCommitment$ !== undefined) {
          element.PortfolioIBRDNetCommitment$ = {
            'field': '[Portfolio_IBRD_Net_Commitment__]',
            'headerName': 'Portfolio IBRD Net Commitment $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioIDANetCommitment$ !== undefined) {
          element.PortfolioIDANetCommitment$ = {
            'field': '[Portfolio_IDA_Net_Commitment__]',
            'headerName': 'Portfolio IDA Net Commitment $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioOthersNetCommitment$ !== undefined) {
          element.PortfolioOthersNetCommitment$ = {
            'field': '[Portfolio_Others_Net_Commitment__]',
            'headerName': 'Portfolio Others Net Commitment $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioCofinancingTotalNetCommitment$ !== undefined) {
          element.PortfolioCofinancingTotalNetCommitment$ = {
            'field': '[Portfolio_Cofinancing_Total_Net_Commitment__]',
            'headerName': 'Portfolio Cofinancing Total Net Commitment $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Cl2.3b' && element.PortfolioIBRDNetCommitment !== undefined) {
          element.PortfolioIBRDNetCommitment = {
            'field': '[Portfolio IBRD Net Commitment $]',
            'headerName': 'IBRD Net Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Cl2.3b' && element.PortfolioIBRDNetCommitment !== undefined) {
          element.PortfolioIBRDNetCommitment = {
            'field': '[Portfolio IBRD Net Commitment $]',
            'headerName': 'Net Comm.Amt IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'Cl2.3b' && element.PortfolioIDANetCommitment !== undefined) {
          element.PortfolioIDANetCommitment = {
            'field': '[Portfolio IDA Net Commitment $]',
            'headerName': 'IDA Net Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'Cl2.3b' && element.PortfolioIDANetCommitment !== undefined) {
          element.PortfolioIDANetCommitment = {
            'field': '[Portfolio IDA Net Commitment $]',
            'headerName': 'Net Comm.Amt IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.PortfolioOthersNetCommitment !== undefined) {
          element.PortfolioOthersNetCommitment = {
            'field': '[Portfolio Others Net Commitment $]',
            'headerName': 'Net Comm.Amt Others',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LoanSummaryNetCommitment !== undefined) {
          element.LoanSummaryNetCommitment = {
            'field': '[Loan Summary Net Commitment $]',
            'headerName': 'Net Com. Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LoanTotalCancellation !== undefined) {
          element.LoanTotalCancellation = {
            'field': '[Loan Summary Total Cancellation $]',
            'headerName': 'Cancellation Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LoanTotalDisbursement !== undefined) {
          element.LoanTotalDisbursement = {
            'field': '[Loan Summary Total Disbursement $]',
            'headerName': 'Disbursement Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LoanTotalUnDisbursement !== undefined) {
          element.LoanTotalUnDisbursement = {
            'field': '[Loan Summary Total Undisbursement $]',
            'headerName': 'UnDisbursement Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.UndisbursementBalanceBeginYear !== undefined) {
          element.UndisbursementBalanceBeginYear = {
            'field': '[Loan Summary Undisbursed Balance Beginning FY including Closed Projects $]',
            'headerName': 'Undisbursement Balance Begin Year',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.DisbursementinFY !== undefined) {
          element.DisbursementinFY = {
            'field': '[Loan Disbursement in FY]',
            'headerName': 'Disbursement in FY',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ActiveNetCommitmentAmount !== undefined) {
          element.ActiveNetCommitmentAmount = {
            'field': '[Loan Active Net Commitment Amount]',
            'headerName': 'Bank Administrative Financing',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (element.ActiveDisbursementAmount !== undefined) {
          element.ActiveDisbursementAmount = {
            'field': '[Loan Active Disbursement Amount]',
            'headerName': 'Disbursements',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (element.ActiveDisbursementAmountFY !== undefined) {
          element.ActiveDisbursementAmountFY = {
            'field': '[Loan Active Disbursement Amount in FY]',
            'headerName': 'FY Disbursements',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (element.DisbursementAmountFYClosed !== undefined) {
          element.DisbursementAmountFYClosed = {
            'field': '[Loan Disbursement Amount in FY including Closed Projects]',
            'headerName': 'FY Disbursements(incl. Closed Projects)',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (element.UndisbursementAmountFYClosed !== undefined) {
          element.UndisbursementAmountFYClosed = {
            'field': '[Loan Undisbursement Amount including Closed Projects]',
            'headerName': 'Undisb. Balance Begin Year(incl. Closed Projects)',
            'type': 'rightAligned',
            valueFormatter: this.BillionnumberFormatter,
          };
        }
        if (element.CurrentFYExpenditure !== undefined) {
          element.CurrentFYExpenditure = {
            'field': '[ASA Current FY Expenditure - BB $]',
            'headerName': 'Current FY Expenditure - BB',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CurrentFYExpenditureBETF !== undefined) {
          element.CurrentFYExpenditureBETF = {
            'field': '[ASA Current FY Expenditure - BETF $]',
            'headerName': 'Current FY Expenditure - BETF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CurrentFYExpenditureTotal !== undefined) {
          element.CurrentFYExpenditureTotal = {
            'field': '[ASA Current FY Expenditure $]',
            'headerName': 'Current FY Expenditure - Total',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.TotalLifetimeExpenditureBB !== undefined) {
          element.TotalLifetimeExpenditureBB = {
            'field': '[ASA Total Lifetime Expenditure - BB $]',
            'headerName': 'Total Lifetime Expenditure - BB',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.TotalLifetimeExpenditureBETF !== undefined) {
          element.TotalLifetimeExpenditureBETF = {
            'field': '[ASA Total Lifetime Expenditure - BETF $]',
            'headerName': 'Total Lifetime Expenditure - BETF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.TotalLifetimeExpenditureTot !== undefined) {
          element.TotalLifetimeExpenditureTot = {
            'field': '[ASA Total Lifetime Expenditure $]',
            'headerName': 'Total Lifetime Expenditure - Total',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.FYExpenses !== undefined) {
          element.FYExpenses = {
            'field': '[ASA Current FY Expenditure $]',
            'headerName': 'FY Expenses ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CumulativeExpenses !== undefined) {
          element.CumulativeExpenses = {
            'field': '[ASA Total Lifetime Expenditure $]',
            'headerName': 'Cumulative Expenses ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CurrentBB !== undefined) {
          element.CurrentBB = {
            'field': '[ASA Current FY Expenditure Amount - BB]',
            'headerName': 'Current FY Expenditure - BB',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CurrentBETF !== undefined) {
          element.CurrentBETF = {
            'field': '[ASA Current FY Expenditure Amount - BETF]',
            'headerName': 'Current FY Expenditure - BETF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CurrentTotal !== undefined) {
          element.CurrentTotal = {
            'field': '[ASA Current FY Expenditure Amount - Total]',
            'headerName': 'Current FY Expenditure - Total',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.LifetimeBB !== undefined) {
          element.LifetimeBB = {
            'field': '[ASA Lifetime Expenditure Amount - BB]',
            'headerName': 'Total Lifetime Expenditure - BB',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.LifetimeBETF !== undefined) {
          element.LifetimeBETF = {
            'field': '[ASA Lifetime Expenditure Amount - BETF]',
            'headerName': 'Total Lifetime Expenditure - BETF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.LifetimeTotal !== undefined) {
          element.LifetimeTotal = {
            'field': '[ASA Lifetime Expenditure Amount - Total]',
            'headerName': 'Total Lifetime Expenditure - Total',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASAgreementAmount !== undefined) {
          element.RASAgreementAmount = {
            'field': '[RAS Agreement $]',
            'headerName': 'Agreement Amount ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASCurrentFYBudgetTotalDirectCost !== undefined) {
          element.RASCurrentFYBudgetTotalDirectCost = {
            'field': '[RAS Current FY Budget Active/Closed $]',
            'headerName': 'RAS Budget(Total Direct Cost) ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASCumulativeExpenditure !== undefined) {
          element.RASCumulativeExpenditure = {
            'field': '[RAS Cumulative Expenditure $]',
            'headerName': 'Cumulative Expenditure ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASCumulativeExpenditureAgreement !== undefined) {
          element.RASCumulativeExpenditureAgreement = {
            'field': '[RAS Cumulative Agreement Level Expenditure $]',
            'headerName': 'Cumulative Expenditure at Agreement Level ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASRemainingBudgetAgreement !== undefined) {
          element.RASRemainingBudgetAgreement = {
            'field': '[RAS Agreement Level Remaining Budget $]',
            'headerName': 'Remaining Budget at Agreement Level ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASWPAPlan !== undefined) {
          element.RASWPAPlan = {
            'field': '[RAS WPA Plan $]',
            'headerName': 'WPA Plan ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASFYExpenditure !== undefined) {
          element.RASFYExpenditure = {
            'field': '[RAS FY Expenditure $]',
            'headerName': 'FY Expenditure ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASWPARemainingBalance !== undefined) {
          element.RASWPARemainingBalance = {
            'field': '[RAS WPA Remaining Balance $]',
            'headerName': 'WPA Remaining Balance ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASFYCommitment !== undefined) {
          element.RASFYCommitment = {
            'field': 'RAS[FY Commitment Amount]',
            'headerName': 'FY Commitments ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASFYExpComAmount !== undefined) {
          element.RASFYExpComAmount = {
            'field': '[RAS FY Expenditure + Commitment $]',
            'headerName': 'FY Exp. + Com. ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.TotalLegalAgreementsActive !== undefined) {
          element.TotalLegalAgreementsActive = {
            'field': '[RAS Total Legal Agreements Active $]',
            'headerName': 'Total Value of Legal Agreements (active)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.WPARemainingBalanceAFCommitment !== undefined) {
          element.WPARemainingBalanceAFCommitment = {
            'field': '[RAS After Commitment WPA Remaining Balance $]',
            'headerName': 'WPA Remaining Balance after Commitments ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RASFYCommitmentAmount !== undefined) {
          element.RASFYCommitmentAmount = {
            'field': '[RAS FY Commitment $]',
            'headerName': 'FY Commitments ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.RasRemainingBalance !== undefined) {
          element.RasRemainingBalance = {
            'field': '[RAS WPA Remaining Balance $]',
            'headerName': 'WPA Remaining Balance ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CountryEngagement !== undefined) {
          element.CountryEngagement = {
            'field': '[CPF Total Expenses $]',
            'headerName': 'Cum.Exp. ($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.TotalLegalAgreement !== undefined) {
          element.TotalLegalAgreement = {
            'field': '[RAS Total Legal Agreement $]',
            'headerName': 'Value of Legal Agreement (K$)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.ExpensesCurrentFYBB !== undefined) {
          element.ExpensesCurrentFYBB = {
            'field': '[Project Expenses Current FY BB $]',
            'headerName': 'Current FY Expenditure (K$)-BB',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.ExpensesCurrentFYBETF !== undefined) {
          element.ExpensesCurrentFYBETF = {
            'field': '[Project Expenses Current FY TF $]',
            'headerName': 'Current FY Expenditure (K$)-BETF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.ExpensesCurrentFYTotal !== undefined) {
          element.ExpensesCurrentFYTotal = {
            'field': '[Project Expenses Current FY Total $]',
            'headerName': 'Current FY Expenditure (K$)-Total',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CumulativeExpenditureBB !== undefined) {
          element.CumulativeExpenditureBB = {
            'field': '[Project Expenses Total Cumulative BB $]',
            'headerName': 'Total Lifetime Expenditure (K$)-BB',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CumulativeExpenditureBETF !== undefined) {
          element.CumulativeExpenditureBETF = {
            'field': '[Project Expenses Total Cumulative TF $]',
            'headerName': 'Total Lifetime Expenditure (K$)-BETF',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.CumulativeExpenditureTotal !== undefined) {
          element.CumulativeExpenditureTotal = {
            'field': '[Project Expenses Total Cumulative $]',
            'headerName': 'Total Lifetime Expenditure (K$)-Total',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
        if (element.PortfolioCofinancingCommitment !== undefined) {
          element.PortfolioCofinancingCommitment = {
            'field': '[Portfolio Cofinancing Commitment $]',
            'headerName': 'Cofinancing Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LendingIBRDTotalCommitment !== undefined) {
          element.LendingIBRDTotalCommitment = {
            'field': '[Lending IBRD Total Commitment $]',
            'headerName': 'IBRD Total Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.LendingOthersTotalCommitment !== undefined) {
          element.LendingOthersTotalCommitment = {
            'field': '[Lending Others Total Commitment $]',
            'headerName': 'Others Total Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ActivityContractCost !== undefined) {
          element.ActivityContractCost = {
            'field': '[Procurement Activity Contract Cost $]',
            'headerName': 'Activity Contract Cost $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ActivityEstimateBudget !== undefined) {
          element.ActivityEstimateBudget = {
            'field': '[Procurement Activity Estimate Budget $]',
            'headerName': 'Activity Estimate Budget $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ContractCurrentFYActualCost !== undefined) {
          element.ContractCurrentFYActualCost = {
            'field': '[Procurement Contract Current FY Actual Cost $]',
            'headerName': 'Current FY Actual Cost $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ContractCurrentFYActualContractCost !== undefined) {
          element.ContractCurrentFYActualContractCost = {
            'field': '[Procurement Contract Current FY Actual Contract Cost $]',
            'headerName': 'Current FY Actual Contract Cost $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ContractActualCost !== undefined) {
          element.ContractActualCost = {
            'field': '[Procurement Contract Current FY Actual Cost $]',
            'headerName': 'Contract Actual Cost $',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'fm3.10' && element.PortfolioNetCommitment !== undefined) {
          element.PortfolioNetCommitment = {
            'field': '[Portfolio Total Net Commitment $]',
            'headerName': 'Net Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'fm3.10' && element.PortfolioNetCommitment !== undefined) {
          element.PortfolioNetCommitment = {
            'field': '[Portfolio Total Net Commitment $]',
            'headerName': 'Net Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.totalcomm !== undefined) {
          element.totalcomm = {
            'field': '[FM Schedule Audit Total Commitment $]',
            'headerName': 'Total Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.netcomm !== undefined) {
          element.netcomm = {
            'field': '[FM Schedule Audit Total Net Commitment $]',
            'headerName': 'Net Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.disbcomm !== undefined) {
          element.disbcomm = {
            'field': '[FM Schedule Audit Total Disbursement $]',
            'headerName': 'Cum. Disb. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.totalcommitment_ifr !== undefined) {
          element.totalcommitment_ifr = {
            'field': '[Total Commitment $]',
            'headerName': 'Total Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.netcommitment_ifr !== undefined) {
          element.netcommitment_ifr = {
            'field': '[Total Net Commitment $]',
            'headerName': 'Net Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.disbcommitment_ifr !== undefined) {
          element.disbcommitment_ifr = {
            'field': '[Total Disbursement $]',
            'headerName': 'Cum. Disb. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ifr_totalcomm !== undefined) {
          element.ifr_totalcomm = {
            'field': '[FM Schedule IFR Total Commitment $]',
            'headerName': 'Total Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ifr_netcomm !== undefined) {
          element.ifr_netcomm = {
            'field': '[FM Schedule IFR Total Net Commitment $]',
            'headerName': 'Net Comm. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.ifr_disbcomm !== undefined) {
          element.ifr_disbcomm = {
            'field': '[FM Schedule IFR Total Disbursement $]',
            'headerName': 'Cum. Disb. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.GrantCommitment !== undefined) {
          element.GrantCommitment = {
            'field': '[Grant Commitment $]',
            'headerName': 'Grant Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.2' && element.IBRDNetCommitment !== undefined) {
          element.IBRDNetCommitment = {
            'field': '[IBRD Net Commitment $]',
            'headerName': 'Net Commitment - ($M) - IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'ST4.2' && element.IBRDNetCommitment !== undefined) {
          element.IBRDNetCommitment = {
            'field': '[IBRD Net Commitment $]',
            'headerName': 'IBRD Net Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.2' && element.IDANetCommitment !== undefined) {
          element.IDANetCommitment = {
            'field': '[IDA Net Commitment $]',
            'headerName': 'Net Commitment - ($M) - IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'ST4.2' && element.IDANetCommitment !== undefined) {
          element.IDANetCommitment = {
            'field': '[IDA Net Commitment $]',
            'headerName': 'IDA Net Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.2' && element.OtherNetCommitment !== undefined) {
          element.OtherNetCommitment = {
            'field': '[Other Net Commitment $]',
            'headerName': 'Others Net Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'ST4.2' && element.OtherNetCommitment !== undefined) {
          element.OtherNetCommitment = {
            'field': '[Other Net Commitment $]',
            'headerName': 'Others Net Comm.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingNetCommitment !== undefined) {
          element.CofinancingNetCommitment = {
            'field': '[Cofinancing Net Commitment $]',
            'headerName': 'Cofinancing Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingDisbursement !== undefined) {
          element.CofinancingDisbursement = {
            'field': '[Cofinancing Disbursement $]',
            'headerName': 'Cofinancing Disb. Amt.',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.1' && element.IBRDCommitment !== undefined) {
          element.IBRDCommitment = {
            'field': '[IBRD Commitment $]',
            'headerName': 'Commitment - ($M) - IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'ST4.1' && element.IBRDCommitment !== undefined) {
          element.IBRDCommitment = {
            'field': '[IBRD Total Commitment $]',
            'headerName': 'Commitments ($M) - IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report === 'ST4.1' && element.IDACommitment !== undefined) {
          element.IDACommitment = {
            'field': '[IDA Commitment $]',
            'headerName': 'Commitment - ($M) - IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (report !== 'ST4.1' && element.IDACommitment !== undefined) {
          element.IDACommitment = {
            'field': '[IDA Total Commitment $]',
            'headerName': 'Commitments ($M) - IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.NetCommitmentTotal !== undefined) {
          element.NetCommitmentTotal = {
            'field': '[Total Net Commitment $]',
            'headerName': 'Net Commitments ($M) - Total',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.NetCommitmentIBRD !== undefined) {
          element.NetCommitmentIBRD = {
            'field': '[IBRD Net Commitment $]',
            'headerName': 'Net Commitments ($M) - IBRD',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.NetCommitmentIDA !== undefined) {
          element.NetCommitmentIDA = {
            'field': '[IDA Net Commitment $]',
            'headerName': 'Net Commitments ($M) - IDA',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.NetCommitmentOther !== undefined) {
          element.NetCommitmentOther = {
            'field': '[Other Net Commitment $]',
            'headerName': 'Net Commitments ($M) - Others',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingAmount !== undefined) {
          element.CofinancingAmount = {
            'field': '[Cofinancing Net Commitment $]',
            'headerName': 'Cofinancing Amt. ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.SectorandThemeCommitment !== undefined) {
          element.SectorandThemeCommitment = {
            'field': '[Sector and Theme Lending Commitment $]',
            'headerName': 'Sector and Theme Commitment',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CofinancingCommitment !== undefined) {
          element.CofinancingCommitment = {
            'field': '[Cofinancing $]',
            'headerName': 'Co-financing ($M)',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.OthersTotalCommitment !== undefined) {
          element.OthersTotalCommitment = {
            'field': '[Others Total Commitment $]',
            'headerName': 'Commitments($M) - Others',
            'type': 'rightAligned',
            valueFormatter: this.numberFormatter,
          };
        }
        if (element.CurrentFYBBTFExpense !== undefined) {
          element.CurrentFYBBTFExpense = {
            'field': '[Current FY BB+TF Expense $]',
            'headerName': 'FY Exp. BB+TF($K)',
            'type': 'rightAligned',
            valueFormatter: this.ThousandnumberFormatter,
          };
        }
      });
    }
  }
  numberFormatter(params: ValueFormatterParams) {
    if (params.colDef.field === '[Total Commitment]' || params.colDef.field === '[PE Cofinance]' || params.colDef.field === '[Lending Total Commitment $]' ||
      params.colDef.field === '[Lending IBRD Total Commitment $]' || params.colDef.field === '[Lending IDA Total Commitment $]' ||
      params.colDef.field === '[Lending Others Total Commitment $]' || params.colDef.field === '[Lending PE Cofinance $]' ||
      params.colDef.field === '[Total Commitment Amount]' || params.colDef.field === '[IBRD Commitment Amount]' || params.colDef.field === '[IDA Commitment Amount]' ||
      params.colDef.field === '[Other Commitment Amount]' || params.colDef.field === '[Cofinance Amount]' || params.colDef.field === '[Lending Current FY BB+TF Expense $]' ||
      params.colDef.field === '[Project IDA Financing IDA Credit $]' || params.colDef.field === '[Project IDA Financing IDA Grant $]' ||
      params.colDef.field === '[Project IDA Financing IDA Guarantee $]' || params.colDef.field === '[Project IDA Financing IDA Short Maturity $]' ||
      params.colDef.field === '[Project IDA Financing National Guarantee $]' || params.colDef.field === '[Project IDA Financing National Short Maturity $]' ||
      params.colDef.field === '[Project IDA Financing Regional Guarantee $]' || params.colDef.field === '[Portfolio Total Net Commitment $]' ||
      params.colDef.field === '[Portfolio Total Undisbursed Balance $]' || params.colDef.field === '[Portfolio Total Disbursement $]' ||
      params.colDef.field === '[Portfolio Total Cancellation $]' || params.colDef.field === '[Lending Cumulative BB+TF Expense $]' ||
      params.colDef.field === '[Portfolio Total Begin FY Undisbursed Balance $]' || params.colDef.field === '[Portfolio Disbursement FY $]' ||
      params.colDef.field === '[Portfolio Cofinancing Total Net Commitment $]' || params.colDef.field === '[Portfolio Cofinancing Total Disbursement $]' ||
      params.colDef.field === '[Portfolio Total Net Commitment Amount]' || params.colDef.field === '[Portfolio Commitment at Risk $]' ||
      params.colDef.field === '[Portfolio IBRD Net Commitment Amount]' || params.colDef.field === '[Portfolio IDA Net Commitment Amount]' ||
      params.colDef.field === '[Portfolio Others Net Commitment Amount]' || params.colDef.field === '[Portfolio Total Disbursement Amount]' ||
      params.colDef.field === '[Portfolio Total Undisbursed Balance Amount]' || params.colDef.field === '[Portfolio Total Cancellation Amount]' ||
      params.colDef.field === '[Portfolio Total Begin FY Undisbursed Balance Amount]' || params.colDef.field === '[Portfolio Disbursement FY Amount]' ||
      params.colDef.field === '[Portfolio Cofinancing Total Net Commitment Amount]' || params.colDef.field === '[Portfolio Cofinancing Total Disbursement Amount]' ||
      params.colDef.field === '[Portfolio_Total_Net_Commitment__]' || params.colDef.field === '[Portfolio_IBRD_Net_Commitment__]' ||
      params.colDef.field === '[Portfolio_IDA_Net_Commitment__]' || params.colDef.field === '[Portfolio_Others_Net_Commitment__]' ||
      params.colDef.field === '[Portfolio_Cofinancing_Total_Net_Commitment__]' || params.colDef.field === '[Portfolio IBRD Net Commitment $]' ||
      params.colDef.field === '[Portfolio IDA Net Commitment $]' || params.colDef.field === '[Portfolio Others Net Commitment $]' || params.colDef.field === '[Loan Summary Net Commitment $]' ||
      params.colDef.field === '[Loan Summary Total Cancellation $]' || params.colDef.field === '[Loan Summary Total Disbursement $]' ||
      params.colDef.field === '[Loan Summary Total Undisbursement $]' || params.colDef.field === '[Loan Summary Undisbursed Balance Beginning FY including Closed Projects $]' ||
      params.colDef.field === '[Loan Disbursement in FY]' || params.colDef.field === '[Portfolio Cofinancing Commitment $]' ||
      params.colDef.field === '[Procurement Activity Contract Cost $]' || params.colDef.field === '[Procurement Activity Estimate Budget $]' ||
      params.colDef.field === '[Procurement Contract Current FY Actual Cost $]' || params.colDef.field === '[Procurement Contract Current FY Actual Contract Cost $]' ||
      params.colDef.field === '[FM Schedule Audit Total Commitment $]' || params.colDef.field === '[FM Schedule Audit Total Net Commitment $]' ||
      params.colDef.field === '[FM Schedule Audit Total Disbursement $]' || params.colDef.field === '[Total Commitment $]' ||
      params.colDef.field === '[Total Net Commitment $]' || params.colDef.field === '[Total Disbursement $]' ||
      params.colDef.field === '[Project Total Cumulative Expenses $]' || params.colDef.field === '[FM Schedule IFR Total Commitment $]' ||
      params.colDef.field === '[FM Schedule IFR Total Net Commitment $]' || params.colDef.field === '[FM Schedule IFR Total Disbursement $]' ||
      params.colDef.field === '[IBRD Total Commitment $]' || params.colDef.field === '[IDA Total Commitment $]' || params.colDef.field === '[Grant Commitment $]' ||
      params.colDef.field === '[IBRD Net Commitment $]' || params.colDef.field === '[IDA Net Commitment $]' || params.colDef.field === '[Other Net Commitment $]' ||
      params.colDef.field === '[Cofinancing Net Commitment $]' || params.colDef.field === '[Cofinancing Disbursement $]' ||
      params.colDef.field === '[Other Total Commitment $]' || params.colDef.field === '[Sector and Theme Lending Commitment $]' ||
      params.colDef.field === '[IBRD Commitment $]' || params.colDef.field === '[IDA Commitment $]' || params.colDef.field === '[Other Commitment $]' ||
      params.colDef.field === '[Cofinancing $]' || params.colDef.field === '[Others Total Commitment $]' || params.colDef.field === '[PE Cofinance $]') {
      if (params.value !== null && params.value !== ''
        && params.value !== 0) {
        const TotalCommitment = parseFloat(params.value) / 1000000;
        const TotalCommit = (Math.round(TotalCommitment * 100) / 100).toFixed(2);
        params.value = '$' + TotalCommit + 'M';
      } else {
        params.value = '$' + (Math.round(0 * 100) / 100).toFixed(2) + 'M';
      }
    } else if (params.colDef.field === '[Project IDA Financing National Total $]' || params.colDef.field === '[Project IDA Financing National Credit $]' ||
      params.colDef.field === '[Project IDA Financing National Grant $]' || params.colDef.field === '[Project IDA Financing Regional Total $]' ||
      params.colDef.field === '[Project IDA Financing Regional Credit $]' || params.colDef.field === '[Project IDA Financing Regional Grant $]' ||
      params.colDef.field === '[Project IDA Financing Refugee Total $]' || params.colDef.field === '[Project IDA Financing Refugee Credit $]' ||
      params.colDef.field === '[Project IDA Financing Refugee Grant $]' || params.colDef.field === '[Project IDA Financing CRW Total $]' ||
      params.colDef.field === '[Project IDA Financing CRW Credit $]' || params.colDef.field === '[Project IDA Financing CRW Grant $]' ||
      params.colDef.field === '[Project IDA Financing SUF Total $]' || params.colDef.field === '[Project IDA Financing SUF Credit $]' ||
      params.colDef.field === '[Project IDA Financing SUF Short Maturity $]' || params.colDef.field === '[Project IDA Financing Transitional Total $]' ||
      params.colDef.field === '[Project IDA Financing Transitional Credit $]') {
      if (params.value !== null && params.value !== ''
        && params.value !== 0) {
        const TotalCommitment = parseFloat(params.value) / 1000000;
        const TotalCommit = (Math.round(TotalCommitment * 100) / 100).toFixed(2);
        params.value = TotalCommit + 'M';
      } else {
        params.value = (Math.round(0 * 100) / 100).toFixed(2) + 'M';
      }
    }

    return params.value == null ? '' : params.value;
  }
  ThousandnumberFormatter(params: ValueFormatterParams) {
    if (params.colDef.field === 'FYExpBBTF' || params.colDef.field === '[Lending Current FY BB+TF Expense $]' || params.colDef.field === '[Lending Cumulative BB+TF Expense $]' ||
      params.colDef.field === '[FY BB+TF Expense]' || params.colDef.field === '[Cumulative BB+TF Expense]' || params.colDef.field === '[ASA Current FY Expenditure - BB $]' ||
      params.colDef.field === '[ASA Current FY Expenditure - BETF $]' || params.colDef.field === '[ASA Current FY Expenditure $]' ||
      params.colDef.field === '[ASA Total Lifetime Expenditure - BB $]' || params.colDef.field === '[ASA Total Lifetime Expenditure - BETF $]' ||
      params.colDef.field === '[ASA Total Lifetime Expenditure $]' || params.colDef.field === '[ASA Current FY Expenditure Amount - BB]' ||
      params.colDef.field === '[ASA Current FY Expenditure Amount - BETF]' || params.colDef.field === '[ASA Current FY Expenditure Amount - Total]' ||
      params.colDef.field === '[ASA Lifetime Expenditure Amount - BB]' || params.colDef.field === '[ASA Lifetime Expenditure Amount - BETF]' ||
      params.colDef.field === '[ASA Lifetime Expenditure Amount - Total]' || params.colDef.field === '[RAS Agreement $]' ||
      params.colDef.field === '[RAS Current FY Budget Active/Closed $]' || params.colDef.field === '[RAS Cumulative Expenditure $]' ||
      params.colDef.field === '[RAS Cumulative Agreement Level Expenditure $]' || params.colDef.field === '[RAS Agreement Level Remaining Budget $]' ||
      params.colDef.field === '[RAS WPA Plan $]' || params.colDef.field === '[RAS FY Expenditure $]' || params.colDef.field === '[RAS WPA Remaining Balance $]' ||
      params.colDef.field === 'RAS[FY Commitment Amount]' || params.colDef.field === '[RAS FY Expenditure + Commitment $]' ||
      params.colDef.field === '[RAS After Commitment WPA Remaining Balance $]' || params.colDef.field === '[RAS FY Commitment $]' ||
      params.colDef.field === '[CPF Total Expenses $]' || params.colDef.field === '[RAS Total Legal Agreement $]' ||
      params.colDef.field === '[Project Expenses Current FY BB $]' || params.colDef.field === '[Project Expenses Current FY TF $]' ||
      params.colDef.field === '[Project Expenses Current FY Total $]' || params.colDef.field === '[Project Expenses Total Cumulative BB $]' ||
      params.colDef.field === '[Project Expenses Total Cumulative TF $]' || params.colDef.field === '[Project Expenses Total Cumulative $]' ||
      params.colDef.field === '[Current FY BB+TF Expense $]' || params.colDef.field === '[Cumulative BB+TF Expense $]' ||
      params.colDef.field === '[RAS Total Legal Agreements Active $]') {
      if (params.value !== null && params.value !== ''
        && params.value !== 0) {
        const TotalCommitment = parseFloat(params.value) / 1000;
        const TotalCommit = (Math.round(TotalCommitment * 100) / 100).toFixed(2);
        params.value = '$' + TotalCommit + 'K';
      } else {
        params.value = '$' + (Math.round(0 * 100) / 100).toFixed(2) + 'K';
      }
    }
    return params.value == null ? '' : params.value;
  }
  BillionnumberFormatter(params: ValueFormatterParams) {
    if (params.colDef.field === '[Portfolio Total Net Commitment $]' || params.colDef.field === '[Portfolio Total Disbursement $]' ||
      params.colDef.field === '[Loan Active Net Commitment Amount]' || params.colDef.field === '[Loan Active Disbursement Amount]' ||
      params.colDef.field === '[Loan Active Disbursement Amount in FY]' || params.colDef.field === '[Loan Disbursement Amount in FY including Closed Projects]' ||
      params.colDef.field === '[Loan Undisbursement Amount including Closed Projects]') {
      if (params.value !== null && params.value !== '' && params.value !== undefined) {
        const TotalCommitment = parseFloat(params.value) / 1000000000;
        const TotalCommit = (Math.round(TotalCommitment * 100) / 100).toFixed(2);
        params.value = '$' + TotalCommit + 'B';
      } else {
        params.value = '';
      }
    }
    return params.value == null ? '' : params.value;
  }
  GetMvpcategoryChange() {
    this.GetMVPCategoryChange.emit();
  }
  tfDrillTableApply() {
    this.tffifsDrillthroughTable.next('reportApply');
  }

  getBPSAuthenticatedUser(listname: any) {
    // return this.commonApi.get(this.RM_BiportalApiService.authserviceUrl +
    // '/api/usage/getNotifications?serverName=intranetbeta.worldbank.org/reports&listName=SAAuthList&listCount=1000');
    return this.http.get(this.sharepointURL + '/api/sharepointList/services?listName=' + listname);
  }
  // Sustainalbility Authentication
  getsustainabilityAuthenticatedUser(listname: any) {
    return this.http.get(this.sharepointURL + '/api/sharepointList/services?listName=' + listname);
  }

  // PowerBI Report list
  getpowerbireportlistServiceURL(listname: any) {
    return this.http.get(this.sharepointURL + '/api/sharepointList/services?listName=' + listname);
  }
  // Co Finance API Call
  getCoFinance(url: any) {
    return this.http.get(this.coFinUrl + url).pipe(map((data: any) => {
      const result = data?.result?.data_array || [];
      const schema = data?.manifest?.schema?.columns || {};
      const details = result.map((item: any) => {
        let counter = 0;
        const response = schema.reduce((accumulator: any, prop: any) => {
          accumulator[prop.name] = item[counter];
          counter++;
          return accumulator;
        }, {});
        return response;
      });
      return details;
    }));
  }
  // Get CoFin Pipline Project
  getCoFinancePPrjData(url: any) {
    return this.http.get(this.coFinUrl + url).pipe(map((data: any) => {
      const result = data?.result?.data_array || [];
      const schema = data?.manifest?.schema?.columns || {};
      const details = result.map((item: any) => {
        let counter = 0;
        const response = schema.reduce((accumulator: any, prop: any) => {
          accumulator[prop.name] = item[counter];
          counter++;
          return accumulator;
        }, {});
        return response;
      });
      return details;
    }));
  }
  tffactdonorfyApply() {
    this.filterData.next({ command: 'factDonorfilterApply' });
  }
  tfbunsinessUnitApply(widgetID: any, unit: any) {
    if (this.drillSelecteddashboardOpt.filter(x => x.unit === unit).length === 0) {
      const WID = (widgetID === 'tfswid058' || widgetID === 'tfwid042') ? 'tfswid059' : (widgetID === 'tfwid042a' || widgetID === 'tfswid059') ? 'tfswid060' : 'tfswid060';
      this.drillSelecteddashboardOpt.push({ widgetID: WID, unit: unit });
      this.filterData.next({ command: 'businessUnitApply' });
    }
  }
  tfbunsinessreverseUnitApply(widgetID: any, unit: any) {
    if (unit === '') {
      this.drillSelecteddashboardOpt = [];
    } else {
      const index = this.drillSelecteddashboardOpt.findIndex(x => x.unit === unit);
      this.drillSelecteddashboardOpt = this.drillSelecteddashboardOpt.splice(index, 1);
    }
    this.filterData.next({ command: 'businessUnitApply' });
  }
  tfpersonaviewsApply() {
    this.filterData.next({ command: 'personaviewsfilterApply' });
  }
  coFinanceApply(data) {
    setTimeout(() => {
      this.CO_FinacefilterData.next({ command: 'co_filterApply', data: data });
    }, 100);
  }
  coFinanceAfDBApply(data) {
    this.CO_FinaceAfDBData.next({ command: 'co_filterApply', data: data });
  }
  coFinanceAgGridApply(command, data) {
    this.Co_Fin_AgGridApply.next({ command: command, data: data });
  }
  public getsrnotificationstatus(uid: string) {
    // return this.http.get(this.powerBIReportexportReq + '/api/SSRSocial/getsrbetanotification?uid=' + uid);
    return this.http.get(this.powerBIReportexportReq + '/api/SSRSocial/getsrbetanotification?uid=' + uid);
  }
  public savesrnotification(userData: any) {
    // return this.http.post(this.powerBIReportexportReq + '/api/SSRSocial/srbetanotificationstatus', userData);
    return this.http.post(this.powerBIReportexportReq + '/api/SSRSocial/srbetanotificationstatus', userData);
  }
  getCoFinChartData(params, title) {
    let FilterData = [];
    const AllData = JSON.parse(JSON.stringify(this.CoFinancData));
    if (this.CoFilterDatas.length > 0) {
      const index = this.CoFilterDatas.findIndex(d => d.category === 'Financier Name');
      if (index > -1) {
        AllData.filter(x => x['Financier Name'] === this.CoFilterDatas[index].name);
      }
    }

    if (title === 'Co-financing by Co-financier Type') {
      FilterData = AllData.filter(x => x['Co-Financier Type'] === params.category);
    } else if (title === 'Co-financing by Region' || title === 'MDB Group Co-Financing by Region') {
      FilterData = AllData.filter(x => x['Region'] === params.category);
    } else if (title === 'Co-financing by Sector FY14 - FY24') {
      FilterData = AllData.filter(x => x['Practice Area'] === params.category && x['Fiscal year'] === params.value);
    } else if (title === 'MDB Group Co-Financing by Sector') {
      FilterData = AllData.filter(x => x['Practice Area'] === params.category);
    } else if (title === 'Co-financing by Top 10 Co-financiers'
      || title === 'Co-financing for IBRD/IDA - Top 10 Co-financiers(FY14-FY24)') {
      FilterData = AllData.filter(x => x['Financier Name'] === params.category && x['Fiscal year'] === params.value);
    } else if (title === 'Financing Volume from MDB' || title === 'Number of Co-Financing Operations (FY14-FY24)') {
      if (params.value === 'Project Count' || params.value === 'Total Amount') {
        FilterData = AllData.filter(x => x['Fiscal year'] === params.category);
      } else {
        FilterData = AllData.filter(x => x['Fiscal year'] === params.category && x['IBRD/IDA Project'] === params.value);
      }
    } else if (title === 'Total Co-financing (FY2014 - FY2024)' || params.value === 'Total Amount' || params.value === 'Project Count') {
      FilterData = AllData.filter(x => x['Fiscal year'] === params.category);
    } else if (title === 'Co-financing by Country') {
      FilterData = AllData.filter(x => x['Country Name'] === params.category);
    }
    this.coFinFlag = 'cofin';
    this.CoFinChartFilterData = FilterData;
    // this.coFinanceAgGridApply('getdata', FilterData);
    this.router.navigate(['/co_finance/report']);
  }
  numberWithCommas(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    (Math.round(parts[0] * 100) / 100).toFixed(2);
    return parts.join('.');
  }
  numberWithCommasRounValue(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    Math.round(parts[0]);
    return parts.join('.');
  }
  /*----------Chat GeneAI-------*/
  getGeneAIModules(listname: any) {
    return this.http.get(this.sharepointURL + '/api/sharepointList/services?listName=' + listname);
  }
  getGeneAIQuestions(listname: any) {
    return this.http.get(this.sharepointURL + '/api/sharepointList/services?listName=' + listname);
  }
  /*----------//Chat GeneAI------*/

  // tslint:disable-next-line: max-line-length
  public postusagestats(url: any, applicationName: any, reportGrouping: any, reportName: any, reportType: any, filterInfo: any, reportId: any, upi_no: any, loggedInUserEmail: any) {
    const httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    const upi = upi_no;
    const email = loggedInUserEmail;
    if ((upi !== null && upi !== '' && upi !== '(null)')) { // && environment.appEnv === 'prod'
      return this.http.post('https://reports.worldbank.org/BIPortalSecurity/rest/bisecurity/putUsageStats?input={"upi":"'
        + upi + '","email":"' + email + '","url":"' + url + '","applicationName":"' + applicationName + '","reportGrouping":"' + reportGrouping + '","reportName":"' + reportName + '","reportType":"' + reportType + '","filterInfo":"' + filterInfo + '","reportId":"' + reportId + '"}', httpOptions);
    } else {
      return of(null);
    }
  }

  usageStatsDetail() {
    const pathname = window.location.pathname;
    const pathsview = decodeURI(this.router.url);
    const paths = pathname.split('/');
    const urls = this.router.url.split('/');
    if (urls.indexOf('region') !== -1 || urls.indexOf('country') !== -1 || urls.indexOf('practicegroup') !== -1
      || urls.indexOf('requnit') !== -1 || urls.indexOf('resunit') !== -1 || urls.indexOf('dirun') !== -1) {
      if (urls.length === 4) {
        paths[1] = urls[1];
      }
      if (urls.length > 4) {
        paths[1] = urls[1];
        const pathsSplit = urls[4].split('?');
        if (pathsSplit.length > 0) {
          paths[2] = pathsSplit[0];
        } else {
          paths[2] = urls[0];
        }
      }
    }
    const pathsname = window.location.pathname.split('/');
    let pathModule = '';
    if (pathsname.includes('hr')) {
      pathModule = 'HR';
    } else if (pathsname.includes('bps')) {
      pathModule = 'BPS';
    } else if (pathsname.includes('co_finance')) {
      pathModule = 'Co Finance';
    } else if (pathsname.includes('accounting')) {
      pathModule = 'Accounting';
    } else if (pathsname.includes('tf')) {
      pathModule = 'Trust Fund';
    } else if (pathsname.includes('rasdashboard')) {
      pathModule = 'RAS';
    } else if (pathsname.includes('bps_reforms_ideas')) {
      pathModule = 'BPS';
    } else if (pathsname.includes('taggedmanagerdetails')) {
      pathModule = 'Tagged Manager';
    } else if (pathsname.includes('work-program')) {
      pathModule = 'WPA';
    } else if (pathsname.includes('budget-glance')) {
      pathModule = 'Budget-Glance';
    } else if (pathsname.includes('trs-staffcost')) {
      pathModule = 'TRS & StaffCost';
    } else if (pathsname.includes('sources-uses')) {
      pathModule = 'Sources & Uses';
    } else if (pathsname.includes('budget-expenses')) {
      pathModule = 'Budget & Expenses';
    } else if (pathsname.includes('qa-dashboard')) {
      pathModule = 'QA Dashboard';
    } else {
      pathModule = 'OPS';
    }
    let pathFlag = '1';
    let reportGrouping = ''; let reportName = ''; let reportType = ''; let filterInfo = ''; let reportId = '';
    if (paths.length === 2) {
      reportGrouping = pathModule;
      reportName = pathModule;
      reportType = 'Dashboard';
      filterInfo = '';
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const filter = pathsview.split('='); let filterview = '';
      if (filter.length > 0) {
        filterview = ''; // (JSON.stringify(filter[1])).replace(/"/g, '').replace(/%22/g, '');
      } else {
        filterview = '';
      }
      if ((window.location.pathname.indexOf('/report/') !== -1) || (window.location.pathname.indexOf('/powerbi_report/') !== -1)) {
        reportGrouping = pathModule;
        reportName = '';
        reportType = 'ReportDetails';
        filterInfo = filterview;
        reportId = paths[3];
      } else {

        reportGrouping = pathModule;
        reportName = pathModule;
        reportType = 'Dashboard';
        filterInfo = filterview;
        reportId = '';
      }
    }
    if (filterInfo === undefined) {
      filterInfo = '';
    }
    if ((window.location.pathname.indexOf('/report/') !== -1) || (window.location.pathname.indexOf('/powerbi_report/') !== -1)) {
      pathFlag = '2';
    }

    const url = (window.location.href).replace(/"/g, '').replace(/%22/g, '');
    const mail = this.userInfo.userEmail;
    const upi = this.userInfo.userUpi;
    const applicationName = 'Standard Report Beta - ' + pathModule;
    if (upi !== null && upi !== '' && upi !== '(null)' && environment.omnitureEnv === 'prod') { // user usage statistics
      this.fwService.apiTrackMyPageWithAppInsights({ pageName: applicationName, subSections: [reportGrouping], upi: upi, url: url });
      ////  if (pathFlag === '1') {
      // tslint:disable-next-line:max-line-length
      this.postusagestats(url, applicationName, reportGrouping, reportName, reportType, filterInfo, reportId, upi, mail).subscribe(data => {
      });
    }
    // }

  }

  getTFMenuList(isUmberallaManager: boolean): any[] {
    let tempmenulist = [];
    let IBRDIDAList = [];
    let ReportList = [];
    IBRDIDAList = [
      {
        key: 'C-GRP-IBRDIDA', routeActive: false, active: true, text: 'IBRD/IDA TFs', page: 'tf/ibrdidatfs', route: 'tf/ibrdidatfs', prefixIconClass: 'fa-regular fa-id-card',
        // settings: { leftNavType: 'expand', collapsed: true, loadPage: false },
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
    ReportList = [{
      key: 'C-GRP-Reports', active: true, text: 'Reports', page: 'my-favorites', prefixIconClass: 'far fa-bar-chart',
      settings: { leftNavType: 'expand', collapsed: true, loadPage: false },
      routerLinkOptions: { matrixParams: 'exact', queryParams: 'exact', paths: 'exact', fragment: 'exact' },
      children: [
        {
          key: 'C-GRP-My-Reports', routeActive: false, active: true, text: 'My Reports', route: 'tf/my-favorites', page: 'tf/my-favorites', routerLinkOptions: { matrixParams: 'exact', queryParams: 'exact', paths: 'exact', fragment: 'exact' },
        }
      ]
    }];
    let ibrdidahome = {
      key: 'C-GRP-Home', routeActive: false, active: true, text: 'Overview', route: 'tf/overview', page: 'tf/overview', prefixIconClass: 'far fa-home'
    };
    let fifspage = { key: 'C-GRP-Staff-Flows', routeActive: false, active: true, text: 'FIFs', route: 'tf/landing-fifs', page: 'tf/landing-fifs', prefixIconClass: 'far fa-globe' };
    tempmenulist.push(ibrdidahome);
    IBRDIDAList.forEach(x => {
      tempmenulist.push(x);
    });
    tempmenulist.push(fifspage);
    ReportList.forEach(y => {
      tempmenulist.push(y)
    });
    return tempmenulist;
  }
  getAccountingMenuList() {
    let tempmenulist = [];
    tempmenulist = [
      /*{
        key: '', routeActive: false, active: true, text: 'Operations', page: '/ops', route: '//ops', prefixIconClass: 'far fa-gear',
        children: [
          { key: '', routeActive: false, active: true, text: 'Financing', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Country Engagement', route: '/ops/cpf', page: '/ops/cpf' },
          { key: '', routeActive: false, active: true, text: 'Advisory Services & Analytics', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Trust Funds', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Environment & Social', route: '/esf&safeguard/esf', page: '/esf&safeguard/esf' },
          { key: '', routeActive: false, active: true, text: 'Operations Procurement', route: '/fiduciary/procurement', page: '/fiduciary/procurement' },
          { key: '', routeActive: false, active: true, text: 'Financial Management', route: '/fiduciary/financialmanagement', page: '/fiduciary/financialmanagement' },
          { key: '', routeActive: false, active: true, text: 'Risk', route: '/performance/risk', page: '/performance/risk' },
          { key: '', routeActive: false, active: true, text: 'Results', route: '', page: '' },
        ],
        expanded: false
      },
      {
        key: '', routeActive: false, active: true, text: 'BPS', page: '/budget-glance', route: '/budget-glance', prefixIconClass: 'far fa-circle-dollar-to-slot',
        children: [
          { key: '', routeActive: false, active: true, text: 'Budget at Glance', route: '/budget-glance', page: '/budget-glance' },
          { key: '', routeActive: false, active: true, text: 'Sources and Uses', route: '/sources-uses', page: '/sources-uses' },
          { key: '', routeActive: false, active: true, text: 'WPA', route: '/work-program', page: '/work-program' },
          { key: '', routeActive: false, active: true, text: 'Budget and Expenses', route: '/budget-expenses', page: '/budget-expenses' },
          { key: '', routeActive: false, active: true, text: 'Collaboration', route: '/collaboration', page: '/collaboration' },
          { key: '', routeActive: false, active: true, text: 'Commitment Balance', route: '/commitment-balance', page: '/commitment-balance' },
          { key: '', routeActive: false, active: true, text: 'TRS & Staff Cost', route: '/trs-staffcost', page: '/trs-staffcost' },
          { key: '', routeActive: false, active: true, text: 'Travel', route: '/travel', page: '/travel' },
          { key: '', routeActive: false, active: true, text: 'External Funds', route: '/externalfunds', page: '/externalfunds' },
        ],
        expanded: false
      },
      {
        key: '', routeActive: false, active: true, text: 'Human Resources', page: '/hr-dashboard', route: '/hr-dashboard', prefixIconClass: 'fa-solid fa-users',
        children: [
          { key: '', routeActive: false, active: true, text: 'HR Staff On-Board', route: '/hr-dashboard', page: '' },
          { key: '', routeActive: false, active: true, text: 'Staff Flows', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Talent Management', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Workforce Planning', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Performance Management', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Policy Management', route: '', page: '' },
        ],
        expanded: false
      },
      {
        key: 'C-GRP-Home', routeActive: false, active: true, text: 'Trust Funds', page: 'tf/overview', route: 'tf/overview', prefixIconClass: 'far fa-earth-americas',
        children: [
          { key: 'C-GRP-TFlifecycle', routeActive: false, active: true, text: 'TF Lifecycle', route: 'tf/ibrdidatfs/tflifecycle', page: 'tf/ibrdidatfs/tflifecycle' },
          { key: 'C-GRP-BunsinessUnit', routeActive: false, active: true, text: 'Business Unit Views', route: 'tf/ibrdidatfs/businessunitviews', page: 'tf/ibrdidatfs/businessunitviews' },
          { key: 'C-GRP-TFReform', routeActive: false, active: true, text: 'TF Reform (MVP)', route: 'tf/ibrdidatfs/mvp', page: 'tf/ibrdidatfs/mvp' },
          { key: 'C-GRP-TFGrant', routeActive: false, active: true, text: 'TF Grants', route: 'tf/ibrdidatfs/tfgrants', page: 'tf/ibrdidatfs/tfgrants' },
          { key: 'C-GRP-Fact', routeActive: false, active: true, text: 'FAcT', route: 'tf/ibrdidatfs/fact', page: 'tf/ibrdidatfs/fact' },
          { key: 'C-GRP-PersonaViews', routeActive: false, active: true, text: 'Persona Views', route: 'tf/ibrdidatfs/umbrella-program', page: 'tf/ibrdidatfs/umbrella-program' },
          { key: 'C-GRP-Staff-Flows', routeActive: false, active: true, text: 'FIFs', route: 'tf/landing-fifs', page: 'tf/landing-fifs' },
        ],
        expanded: false
      },*/
      {
        key: 'C-GRP-Home', routeActive: false, active: true, text: 'Accounting', route: 'accounting', page: 'accounting', prefixIconClass: 'fa-light fa-calculator',
        children: [
          { key: 'C-GRP-Sourcesuses', routeActive: false, active: true, text: 'Accounts Payable', route: 'accounting/detail-page', page: 'accounting/detail-page' },
          { key: 'C-GRP-wpa', routeActive: false, active: true, text: 'Assurance & Quality Control', route: 'accounting/assurance-detail-page', page: 'accounting/assurance-detail-page' },
          { key: 'C-GRP-Commitmentbalance', routeActive: false, active: true, text: 'Travel Accouting', route: 'accounting/travelaccounting-detail-page', page: 'accounting/travelaccounting-detail-page' },
          { key: 'C-GRP-EFStaffcostrecovery', routeActive: false, active: true, text: 'Fixed Assets and Lease', route: 'accounting/fixedassets-detail-page', page: 'accounting/fixedassets-detail-page' },
          { key: 'C-GRP-Travel', routeActive: false, active: true, text: 'Country office Accounting', route: 'accounting/countryaccount-detail-page', page: 'accounting/countryaccount-detail-page' },
        ],
        expanded: false
      },
      /*{
        key: '', routeActive: false, active: true, text: 'Travel', route: '/travel', page: '/travel', prefixIconClass: 'far fa-plane-departure',
        children: [
          { key: '', routeActive: false, active: true, text: 'Overview', route: '', page: '' },
          { key: '', routeActive: false, active: true, text: 'Trip Details', route: '', page: '' },
        ],
        expanded: false
      },*/
    ];
    return tempmenulist;
  }
  updateDashboardUsageStatsDetails(id: string) {
    const pathname = window.location.pathname;
    const pathsview = decodeURI(this.router.url);
    const pathsname = pathname.split('/');
    let reportGrouping = ''; let reportName = ''; let reportType = ''; let filterInfo = ''; let reportId = ''; let pathModule = '';
    if (pathsname.includes('hr')) {
      pathModule = 'HR';
    } else if (pathsname.includes('bps')) {
      pathModule = 'BPS';
    } else if (pathsname.includes('co_finance')) {
      pathModule = 'Co Finance';
    } else if (pathsname.includes('accounting')) {
      pathModule = 'Accounting';
    } else if (pathsname.includes('tf')) {
      pathModule = 'Trust Fund';
    } else if (pathsname.includes('rasdashboard')) {
      pathModule = 'RAS';
    } else if (pathsname.includes('bps_reforms_ideas')) {
      pathModule = 'BPS';
    } else if (pathsname.includes('taggedmanagerdetails')) {
      pathModule = 'Tagged Manager';
    } else if (pathsname.includes('work-program')) {
      pathModule = 'WPA';
    } else if (pathsname.includes('budget-glance')) {
      pathModule = 'Budget-Glance';
    } else if (pathsname.includes('trs-staffcost')) {
      pathModule = 'TRS & StaffCost';
    } else if (pathsname.includes('sources-uses')) {
      pathModule = 'Sources & Uses';
    } else if (pathsname.includes('budget-expenses')) {
      pathModule = 'Budget & Expenses';
    } else if (pathsname.includes('qa-dashboard')) {
      pathModule = 'QA Dashboard';
    } else {
      pathModule = 'OPS';
    }

    const filter = pathsview.split('='); let filterview = '';
    if (filter.length > 1) {
      filterview = JSON.stringify(filter[1]);
    } else {
      filterview = '';
    }

    if (pathsname.includes('tf')) {
      reportName = pathsname.length > 3 ? pathsname[3] : (pathsname[2].toLowerCase() === 'overview' ? 'Home' : (pathsname[2].toLowerCase() === 'landing-fifs' ? 'fifs' : pathsname[2]));
      reportId = id;
      reportGrouping = pathsname.length > 3 ? (pathsname[3] === 'umbrella-program' || pathsname[3] === 'trusteettl' ? 'personaview' : pathsname[3]) : (pathsname[2].toLowerCase() === 'overview' ? 'Home' : (pathsname[2].toLowerCase() === 'landing-fifs' ? 'fifs' : pathsname[2]));
      reportType = 'Dashboard';
    }

    filterInfo = filterview;
    const url = window.location.href;
    const mail = this.userInfo.userEmail;
    const upi = this.userInfo.userUpi;
    const applicationName = 'Standard Report Beta - ' + pathModule;

    this.postusagestats(url, applicationName, reportGrouping, reportName, reportType, filterInfo, reportId, upi, mail).subscribe({
      next: (data) => {
        console.log('post data ==> ', data);
        if (data !== null) {
          sessionStorage.setItem(`${applicationName} - ${reportId}`, 'true');
        }
      },
      error: (err) => {
        console.log('post data error ==> ', err);
        if (err.status === 200) {
          sessionStorage.setItem(`${applicationName} - ${reportId}`, 'true');
        }
      }

    });
  }
  decimalpointconversion(value: any, decimalpoint: any) {
    const decimalvalue = (decimalpoint === 0) ? 1 : (decimalpoint === 1) ? 10 : (decimalpoint === 2) ? 100 : 100;
    return (Math.round(value * decimalvalue) / decimalvalue);
  }
}

