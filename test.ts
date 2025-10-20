menuList: any[] = [];

onToggle(key: string) {
  this.srServicesService.toggleMenuExpand(this.menuList, key);
  this.fwService.apiSetLeftNavModel(this.menuList);
}
