onhandleRadio(childData: any, resData: any) {
  const category = childData.title;
  const value = resData[childData.measureQuery['code']];
  const name = resData[childData.measureQuery['name']];
  const id = childData.key;
  const Typenumber = (category === 'Approval FY') ? 'number' : 'string';

  // clear old selection
  this.FilterData = this.FilterData.filter(x => x.category !== category);

  // mark checked
  (childData.data || []).forEach((r: any) => r.checked = false);
  resData.checked = true;

  this.FilterData.push({ category, value, name, id, facetType: childData.facetQuery, Typenumber, vpucategory: '' });
  this.FilterCount = this.FilterData.length;
  this.clearFilterFlag = '1';
}
