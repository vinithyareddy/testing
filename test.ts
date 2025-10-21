// --- Force-collapse all after framework finishes rendering ---
setTimeout(() => {
  const model = this.fwService.apiGetLeftNavModel();

  if (model && Array.isArray(model)) {
    model.forEach(item => {
      if (item.key === 'C-GRP-Reports' || item.key === 'C-GRP-IBRDIDA') {
        item.expanded = false;
        if (item.settings) item.settings.collapsed = true;
      }
    });

    // Push back to framework
    this.fwService.apiSetLeftNavModel(model);

    // Optional: dispatch an event to refresh the UI
    const navElem = document.querySelector('.left-nav');
    if (navElem) navElem.dispatchEvent(new Event('refresh'));
  }

  console.log('✅ Forced collapse applied to Reports and IBRD/IDA');
}, 2000); // wait longer than framework auto-expand timing
