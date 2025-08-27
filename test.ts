<input type="checkbox" class="form-check-input"
[id] = "resData[childData.measureQuery['code']] + '~' + i + j + k"
[title] = "resData[childData.measureQuery['name']]"
[attr.alt] = "childData.title"
[attr.disabled] = "resData.disable"
[value] = "resData[childData.measureQuery['code']]"
[(ngModel)] = "resData.checked"
  (change) = "onhandleclick(resData, childData)"
  [disabled] = "(childData.key === 'bgi%1' && resData[childData.measureQuery['code']] === 'N')" >

  <label class="form-check-label small-font"
  [for]="resData[childData.measureQuery['code']] + '~' + i + j + k"
  [innerHTML] = "resData[childData.measureQuery['name']]" > </label>



    < input type = "checkbox" class="form-check-input"
    [id] = "data1.crntdata[data1.crntdata.childfacet]"
    [value] = "data1.crntdata[data1.crntdata.childfacet]"
    [attr.disabled] = "data1.crntdata.disable"
    [(ngModel)] = "data1.crntdata.checked"
      (change) = "onhandlesubChildclick(data1.crntdata, data1.subdata, data1.vpuname)" >

      <label class="form-check-label small-font"
      [for]="data1.crntdata[data1.crntdata.childfacet]" >
        {{ data1.crntdata[data1.crntdata.childfacet] }}
</label>
