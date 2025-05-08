// ✅ Ensure checked status is restored from facetFilter
this.BudgetGlance_Service.facetFilter.forEach(saved => {
    this.filterjsonData.forEach(group => {
      group.children.forEach(child => {
        if (child.data && child.data.length > 0) {
          child.data.forEach(item => {
            const val = item[child.measureQuery.code];
            if (
              saved.category === child.title &&
              val?.toString().toLowerCase() === saved.value?.toString().toLowerCase()
            ) {
              item.checked = true;
            }
          });
        }
      });
    });
  });
  