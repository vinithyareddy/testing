if (this.FilterData.length > 0) {
  setTimeout(() => {
    this.syncAllDropdownStates();
    this.cd.detectChanges(); // 👈 ensures Angular reflects the model changes
  }, 0);
}
