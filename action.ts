setTimeout(() => {
    const savedFilters = this.BudgetGlance_Service.facetFilter;
  
    if (savedFilters?.length > 0) {
      console.log('[✅ Restore] Applying saved facet filters...');
  
      this.filterjsonData.forEach(group => {
        group.children.forEach(child => {
          if (Array.isArray(child.data)) {
            child.data.forEach(item => {
              const match = savedFilters.find(f =>
                f.category === child.title &&
                f.value?.toString().toLowerCase() === item[child.measureQuery.code]?.toString().toLowerCase()
              );
              item.checked = !!match;
            });
          }
        });
      });
  
      this.cdRef.detectChanges(); // ⬅️ Force UI to update
    }
  }, 300);
  