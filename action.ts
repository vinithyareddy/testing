setTimeout(() => {
    const savedFilters = this.BudgetGlance_Service.facetFilter;
  
    if (savedFilters.length > 0 && this.filterjsonData.length > 0) {
      this.filterjsonData.forEach(group => {
        group.children.forEach(child => {
          if (child.data && child.data.length > 0) {
            child.data.forEach(item => {
              const match = savedFilters.find(
                f =>
                  f.category === child.title &&
                  f.value?.toString().toLowerCase() === item[child.measureQuery.code]?.toString().toLowerCase()
              );
              if (match) {
                item.checked = true;
              }
            });
          }
        });
      });
    }
  }, 300); // Ensures filterjsonData is ready
  

  const [filterKey, filterValue] = datas[idx].split('~');
      const filterMatch = FilterResData.find(f =>
        f.id === filterKey &&
        f.value?.toString().toLowerCase() === element[FilterResData[idx]?.facetType?.split('[')[1]?.split(']')[0]]?.toString().toLowerCase()
      );
      element.checked = !!filterMatch;
    });
  });

  this.getFilterData(datas, FilterResData, Resdatas, val);
});