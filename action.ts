// 🔁 Update checked states in filterjsonData from applied filters
this.filterjsonData.forEach(group => {
    group.children.forEach(child => {
      if (child.data && child.data.length > 0) {
        child.data.forEach(item => {
          const match = this.BudgetGlance_Service.facetFilter.find(
            f =>
              f.category === child.title &&
              f.value?.toString().toLowerCase() === item[child.measureQuery.code]?.toString().toLowerCase()
          );
          item.checked = !!match;
        });
      }
    });
  });
  