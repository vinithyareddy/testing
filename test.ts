<input type="checkbox" class="form-check-input"
id = "{{resData[childData.measureQuery['code']]}}~{{i}}{{j}}{{k}}"
title = "{{resData[childData.measureQuery['name']]}}"
alt = "{{childData.title}}"[attr.disabled] = "resData.disable"
value = "{{resData[childData.measureQuery['code']]}}"
[(ngModel)] = "resData.checked"
  (click) = "onhandleclick($event,childData,refineData)"
  [disabled] = "(childData.key === 'bgi%1' && resData[childData.measureQuery['code']] === 'N') ? true : false" >

  <label class="form-check-label small-font"
for= "{{resData[childData.measureQuery['code']]}}~{{i}}{{j}}{{k}}"
[innerHTML] = "resData[childData.measureQuery['name']]"
  (click) = "onhandleclick($event,childData,refineData)" > </label>
