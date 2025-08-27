<input
  type="radio"
class="form-check-input"
[id] = "resData[childData.measureQuery['code']] + '_' + i + '_' + j"
name = "group_{{i}}_{{j}}"
[title] = "resData[childData.measureQuery['name']]"
[value] = "resData[childData.measureQuery['code']]"
[checked] = "resData.checked"
  (change) = "onhandleRadio(childData, resData)"
  />
