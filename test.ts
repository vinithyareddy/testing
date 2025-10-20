this.menuList = this.srServicesService.getTFMenuList(true);

// collapse all dropdowns when page loads
this.menuList.forEach(item => {
  if (item.settings) item.settings.collapsed = true;
  item.expanded = false;
});

this.fwService.apiSetLeftNavModel(this.menuList);
