/** Ensure every column (and group) has a header tooltip showing the full header name */
private setHeaderTooltips(colDefs: any[]): any[] {
  return colDefs.map((col: any) => {
    // Handle column groups with children
    if (col?.children && Array.isArray(col.children)) {
      return {
        ...col,
        headerTooltip: col.headerTooltip ?? col.headerName,
        children: this.setHeaderTooltips(col.children),
      };
    }
    // Leaf columns
    return {
      ...col,
      headerTooltip: col.headerTooltip ?? col.headerName,
    };
  });
}
