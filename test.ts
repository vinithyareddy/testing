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
