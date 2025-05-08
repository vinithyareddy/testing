FilterData.forEach((data, index) => {
    const [key, value] = data.split('~');
    this.filterjsonData.forEach(group => {
      group.children.forEach(child => {
        if (child.key === key && Array.isArray(child.data)) {
          child.data.forEach(item => {
            const itemValue = item[child.measureQuery.code]?.toString().toLowerCase();
            if (itemValue === value.toLowerCase()) {
              item.checked = true;
            }
          });
        }
      });
    });
  });
  