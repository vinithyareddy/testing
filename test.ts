/** Recursively sets headerTooltip = headerName for all columns & groups */
private setHeaderTooltips(colDefs: any[]): any[] {
  return colDefs.map((col: any) => {
    // if this is a group with children, recurse
    if (col.children && Array.isArray(col.children)) {
      return {
        ...col,
        headerTooltip: col.headerTooltip ?? col.headerName, // group tooltip too (optional)
        children: this.setHeaderTooltips(col.children),
      };
    }
    // normal leaf column
    return {
      ...col,
      headerTooltip: col.headerTooltip ?? col.headerName
    };
  });
}
