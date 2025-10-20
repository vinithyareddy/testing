toggleMenuExpand(menuList: any[], key: string) {
  menuList.forEach(item => {
    if (item.key === key) {
      item.expanded = !item.expanded;
      item.settings.collapsed = !item.expanded;
    } else {
      item.expanded = false;
      item.settings.collapsed = true;
    }
  });
}


// Ensure both menus start collapsed
tempmenulist.forEach(m => {
  m.expanded = false;
  if (m.settings) m.settings.collapsed = true;
});
this.fwService.apiSetLeftNavModel(tempmenulist);
