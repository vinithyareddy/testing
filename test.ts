{
  key: 'C-GRP-Reports',
  routeActive: false,
  active: true,
  text: 'Reports',
  // 👇 break route match completely
  page: '',
  route: '',
  prefixIconClass: 'far fa-bar-chart',
  settings: { leftNavType: 'expand', collapsed: true, loadPage: false },
  children: [
    {
      key: 'C-GRP-My-Reports',
      routeActive: false,
      active: true,
      text: 'My Reports',
      // ✅ this stays functional
      route: 'tf/my-favorites',
      page: 'tf/my-favorites'
    }
  ],
  expanded: false
}
