onhandlesubChildclick(curntdata: any, childdata: any, vpu: any) {
  const category = curntdata.title;
  const value = curntdata[curntdata.childfacet];
  const name = curntdata[curntdata.childfacet];
  const id = curntdata.id;
  const Typenumber = (category === 'Approval FY') ? 'number' : 'string';

  const idx = this.FilterData.findIndex(x => x.value === value && x.category === category);
  if (idx > -1) {
    this.FilterData.splice(idx, 1);
    curntdata.checked = false;
  } else {
    this.FilterData.push({ category, value, name, id, facetType: curntdata.facetQuery, Typenumber, vpucategory: vpu });
    curntdata.checked = true;
  }

  this.FilterCount = this.FilterData.length;
  this.clearFilterFlag = '2';
}
