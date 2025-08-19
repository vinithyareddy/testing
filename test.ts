/** Force header tooltips globally by setting the title attribute on header cells */
private applyHeaderTooltips(): void {
  // Wait for the grid to finish laying out the header DOM
  setTimeout(() => {
  try {
    // Map colId -> tooltip text we want (headerTooltip || headerName)
    const tooltips: Record<string, string> = {};
    if (this.gridColumnApi) {
      this.gridColumnApi.getAllDisplayedColumns().forEach((col: any) => {
        const def = col.getColDef ? col.getColDef() : col.colDef;
        const text = (def && (def.headerTooltip || def.headerName)) || '';
        tooltips[col.getColId ? col.getColId() : col.colId] = text;
      });
    }

    // Set the title attribute on each header cell text
    const headerCells = document.querySelectorAll('.ag-header-cell[col-id]');
    headerCells.forEach((cell: Element) => {
      const colId = (cell as HTMLElement).getAttribute('col-id') || '';
      const textEl = cell.querySelector('.ag-header-cell-text') as HTMLElement | null;
      const title = tooltips[colId] || (textEl?.textContent?.trim() || '');
      if (textEl && title) {
        textEl.setAttribute('title', title);
      }
    });
  } catch (e) {
    // no-op safeguard
    // console.warn('applyHeaderTooltips failed', e);
  }
}, 0);
}
