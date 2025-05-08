syncCheckedState(): void {
  const selectedFilters = this.BudgetGlance_Service.facetFilter;
  if (!this.filterjsonData?.length || !selectedFilters?.length) return;

  this.filterjsonData.forEach(category => {
    category.children.forEach(child => {
      const key = child.key;

      child.data?.forEach(option => {
        const optionCode = option[child.measureQuery.code];
        const match = selectedFilters.find(f =>
          f.id === key && f.value === optionCode
        );
        option.checked = !!match;
      });

      child.vpudata?.forEach(vpu => {
        const match = selectedFilters.find(f =>
          f.id === vpu.id && f.value === vpu[vpu.childfacet]
        );
        vpu.checked = !!match;

        vpu.deptgrpdata?.forEach(deptgrp => {
          const match2 = selectedFilters.find(f =>
            f.id === deptgrp.id && f.value === deptgrp[deptgrp.childfacet]
          );
          deptgrp.checked = !!match2;

          deptgrp.deptdata?.forEach(dept => {
            const match3 = selectedFilters.find(f =>
              f.id === dept.id && f.value === dept[dept.childfacet]
            );
            dept.checked = !!match3;
          });
        });
      });
    });
  });
}
