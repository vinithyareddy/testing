// --- FINAL override: disconnect Reports from router sync ---
setTimeout(() => {
  const model = this.fwService.apiGetLeftNavModel();
  if (!model) return;

  // Find the "Reports" node
  const reportsNode = model.find(m => m.key === 'C-GRP-Reports');
  if (reportsNode) {
    // Freeze it so the framework router listener can't mutate it again
    reportsNode.route = '';      // remove route mapping
    reportsNode.page = '';
    reportsNode.expanded = false;
    if (reportsNode.settings) reportsNode.settings.collapsed = true;

    // Defensive clone (break reference link with internal nav array)
    const newModel = JSON.parse(JSON.stringify(model));
    this.fwService.apiSetLeftNavModel(newModel);
  }

  console.log('✅ Reports node disconnected from router and collapsed');
}, 2500);
