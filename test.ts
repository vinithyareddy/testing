<input type="checkbox" class="form-check-input"
[id] = "data1.crntdata[data1.crntdata.childfacet]"
[value] = "data1.crntdata[data1.crntdata.childfacet]"
[attr.disabled] = "data1.crntdata.disable"
[(ngModel)] = "data1.crntdata.checked"
  (change) = "onhandlesubChildclick(data1.crntdata, data1.subdata, data1.vpuname)" >

  <label class="form-check-label small-font"
  [for]="data1.crntdata[data1.crntdata.childfacet]" >
    {{ data1.crntdata[data1.crntdata.childfacet] }}
</label>
