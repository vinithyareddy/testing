// ORIGINAL CODE - COMMENT THIS OUT OR DELETE:
// if (!isIbrdIda) {
//   ReportList = [{
//     ...with children and leftNavType
//   }];
// } else {
//   ReportList = [{
//     ...with leftNavType
//   }];
// }

// NEW CODE - Reports never expands on this page:
ReportList = [{
  key: 'C-GRP-Reports', 
  routeActive: false, 
  active: true, 
  text: 'Reports', 
  page: 'tf', 
  route: 'tf', 
  prefixIconClass: 'far fa-bar-chart',
  settings: { 
    collapsed: true, 
    loadPage: false 
  }
  // NO leftNavType, NO children, NO expanded property AT ALL
}];