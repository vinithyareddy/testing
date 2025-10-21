// Final safety: ensure dropdown groups are collapsed for every caller
tempmenulist = tempmenulist.map(item => {
  if (item.key === 'C-GRP-Reports' || item.key === 'C-GRP-IBRDIDA') {
    item.expanded = false;
    if (item.settings) item.settings.collapsed = true;
  }
  return item;
});
return tempmenulist;
