onhandleclick(resData: any, childData: any) {
  this.FilterCount = 0;
  const category = childData.title;
  const value = resData[childData.measureQuery['code']];
  const name = resData[childData.measureQuery['name']];
  const id = childData.key;
  const Typenumber = (category === 'Approval FY') ? 'number' : 'string';

  const idx = this.FilterData.findIndex(x => x.value === value && x.category === category);

  if (resData.checked && idx === -1) {
    this.FilterData.push({
      category, value, name, id,
      facetType: childData.facetQuery,
      Typenumber,
      vpucategory: ''
    });
  } else if (!resData.checked && idx !== -1) {
    this.FilterData.splice(idx, 1);
  }
  this.FilterCount = this.FilterData.length;
  this.clearFilterFlag = '1';
}
onhandlesubChildclick(crntdata: any, childdata: any, vpu: string) {
  this.FilterCount = 0;
  const category = crntdata.title;
  const value = crntdata[crntdata.childfacet];
  const name = crntdata[crntdata.childfacet];
  const id = crntdata.id;
  const Typenumber = (category === 'Approval FY') ? 'number' : 'string';

  const idx = this.FilterData.findIndex(x => x.value === value && x.category === category);

  if (crntdata.checked && idx === -1) {
    const filterdata = {
      category, value, name, id,
      checkedbox: true,
      facetType: crntdata.facetQuery,
      Typenumber,
      vpucategory: vpu
    };
    this.tempFilterData.push(filterdata);
    this.FilterData.push(filterdata);
  } else if (!crntdata.checked && idx !== -1) {
    this.FilterData.splice(idx, 1);
  }

  this.FilterCount = this.FilterData.length;
  this.clearFilterFlag = '2';
  this.refineload = 2;
}
