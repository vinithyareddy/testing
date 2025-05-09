if (value_1 === value_2) {
  element3.checked = true;

  // ✅ Also check nested children if available
  if (element3.vpudata) {
    element3.vpudata.forEach(vpu => {
      if (vpu[element2.childfacet]?.toString().toLowerCase() === value_2) {
        vpu.checked = true;
      }
      if (vpu.deptgrpdata) {
        vpu.deptgrpdata.forEach(deptgrp => {
          if (deptgrp[deptgrp.childfacet]?.toString().toLowerCase() === value_2) {
            deptgrp.checked = true;
          }
          if (deptgrp.deptdata) {
            deptgrp.deptdata.forEach(dept => {
              if (dept[dept.childfacet]?.toString().toLowerCase() === value_2) {
                dept.checked = true;
              }
            });
          }
        });
      }
    });
  }

  DataFilter.push({
    category: element2.title,
    value: val.value,
    name: element3[element2.measureQuery.name],
    id: element2.key,
    facetType: element2.facetQuery,
    Typenumber: Datatype
  });
}
