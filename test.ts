setTimeout(() => {
  const navModel = this.fwService.apiGetLeftNavModel();

  if (navModel && Array.isArray(navModel)) {
    navModel.forEach(m => {
      // collapse everything, including "Reports"
      if (m.settings) m.settings.collapsed = true;
      m.expanded = false;

      // extra guard: force-close Reports if its key or text matches
      if (
        m.key === 'C-GRP-Reports' ||
        (m.text && m.text.toLowerCase().includes('report'))
      ) {
        m.expanded = false;
        if (m.settings) m.settings.collapsed = true;
      }
    });

    // reapply collapsed model
    this.fwService.apiSetLeftNavModel([...navModel]);
  }
}, 500); // delay a bit more to override framework expansion
