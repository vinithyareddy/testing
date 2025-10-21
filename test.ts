// Reports menu – always same for both IBRD/IDA and others
const Reports = {
  key: 'C-GRP-Reports',
  routeActive: false,
  active: true,
  text: 'Reports',
  page: 'tf',
  route: 'tf',
  prefixIconClass: 'far fa-bar-chart',
  settings: { leftNavType: 'expand', collapsed: true, loadPage: false },
  children: [
    {
      key: 'C-GRP-My-Reports',
      routeActive: false,
      active: true,
      text: 'My Reports',
      route: 'tf/my-favorites',
      page: 'tf/my-favorites'
    }
  ],
  expanded: false // ⬅️ Forces collapsed on load
};
