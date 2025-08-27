onhandleclick(childData: any, resData: any) {
  const category = childData.title;
  const value = resData[childData.measureQuery['code']];
  const name = resData[childData.measureQuery['name']];
  const id = childData.key;
  const Typenumber = (category === 'Approval FY') ? 'number' : 'string';

  // if already selected, remove
  const idx = this.FilterData.findIndex(x => x.value === value && x.category === category);
  if (idx > -1) {
    this.FilterData.splice(idx, 1);
    resData.checked = false;
  } else {
    this.FilterData.push({ category, value, name, id, facetType: childData.facetQuery, Typenumber, vpucategory: '' });
    resData.checked = true;
  }

  this.FilterCount = this.FilterData.length;
  this.clearFilterFlag = '1';
}
