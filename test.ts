import { Component, Inject, Injectable, Injector } from '@angular/core';
import { NavigationExtras, Params, Router } from '@angular/router';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BreadcrumbItem } from '@lift/navigation';
import { CapabilitySelected } from '../models/capability.model';
import { Header, HeaderControls } from '../models/header.model';
import { LeftNav, LeftNavBack } from '../models/leftNav.model';
import { Navigation, Preferences, WidgetConfig } from '../models/preferences.model';
import { SplashScreenConfig } from '../models/splashscreen.model';
import { GridLayoutWidget, Widget } from '../models/widget.model';
import { Store } from '../types/store.type';
import { MsalService } from '@azure/msal-angular';

import { ProjectInfo } from '@lift/headers';
import { EventAnalytics, PageAnalytics } from '../models/analytics.model';
import { Configurations, Language } from './../models/configurations';
import { User } from './../models/user.model';
import { AnalyticsService } from './analytics.service';
import { Api } from './api.service';
import { AppInsightsService } from './app-insights.service';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import { ConfigurationService } from './configuration.service';
import { GridLayoutService } from './grid-layout.service';
import { SitePreferenceService } from './sitepreference.service';
import { SplashscreenService } from './splashscreen.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { UserPreferenceService } from './userpreference.service';
import { WidgetstoreService } from './widgetstore.service';
import { windowToken } from './window.service';
import { FormLayoutsService } from './form-layouts.service';
import { QuickLinksData } from '@lift/footers';

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  public menuBack$ = new Subject<Record<string, any>>();

  constructor(
    private api: Api,
    private appService: AppService,
    private storage: StorageService,
    private userService: UserService,
    private userPreferences: UserPreferenceService,
    private sitePreferenceService: SitePreferenceService,
    private widgetStoreService: WidgetstoreService,
    private configService: ConfigurationService,
    private msalService: MsalService,
    private injector: Injector,
    private cacheService: CacheService,
    private appInsightsService: AppInsightsService,
    private splashscreenService: SplashscreenService,
    private analyticsService: AnalyticsService,
    private gridLayoutService: GridLayoutService,
    private formLayoutsService: FormLayoutsService,
    @Inject(windowToken) private window: Window
  ) { }

  /**
   * Gets the handler whenever app state data is updated, an event is emitted.
   *
   * @returns `Observable<any>` contains the route params and site context info etc.,
   */
  public get appDataChanged$(): Observable<Record<string, any>> {
    return this.appService.appDataChanged$.asObservable();
  }

  /**
   * Gets the logged in user UPI and email. This API is application only when EMS Authentication is enabled.
   *
   * @returns An object with email as string and upi as `async` function. Please prefix `await` keyword while invoking upi method.
   */
  public get apiWhoIsLoggedIn(): { email: string; upi: () => Promise<string> } {
    return {
      email: this.userService.getLoggedUserEmail(),
      upi: async () => await this.userService.getLoggedInUserUpi()
    };
  }

  /**
   * @deprecated Please use `apiBreadcrumbClick$` instead!
   */
  public get breadcrumbClick$(): Observable<{ item: BreadcrumbItem; queryParams: string; list: Array<BreadcrumbItem> }> {
    return this.appService.breadCrumbClick$.asObservable();
  }

  /**
   * Emits the event when breadcrumb is clicked. It emits the item clicked and the complete breadcrumb list.
   *
   * @returns Observable<{ item: BreadcrumbItem; queryParams: any; list: Array<BreadcrumbItem> }>
   */
  public get apiBreadcrumbClick$(): Observable<{ item: BreadcrumbItem; queryParams: Record<string, any>; list: Array<BreadcrumbItem> }> {
    return this.appService.breadCrumbClick$.asObservable();
  }
  /**
   * CAUTION: This method is intended to use by internal Core Framework and shouldn't be used by App Teams!
   *
   * @param params URL params
   * @returns VOID
   */
  public _setleftNavRoute(params: Params): void {
    return this.appService.leftNavRoute$.next(params);
  }
  /**
   * CAUTION: This method is intended to use by internal Core Framework and shouldn't be used by App Teams!
   *
   * @param params URL params
   * @returns VOID
   */
  public _setWidgetStoreRoute(params: Params): void {
    this.appService.widgetStoreRoute$.next(params);
  }

  /**
   * Wrapper method for HTTP Get method
   *
   * @param url the url for Get operation
   * @param httpOptions Optional. Http options if any! Please refer the HTTPClient for various options.
   * (https://angular.io/api/common/http/HttpClient#get)
   * @returns observable with the HTTPResponse with a response body in the requested type
   */
  public apiHttpGet<T>(url: string, httpOptions?: Record<string, any>): Observable<T> {
    return this.api.get<T>(url, httpOptions);
  }
  /**
   * Wrapper method for HTTP Post method
   *
   * @param url the url for Post operation
   * @param body content for the Post Body
   * @param httpOptions Optional. Http options if any! Please refer the HTTPClient for various options.
   * (https://angular.io/api/common/http/HttpClient#post)
   * @returns observable with the results
   */
  public apiHttpPost<T>(url: string, body: Record<string, any>, httpOptions?: Record<string, any>): Observable<T> {
    return this.api.post<T>(url, body, httpOptions);
  }

  /**
   * Wrapper method for HTTP delete method
   *
   * @param url the url for delete operation
   * @param httpOptions Optional. Http options if any! Please refer the HTTPClient for various options.
   * (https://angular.io/api/common/http/HttpClient#delete)
   * @returns observable with the results
   */
  public apiHttpDelete<T>(url: string, httpOptions?: Record<string, any>): Observable<T> {
    return this.api.delete<T>(url, httpOptions);
  }

  /**
   * Wrapper method for HTTP Patch method
   *
   * @param url the url for Patch operation
   * @param body content for the Post Body
   * @param httpOptions Optional. Http options if any! Please refer the HTTPClient for various options.
   * (https://angular.io/api/common/http/HttpClient#patch)
   * @returns observable with the results
   */
  public apiHttpPatch<T>(url: string, body: Record<string, any>, httpOptions?: Record<string, any>): Observable<T> {
    return this.api.patch<T>(url, body, httpOptions);
  }

  /**
   * Wrapper method for HTTP Put method
   *
   * @param url the url for Put operation
   * @param body content for the Put Body
   * @param httpOptions Optional. Http options if any! Please refer the HTTPClient for various options.
   * (https://angular.io/api/common/http/HttpClient#put)
   * @returns observable with the results
   */
  public apiHttpPut<T>(url: string, body: Record<string, any>, httpOptions?: Record<string, any>): Observable<T> {
    return this.api.put<T>(url, body, httpOptions);
  }
  /**
   * Set Header configuration - title, breadcrumb, add Widget link etc.,
   *
   * @param header is of Header type
   * @returns FrameworkService
   */
  public apiSetHeader(header: Header): FrameworkService {
    this.appService.setHeader(header);
    return this;
  }
  /**
   * Returns the current header configuration of type `Header`
   */
  public apiGetHeader(): Header {
    return this.appService.getHeader();
  }
  /**
   * Show or hide the App Shell Header.
   *
   * @param state takes `boolean` input and based on that it shows and hides the header. Defaults to `true`
   * @returns FrameworkService
   */
  public apiToggleHeader(state: boolean = true): FrameworkService {
    this.appService.showHeader$.next(state);
    return this;
  }

  /**
   * Show or hide footer of the page
   *
   * @param status takes `boolean` input and based on that it shows and hides the footer.
   * `true` value shows the footer and `false` hides the footer
   * @returns FrameworkService
   */
  public apiToggleFooter(status: boolean): FrameworkService {
    this.appService.showFooter$.next(status);
    return this;
  }
  /**
   * Show or hide left navigation bar
   *
   * @param status takes `boolean` input and based on that it shows and hides the left menu.
   * @returns FrameworkService
   */
  public apiToggleLeftNav(status: boolean): FrameworkService {
    this.appService.showLeftNav$.next(status);
    return this;
  }

  /**
   * Get the site context data, may be specific to groups like Units where unit code is important to render the site.
   *
   * @param data - Object with key - value pair
   * @returns FrameworkService
   */
  public apiSetSiteContext(data: Record<string, any>): FrameworkService {
    this.appService.setSiteContext(data);
    return this;
  }

  /**
   *  Returns the value for the corresponding key. If no match found, it returns the full object.
   *
   * @param key Optional. key to retrieve the corresponding value in the context.
   * @returns `any`
   */
  public apiGetSiteContext(key?: string): any {
    return this.appService.getSiteContext(key);
  }

  /**
   * Store data at Application level. It also triggers AppDataChanged event which you can
   * subscribe for any change App level data change notifications.
   *
   * @param key `string` type as key
   * @param value `any` type for the value.
   * @return FrameworkService
   */
  public apiSetAppData(key: string, value: any): FrameworkService {
    this.appService.setAppData(key, value);
    return this;
  }

  /**
   * Returns the data for the key. If no match found, it returns the full object.
   *
   * @param key `string` to retrieve the corresponding value against the key.
   * @returns FrameworkService
   */
  public apiGetAppData(key: string): any {
    return this.appService.getAppData(key);
  }

  /**
   * Returns the defined `User` type set via `apiSetExternalUser` method.
   *
   * @return `User` type
   */
  public apiGetExternalUser(): User {
    return this.userService.getExternalUser();
  }
  /**
   * Retrieve the value stored for the corresponding key.
   *
   * @param key to retrieve the specific value of the key stored in the localStorage of browser!
   * @param store `Store` type  accepts - 'local' or 'session' which corresponds to respective type.
   * @returns `Observable<string>` result of the browser API.
   */
  public apiStorageGet(key: string, store: Store = 'local'): Observable<string> {
    return this.storage.get(key, store);
  }
  /**
   * Store the value for the specific key to localStorage!
   *
   * @param key unique string. If duplicate exists, it overwrites.
   * @param value Consider `JSON.Stringify()` the value.
   * @param store `Store` type  accepts - 'local' or 'session' which corresponds to respective type.
   * @return `Observable<string>` with 'success' for success 'failure' if it failed to retrieve.
   */
  public apiStorageSet(key: string, value: any, store: 'local' | 'session' = 'local'): Observable<string> {
    return this.storage.set(key, value, store);
  }

  /**
   * Returns the logged in user email id. If EMS Authentication is enabled, then it returns the logged in person's email id.
   * If third party login is enabled, then the custom set email id will be retrieved.
   *
   * @return `string` type of the logged in user email.
   */
  public apiGetLoggedUserEmail(): string {
    const isUserLogged = this?.msalService?.instance.getAllAccounts()?.length > 0;
    return isUserLogged ? (this.msalService.instance.getAllAccounts()?.[0]?.username ?? '') : '';
  }

  /**
   * Get the loggedIn User details invoking `https://graph.microsoft.com` API. The response is internally cached and fire ajax request
   * for the first time and subsequent requests are from cache for performance.
   *
   * @return `Observable<any>` response from the `https://graph.microsoft.com` API call.
   */
  public apiGetLoggedInUser(): Observable<Partial<User>> {
    return this.userService.getLoggedInUser();
  }

  /**
   * Get the widget level settings stored for the logged in user.
   *
   * @param widgetId `string` ID of the Widget.
   * @param page `string` pageId where the widget is residing.
   * @param global `boolean` Set to true to store the configuration separately,
   * else the configuration is stored along side the page settings.
   * @param configKey `string` unique key to store the value of the widget specific configuration
   * @return `any`
   */
  public apiGetUserWidgetPref(widgetId: string, page?: string, global?: boolean, configKey?: string): WidgetConfig {
    return this.userPreferences.getWidgetConfig(widgetId, page, global, configKey) as WidgetConfig;
  }
  /**
   * Updates the widget specific configuration to the Logged in User preferences.
   *
   * @param widgetId `string` widgetID for which the configuration is stored
   * @param key `string` Unique key to store the configuration
   * @param value `any` configuration to be stored
   * @param page `string` pageID where the widget is residing.
   * @param save `boolean` False - This flag accumulates all the updates to the widget configuration and when you send True, it
   * Will update the widget preferences.
   * @returns FrameworkService
   */
  public apiUpdateWidgetPreferences(widgetId: string, key: string, value: any, page?: string, save: boolean = true): FrameworkService {
    // If page is null, considered as global widget preference
    this.userPreferences.setWidgetConfig(widgetId, key, value, page, save);
    return this;
  }
  /**
   * Hides the widget ID's which are passed on. This API works like this -
   * Suppose the API is called to hide the `WID001`, it hides. Again if you call this API with another widget ID say `WID002`,
   * then it unhides `WID001` and hides `WID002`.
   * If you wish to hide widgets without unhiding the already hidden widgets, consider using - `apiHideWidgets()` & `apiShowWidgets` API
   *
   * @param list `Array<string>` list of Widget Id's
   * @return FrameworkService
   */
  public apiHideWidgets(widgetId: Array<string>): FrameworkService {
    this.appService.hideWidgets$.next(widgetId);
    return this;
  }
  /**
   * Show or hide the left menu item. pageId should be unique. If duplicate pageId exists, then it hides the first match.
   *
   * @param pageId `string`
   * @return FrameworkService
   */
  public apiToggleLeftMenuItem(pageId: string, blink: boolean = false): FrameworkService {
    this.appService.hideLeftMenuItem$.next({ id: pageId, blink, state: undefined, property: 'page' });
    return this;
  }
  /**
   * Returns the current left navigation model data which was used to render.
   *
   * @returns Array of `LeftNav` model
   */
  public apiGetLeftNavModel(): Array<LeftNav> {
    return this.appService.getLeftNavModel();
  }

  /**
   * Allows to set the left navigation model with custom properties other than the site preferences.
   *
   * @param model Array of LeftNav type
   * @param back `LeftNavBack` model which takes the text and link for setting.
   * @returns FrameworkService
   */
  public apiSetLeftNavModel(model: Array<LeftNav>, back?: LeftNavBack): FrameworkService {
    this.appService.setLeftNavModel(model, back);
    return this;
  }

  /**
   * Allows to dynamically Update the site title & navigation link
   *
   * @param siteTitle `{ title: string; link?: string; external?: boolean }`
   * @return FrameworkService
   */
  public apiUpdateSiteTitle(siteTitle: { title: string; link?: string; external?: boolean }): FrameworkService {
    this.appService.changeSiteTitle$.next(siteTitle);
    return this;
  }

  /**
   * Emits LeftNav model, when user clicks on left navigation back.
   *
   * @param data LeftNav Model
   * @returns VOID
   */
  public apiNavigateBack(data: Record<string, any>): void {
    this.menuBack$.next(data);
  }

  /**
   * Page Reset Api hook to subscribe when page reset option is clicked under Actions menu.
   *
   * @returns `Observable<boolean>`
   */
  public apiPageResetHook$(): Observable<boolean> {
    return this.appService.pageReset$.asObservable();
  }

  /**
   * Show or hide site title (Page Title) below the bread crumb
   *
   * @param state `boolean` Default value is true.
   * @returns FrameworkService
   */
  public apiToggleSiteTitle(state = true): FrameworkService {
    this.appService.toggleSiteTitle$.next(state);
    return this;
  }

  /**
   * Show or hide breadcrumb for the application.
   *
   * @param state `boolean` Default value is true.
   * @return FrameworkService
   */
  public apiToggleBreadcrumb(state = true): FrameworkService {
    this.appService.toggleBreadcrumb$.next(state);
    return this;
  }

  /**
   * Allows to save custom settings at App Level in User Preferences.
   *
   * @param key `string`
   * @param value `any`
   * @param save `boolean` Default value is true. You can pass `false` to this parameter to hold the settings in memory with out
   * saving to backend preferences which allows to batch the save requests.
   * @returns FrameworkService
   */
  public apiSetGlobalAppSettings(key: string, value: { [key: string]: any }, save: boolean = true): FrameworkService {
    this.userPreferences.setGlobalAppSettings(key, value, true, save);
    return this;
  }

  /**
   * Returns the global app settings saved from the User Preferences.
   *
   * @param key `string`
   * @returns `any` value stored with the passed in key.
   */
  public apiGetGlobalAppSettings(key: string): any {
    return this.userPreferences.getGlobalAppSettings(key);
  }

  /**
   * Returns the widget details for the passed in widget Id.
   *
   * @param widgetId `string`
   * @return `Widget` Type
   */
  public apiGetWidgetDetails(widgetId: string): Widget | null {
    return this.widgetStoreService.getWidgetdetails(widgetId);
  }

  /**
   * If the page has configured with page level setting then it return true else false.
   *
   * @param pageName `string` name of the page.
   * @return `boolean` value
   */
  public apiHasPageLevelConfig(pageName: string): boolean {
    return !!this.sitePreferenceService.hasPageLevelConfigEnabledForThisPage(pageName);
  }

  /**
   * Gets the Widget Name for the widget ID
   *
   * @param widgetId `string`
   * @return `string` Widget ID will be returned.
   * @deprecated Will be depreciated in future release. Please use `apiGetWidgetDetails` method to retrieve the widget releated details.
   */
  public apiGetWidgetName(widgetId: string): string {
    return this.widgetStoreService.getWidgetName(widgetId);
  }

  /**
   * Show or hide the loader in the content region. This API might be useful for showing the generic loader to
   * block the screen while loading the detail page etc.,
   *
   * @param state `boolean` Default value is true.
   * @return FrameworkService
   */
  public apiToggleContentLoader(state = true): FrameworkService {
    this.appService.contentLoader$.next(state);
    return this;
  }

  /**
   * Get the Framework configuration which is set in the App Module. This API helps to read the configuration
   * and act accordingly.
   *
   * @return `Configurations`
   */
  public apiGetConfiguration(): Configurations {
    return this.configService.config;
  }

  /**
   * This API works only for MSAL Authentication and allows to acquireToken for the given resource id.
   *
   * @param scope `string` - pass the scope of the resource. Ex: 'user.read' or
   * 'fbb05570-d4bb-4ea0-8950-e4f4a5a7fb4d/user_impersonation'.
   * @return Observable<AuthenticationResult> Returns the Observable of the token.
   */
  public apiAcquireToken(scope: string): Observable<AuthenticationResult> {
    const account = this.msalService.instance.getAllAccounts()[0];
    const scopes = [scope];

    return this.msalService.acquireTokenSilent({ scopes, account });
  }

  /**
   * Redirect the user to error page with the message.
   *
   * @param message `string` Error message to be displayed to the user.
   * @param skipLocationChange `boolean` decides whether to change the URL or retain the current URL and show the error message.
   * @param title `string`
   * @returns FrameworkService
   */
  public apiRedirectToNoAccessPage(message: string, skipLocationChange: boolean, title?: string): FrameworkService {
    this.cacheService.errorMessage = message;
    this.cacheService.title = title ?? '';
    const router = this.injector.get(Router);
    router.navigate(['error'], {
      queryParams: { type: 'NO_ACCESS' },
      skipLocationChange
    });
    return this;
  }

  /**
   * Programmatically trigger the navigation to the left navigation item.
   *
   * @param pageId `string` page id. If we pass `__root` as pageId,
   * then menu will be reset to the default root menu as per the site preferences.
   * @param url `string` url of the destination page
   * @param extras `NavigationExtras` Optional. This is same as Angular Routing extras.
   * @returns FrameworkService
   */
  public apiNavigateToMenuItem(pageId: string, url: string, extras?: NavigationExtras): FrameworkService {
    this.appService.navigateToMenuItem$.next(pageId);
    const router = this.injector.get(Router);
    router.navigateByUrl(url, extras);
    return this;
  }

  /**
   * Invoke this API to send the custom data to Adobe Analytics.
   *
   * @param pageAnalytics
   * @returns FrameworkService
   */
  public apiTrackPageWithAdobeAnalytics(pageAnalytics: PageAnalytics): FrameworkService {
    this.analyticsService.adobeAnalyticsTrackPage(pageAnalytics);
    return this;
  }

  /**
   * This is API is more of to check whether any particular left navigation item is enabled or not.
   * Left Navigation item is alias for Capability, which is generally used in Central applications.
   *
   * @param page `string` id of the page
   * @return `boolean` Returns true if the page is available and active and vice-versa.
   */
  public apiIsCapabilityAvailable(page: string): boolean {
    return this.userPreferences.isCapabilityEnabled(page);
  }

  /**
   * Triggers an event when Site, User & Widget preferences are fetched.
   *
   * @return `Observable<boolean>`
   */
  public apiPlatformReady(): Observable<boolean> {
    return this.appService.platformReady$.asObservable();
  }

  /**
   * Send page details to Microsoft App Insights for tracking purposes.
   * NOTE: Page load times are auto calculated. If you want more control on the load times, you can `apiStartTrackPage` &
   * `apiStopTrackPage`.
   *
   * @param pageAnalytics `string`
   * @return FrameworkService
   */
  public apiTrackMyPageWithAppInsights(pageAnalytics: PageAnalytics): FrameworkService {
    this.analyticsService.appInsightsTrackPage(pageAnalytics);
    return this;
  }

  /**
   * This API has to be used with caution. It works only for Units group of applications.
   * May be in future, we will expand to other groups.
   * NOTE: We're in plans to depreciate this API since the intended behavior is changed
   *
   * @param parentAppId - Parent Group ID: For Units it's APP001
   * @param key - Unique string which acts as a key
   * @param value - Value of type 'any'
   */
  public _apiSetDataToSitePreferences(parentAppId: string, key: string, value: any): Observable<any> {
    const unit = this.appService.getAppData('routeParams').unit;
    return this.sitePreferenceService.setKeyToSitePreferences(parentAppId, unit, key, value);
  }

  /**
   * This API has to be used with caution. It works only for Units group of applications.
   * NOTE: We're in plans to depreciate this API since the intended behavior is changed
   *
   * @param key `string`
   * @returns `any` Value stored against the key.
   */
  public _apiGetDataFromSitePreferences(key: string): any {
    return this.sitePreferenceService.getKeyFromSitePreferences(key);
  }

  /**
   * The Layout page emits an event once all widgets have been rendered. If no widgets are available, the event is triggered immediately.
   *
   * @returns `Observable<boolean>`
   */
  public apiLayoutRenderComplete(): Observable<boolean> {
    return this.appService.layoutRenderComplete$.asObservable();
  }

  /**
   * Display a dynamic maintenance message that supports HTML formatting.
   * If the HTML content includes anchor tags, any clicks will trigger the `apiNotificationLinkClick` event.
   * If you need to set a maintenance message for a specific time period, please make the necessary updates in the Site Preferences.
   *
   * @param message `string`
   * @returns FrameworkService
   */
  public apiShowNotificationMessage(message: string): FrameworkService {
    this.appService.maintenanceNotification$.next(message);
    return this;
  }

  /**
   * Send an error log to Microsoft App Insights.
   * This API will function only if App Insights is properly configured and has a valid Instrumentation key set.
   *
   * @param error `Error` object
   * @param upi
   * @param extraInfo `any` Key-Value pair of extra information which you wish to set along with the error object.
   * @return FrameworkService
   */
  public apiLogExceptionWithAppInsights(
    error: Error,
    upi: string | null = null,
    extraInfo: { [key: string]: string } = {}
  ): FrameworkService {
    this.appInsightsService.logException(error, upi, extraInfo);
    return this;
  }

  /**
   * Conceals the specified widget ID. This feature proves useful when you need to hide the widget under specific circumstances.
   *
   * @param widgetId `string`
   * @return FrameworkService
   */
  public apiHideWidget(widgetId: string): FrameworkService {
    this.appService.hideWidget$.next(widgetId);
    return this;
  }

  /**
   * Display the widget identified by the specified ID.
   *
   * @param widgetId `string`
   * @return FrameworkService
   */
  public apiShowWidget(widgetId: string): FrameworkService {
    this.appService.showWidget$.next(widgetId);
    return this;
  }

  /**
   * Triggers an event when the hamburger menu expands or collapses.
   *
   * @returns `Observable<string>` It emits this values - expanded' or 'collapsed'.
   */
  public apiLeftmenuToggled(): Observable<string> {
    return this.appService.leftNavstate$.pipe(map(item => (item === true ? 'expanded' : 'collapsed')));
  }

  /**
   * Triggers an event when the layout transitions between boxed and fluid modes.
   *
   * @returns `Observable<string>` emits 'fluid' or 'boxed'
   */
  public apiLayoutChanged(): Observable<string> {
    return this.appService.layoutChanged$.asObservable();
  }

  /**
   * Get the parent group site user preferences.
   * Use this API with caution!
   *
   * @returns Parent group user preferences response from backend!
   */
  public _apiGetRootUserSitePreferences(): Observable<any> {
    return this.userPreferences.getRootUserSitePreferences();
  }

  /**
   * Send an event on the page to Microsoft App Insights. May be critical operations like submitting a form can be posted to
   * analytics to notify the action and can be tracked for an errors.
   *
   * @param eventAnalytics `string` action type
   * @returns FrameworkService
   */
  public apiTrackEventWithAppInsights(eventAnalytics: EventAnalytics): FrameworkService {
    this.analyticsService.appInsightstrackEvent(eventAnalytics);
    return this;
  }

  /**
   * Retrieves the custom json stored against the site & their parents.
   *
   * @returns Array of `{ siteappid: string, customjson: string }`.
   */
  public apiGetCustomPreferences(): Array<{ siteappid: string; customjson: string }> {
    return this.sitePreferenceService.customPreferences;
  }

  /**
   * Handle to close the action menu. This API will be useful during the custom actions and you will have ability to choose on
   * when to close the opened menu.
   *
   * @param state `boolean`
   */
  public apiActionMenuToggle(state: boolean): FrameworkService {
    this.appService.actionsMenuToggle$.next(state);
    return this;
  }

  /**
   * Allows to save the custom JSON data to preferences db.
   *
   * @param json - JSON object with the data structure
   */
  public apiSaveCustomConfig(json: Record<string, any>): Observable<Preferences> {
    return this.sitePreferenceService.updateCustomJSON(json);
  }

  /**
   * Show or hide the header controls inlcude  - Search, Actions & Settings.
   *
   * @param headerControls `HeaderControls`
   */
  public apiToggleHeaderControls(headerControls: HeaderControls): FrameworkService {
    this.appService.headerControls$.next(headerControls);
    return this;
  }

  /**
   * Emits the left navigation model from the site preferences and also when the model is updated
   * via preference changes via left navigation reorder etc.,
   */
  public apiLeftNavModelReady(): Observable<Array<LeftNav>> {
    return this.appService.leftNavModelReady$.asObservable();
  }

  /**
   * @param state State of the left menu - collapsed or expanded.
   */
  public apiToggleLeftMenuState(state: boolean): FrameworkService {
    this.appService.leftNavstate$.next(state);
    return this;
  }

  /**
   * Toogle the App Header
   *
   * @param state `true` or `false`
   */
  public apiToggleAppHeader(state: boolean): FrameworkService {
    this.appService.toggleAppHeader$.next(state);
    return this;
  }

  /**
   * It returns the route params of the activated route. This will be applicable only which you set the `PlatformreadyGuard`.
   * This API will be useful to dyanimcally compute some logic from the route params to set the base root site id.
   */
  public apiRouteParams$(): Observable<{ [key: string]: string }> {
    return this.appService.routeParams$.asObservable().pipe(filter(params => params !== undefined));
  }

  /**
   * Emits the selected capability key along with the site name.
   *
   * @returns Observable<CapabilitySelected>
   */
  public apiSelectedCapability$(): Observable<CapabilitySelected> {
    return this.appService.selectedCapability$.asObservable();
  }

  /**
   * Turn ON or OFF the splashscreen.
   *
   * @param state boolean. Default value is true, which turns on the splashscreen.
   */
  public apiToggleSplashScreen(state: boolean = true, config?: SplashScreenConfig): FrameworkService {
    if (state) {
      this.splashscreenService.show(config);
    } else {
      this.splashscreenService.hide();
    }
    return this;
  }

  /**
   * Returns the App insights instance which was initialized.
   * This instance will allow to access all the exposed methods from the App Insights library!
   */
  public apiGetAppInsightInstance(): ApplicationInsights {
    return this.appInsightsService.appInsightsInstance;
  }

  /**
   * Emit LeftNav model when it updates or refreshes with new data!
   *
   * @returns `Observable<Array<LeftNav>>`
   */
  public apiLeftNavModelUpdated(): Observable<Array<LeftNav>> {
    return this.appService.leftNavUpdated$.asObservable();
  }

  /**
   * Toggle the entire Site Info section below the header.
   *
   * @param state `boolean`
   * @returns FrameworkService
   */
  public apiToggleSiteInfo(state: boolean): FrameworkService {
    this.appService.toggleSiteInfo$.next(state);
    return this;
  }

  /**
   * Redirect the user to error page with the message.
   *
   * @param message `string` Error message to be displayed to the user.
   * @param skipLocationChange `boolean` decides whether to change the URL or retain the current URL and show the error message.
   * @param title `string`
   * @returns FrameworkService
   */
  public apiRedirectToErrorPage(message: string, skipLocationChange: boolean, title?: string): FrameworkService {
    this.cacheService.errorMessage = message;
    this.cacheService.title = title ?? '';
    const router = this.injector.get(Router);
    router.navigate(['error'], {
      queryParams: { type: 'Error' },
      skipLocationChange
    });
    return this;
  }

  /**
   * ADAL / MSAL Only - Logout the currently singed in user!
   */
  public apiLogout(): FrameworkService {
    this.msalService.logout();
    return this;
  }

  /**
   * Get the site preferences state - parent, child & merged configuration.
   */
  public apiGetPreferenceState(): { parent: Preferences; child: Preferences; merged: Preferences } {
    return this.sitePreferenceService.getPrefState();
  }

  /**
   * Emits an even before the layouting starts!
   */
  public apiBeforeStartLayout(): Observable<boolean> {
    return this.appService.beforelayoutStart$.asObservable();
  }

  /**
   * Hide the menu item based on key property.
   * key is mandatory property to invoke this function. If you pass optional parameter, `state` then it will honor it, else, it will toggle.
   * `blink` property default value is false
   *
   * @param params { key: string, state?: boolean, blink: boolean }
   * @returns FrameworkService
   */
  public apiShowHideMenuItemOnKey(params: { key: string; state?: boolean; blink?: boolean }): FrameworkService {
    this.appService.hideLeftMenuItem$.next({
      id: params.key,
      blink: params?.blink ?? false,
      state: params?.state ?? undefined,
      property: 'key'
    });
    return this;
  }

  /**
   * Emits an event when either 'ICON1' or 'ICON2' custom icons are clicked.
   */
  public apiCustomIconClickHandler(): Observable<'ICON1' | 'ICON2'> {
    return this.appService.customHeaderIconClick$.asObservable();
  }

  /**
   * Emits the current state of user preferences after it saves to preferences DB
   */
  public apiWatchUserPref(): Observable<Record<string, any>> {
    return this.appService.userPreferenceUpdated$.asObservable();
  }

  /**
   * Emits an event once the user is logged in.
   * NOTE: Applicable only in the context of MSAL.
   */
  public apiIsUserLoggedIn(): Observable<boolean> {
    return this.appService.isUserLoggedIn$.asObservable();
  }

  /**
   * API to make the Graph Call, incase, if it's disabled on the startup.
   */
  public apiShowProfile(): void {
    this.appService.showProfile$.next(true);
  }

  /**
   * API to send user interaction to AdobeAnalytics analytics.
   *
   * @param eventAnalytics
   */
  public apiTrackEventWithAdobeAnalytics(eventAnalytics: EventAnalytics): void {
    this.analyticsService.adobeAnalyticsTrackEvent(eventAnalytics);
  }

  /**
   * Retrieves the external custom json stored against the site & their parents.
   *
   * @returns Array of `{ siteappid: string; externalcustomjson: string }`.
   */
  public apiGetExternalCustomPreferences(): Array<{ siteappid: string; externalcustomjson: string }> {
    return this.sitePreferenceService.externalCustomPreferences;
  }

  /**
   * Emits an event when anchor tags inside the notification message is clicked.
   */
  public apiNotificationLinkClick(): Observable<HTMLAnchorElement> {
    return this.appService.notificationClickHandler$.asObservable();
  }

  /**
   * Generates left nav based on the site & user preferences of navigation.
   */
  public apiGenerateMenu(parentPref: Navigation, childPref: Navigation): Navigation {
    return this.sitePreferenceService.generateLeftNavConfig(parentPref, childPref);
  }

  /**
   * Returns the profile object of the MSAL instance once logged in. It inlcudes the ID Token claims
   * and other relevant information of the logged in user.
   */
  public apiGetLoggedInUserProfile(): AccountInfo | null {
    return this.msalService?.instance?.getAllAccounts()?.[0] ?? null;
  }

  /**
   * Emits the label of the header menu clicked.
   *
   * @returns Observable of the menu clicked.
   */
  public apiOnHeaderMenuClick(): Observable<string> {
    return this.appService.headerMenu$.asObservable();
  }

  /**
   * This is part of the new `internal` App Type header. When clicked on the notification Icon, it emits an event
   *
   * @returns Observable<unknown>
   */
  public apiOnNotificationIconClick(): Observable<unknown> {
    return this.appService.notificationIconClick$.asObservable();
  }

  /**
   * This is part of the new `internal` App Type header. When clicked on the help Icon, it emits an event
   *
   * @returns Observable<unknown>
   */
  public apiOnHelpIconClick(): Observable<unknown> {
    return this.appService.helpIconClick$.asObservable();
  }

  /**
   * Applicable only for external App Type. When language is changed, it emits the selected one.
   *
   * @returns
   */
  public apiOnLanguageChange(): Observable<Language> {
    return this.appService.languageChange$.asObservable();
  }

  /**
   * Highlights the menu item. Applicable only if the header has menu items.
   *
   * @param label
   * @returns
   */
  public apiHighlightHeaderMenu(label: string): FrameworkService {
    this.appService.hightlightHeaderMenuItem$.next(label);
    return this;
  }

  /**
   * This API is alternative to `apiTrackMyPageWithAppInsights`. It should be used along with `apiStopTrackPage`.
   * When this API is called, this starts an internal timer and should call `apiStopTrackPage` to send the analytics.
   *
   * @param pageName Name of the page
   * @returns FrameworkService
   */
  public apiStartTrackPage(pageName: string): FrameworkService {
    this.appInsightsService.startTrackPage(pageName);
    return this;
  }

  /**
   * This API is should be used along with `apiStartTrackPage` to calculate the duration of the page.
   * NOTE: Please make sure the name of the page is similar to what you've provided for `apiStartTrackPage` method.
   *
   * @param pageName
   * @param url
   * @param extraInfo
   * @returns FrameworkService
   */
  public apiStopTrackPage(pageName: string, url: string, extraInfo: { [key: string]: string }): FrameworkService {
    this.appInsightsService.stopTrackPage(pageName, url, extraInfo);
    return this;
  }

  /**
   * This is the unified API to post page analytics data to both MS App Insights & Adobe Analytics.
   * NOTE: Use this API, only, if you wish to post to both the analytics, else, you can use respective analytics specific APIs.
   *
   * @param pageAnalytics
   */
  public apiTrackPageAnalytics(pageAnalytics: PageAnalytics): FrameworkService {
    this.analyticsService.trackPage(pageAnalytics);
    return this;
  }

  /**
   *  This is the unified API to post user action analytics data to both MS App Insights & Adobe Analytics.
   *  NOTE: Use this API, only, if you wish to post to both the analytics, else, you can use respective analytics specific APIs.
   *
   * @param eventAnalytics
   */
  public apiTrackEventAnalytics(eventAnalytics: EventAnalytics): FrameworkService {
    this.analyticsService.trackEvent(eventAnalytics);
    return this;
  }

  /**
   * NOTE: Use this API only when you set the `lazyUserPreferences` to true.
   * This will fetch the user preferences from the store.
   *
   * @returns Observable<any>
   */
  public apiLoadUserPreferences(): Observable<Preferences> {
    return this.userPreferences.populateUserPreferences();
  }

  /**
   * Toggle the project switcher.
   * NOTE: This works only with Ops Workspace header.
   */
  public apiToggleProjectSwitcher(state: boolean): FrameworkService {
    this.appService.toggleProjectSwitcher$.next(state);
    return this;
  }

  /**
   * Project dropdown state. Only applicable for Ops Workspace header
   *
   * @returns Observable<boolean>
   */
  public apiProjectSwitcherState(): Observable<boolean> {
    return this.appService.projectDropDownState$.asObservable();
  }

  /**
   * Emits the app name when app name is clicked inside launcher
   *
   * @returns Observable<string>
   */
  public apiLauncherAppClick(): Observable<string> {
    return this.appService.launcherAppClick$.asObservable();
  }

  /**
   * Ability to set the Project Information. Applicable only for Operation Workspace header.
   *
   * @param projectInfo Array<ProjectInfo>
   */
  public apiSetProjectInfo(projectInfo: Omit<ProjectInfo, 'settings'>): FrameworkService {
    this.appService.projectInfo$.next(projectInfo);
    return this;
  }

  /**
   * Toggle the project related context on the header. This API helps disabling the project context on demand.
   *
   * @param state boolean
   * @returns FrameworkService
   */
  public apiToggleProjectContext(state: boolean): FrameworkService {
    this.appService.toggleProjectContext$.next(state);
    return this;
  }

  /**
   * Toggle the launcher menu via API. Applicable only for Ops Workspace Apps.
   *
   * @param state boolean to flip the state
   * @returns Framework Service
   */
  public apiToggleLauncherMenu(state: boolean): FrameworkService {
    this.appService.toggleLauncherMenu$.next(state);
    return this;
  }

  public apiProjectInfoClicked(): Observable<'open' | 'close'> {
    return this.appService.projectInfoClick$.asObservable();
  }

  /**
   * Get the configuration for the grid layout component from DB
   *
   * @param pageType
   * @returns
   */
  public apiGetGLConfig(pageType: string): Observable<unknown> {
    return this.gridLayoutService.getConfiguration(pageType);
  }

  /**
   * Get the widget configuration for grid layout component from DB
   *
   * @param pageType
   * @param section
   * @returns
   */
  public apiGetGLWidgets(pageType: string, section: string): Observable<Array<GridLayoutWidget>> {
    return this.gridLayoutService.getWidgets(pageType, section);
  }

  /**
   *Get the user configuration for grid layout component from DB.
   *
   * @param pageType
   * @returns
   */
  public apiGetGLUserConfig(pageType: string): Observable<unknown> {
    return this.gridLayoutService.getUserConfiguration(pageType);
  }

  /**
   * Update the user config / delta back to the DB
   *
   * @param pageType
   * @param delta
   * @returns
   */
  public apiUpdateGLUserConfig(pageType: string, delta: Record<string, string>): Observable<unknown> {
    return this.gridLayoutService.updateUserConfiguration(pageType, delta);
  }

  /**
   * Toggle the responsive right side menu via API.
   *
   * @param state
   * @returns
   */
  public apiToggleMobileRightMenu(state: boolean): FrameworkService {
    this.appService.closeMobileRightMenu$.next(state);
    return this;
  }

  /**
   * Emits an event when App title is clicked. Right now, it's applicable only for Ops Workspace header.
   *
   * @returns
   */
  public apiAppTitleClick(): Observable<boolean> {
    return this.appService.appTitleClick$.asObservable();
  }

  /**
   * Returns the window reference.
   *
   * @returns Window
   */
  public apiGetWindowRef(): Window {
    return this.window;
  }

  /**
   * Toggle the form layout.
   *
   * @param state boolean
   * @param style Narrow or Wide
   * @returns FrameworkService
   */
  public apiToggleFormLayout(state: boolean, style: 'Narrow' | 'Wide' = 'Narrow'): FrameworkService {
    this.formLayoutsService.setFormLayouts(state, style);
    return this;
  }

  /**
   * Set the callback promise for the launcher app click.
   *
   * @param callback A function which returns a promise
   * @returns FrameworkService
   */
  public apiSetCallbackOnLauncherAppClick(callback: () => Promise<boolean>): FrameworkService {
    this.appService.launcherAppClickCallback$.next(callback);
    return this;
  }

  /**
   * Clear the user preferences and restores to default settings.
   *
   * @returns Observable<any>
   */
  public apiRestoreDefaultPreferences(): Observable<Preferences> {
    return this.userPreferences.savePreferences({});
  }

  /**
   * Notify the app to open the widget store.
   *
   * @returns Observable<boolean>
   */
  public apiNotifyToOpenWidgetStore(): Observable<boolean> {
    return this.appService.notifyToOpenWidgetStore$.asObservable();
  }

  /**
   * Emits an event when Intranet Footer QuickLink button is clicked. It's applicable only for Intranet Footer.
   *
   * @returns
   */
  public apiFooterQLClick(): Observable<boolean> {
    return this.appService.footerQLClick$.asObservable();
  }

  /**
   * Allows to set the Quick Links data for Intranet Footer
   *
   * @param model Array of QuickLinksData type
   * @param back `LeftNavBack` model which takes the text and link for setting.
   * @returns FrameworkService
   */
  public apiSetFooterQLData(model: Array<QuickLinksData>): FrameworkService {
    this.appService.footerQLData$.next(model);
    return this;
  }

  /**
   * Ability to load the component dynamically in the right trial.
   *
   * @param title title of the component
   * @param component Angular component. Make sure, you add the component to `entryComponents` section of App Module.
   * @param status Optional. Default value is `true`. It shows the component by default.
   */
  public apiLoadRightNavDynamicPage(title: string, component: Component, status = true, input?: any): FrameworkService {
    this.appService.loadRightNavPage$.next({
      title,
      component,
      status,
      input
    });
    return this;
  }

  /**
   * Show or hide the custom right trial.
   *
   * @param status `boolean` Default value is `true`.
   */
  public apiToggleRightNav(status: boolean = true): FrameworkService {
    this.appService.toggleRightNav$.next(status);
    return this;
  }

}


