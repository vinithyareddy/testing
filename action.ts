syncCheckedState(): void {
  const selectedFilters = this.BudgetGlance_Service.facetFilter;
  if (!this.filterjsonData || !selectedFilters) return;

  this.filterjsonData.forEach(category => {
    category.children.forEach(child => {
      // Level 1 options
      child.data?.forEach(option => {
        const match = selectedFilters.find(f =>
          f.id === child.key &&
          f.value?.toLowerCase() === option[child.measureQuery.code]?.toLowerCase()
        );
        option.checked = !!match;
      });

      // Level 2 (vpudata)
      child.vpudata?.forEach(vpu => {
        const match = selectedFilters.find(f =>
          f.id === vpu.id &&
          f.value?.toLowerCase() === vpu[vpu.childfacet]?.toLowerCase()
        );
        vpu.checked = !!match;

        // Level 3 (deptgrpdata)
        vpu.deptgrpdata?.forEach(deptgrp => {
          const match2 = selectedFilters.find(f =>
            f.id === deptgrp.id &&
            f.value?.toLowerCase() === deptgrp[deptgrp.childfacet]?.toLowerCase()
          );
          deptgrp.checked = !!match2;

          // Level 4 (deptdata)
          deptgrp.deptdata?.forEach(dept => {
            const match3 = selectedFilters.find(f =>
              f.id === dept.id &&
              f.value?.toLowerCase() === dept[dept.childfacet]?.toLowerCase()
            );
            dept.checked = !!match3;
          });
        });
      });
    });
  });
}
