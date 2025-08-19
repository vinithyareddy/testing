
class TitleHeaderComp implements IHeaderComp {
  private eGui!: HTMLDivElement;
  private textEl!: HTMLSpanElement;

  init(params: IHeaderParams): void {
    const display = params.displayName || '';
    this.eGui = document.createElement('div');
    this.eGui.className = 'ag-header-cell-label';
    this.eGui.title = display; // native tooltip

    this.textEl = document.createElement('span');
    this.textEl.className = 'ag-header-cell-text';
    this.textEl.textContent = display;

    // keep space for sort icons so layout doesn't jump
    const sortEl = document.createElement('span');
    sortEl.className = 'ag-sort-indicator';

    this.eGui.appendChild(this.textEl);
    this.eGui.appendChild(sortEl);
  }

  getGui(): HTMLElement { return this.eGui; }

  refresh(params: IHeaderParams): boolean {
    const display = params.displayName || '';
    this.eGui.title = display;
    if (this.textEl) this.textEl.textContent = display;
    return true;
  }
}

/** Header for grouped column headers – also sets native tooltip */
class TitleHeaderGroupComp implements IHeaderGroupComp {
  private eGui!: HTMLDivElement;
  private textEl!: HTMLSpanElement;

  init(params: IHeaderGroupParams): void {
    const name =
      (params as any).displayName ||
      (params as any).columnGroup?.getColGroupDef?.()?.headerName ||
      (params as any).columnGroup?.getProvidedColGroupDef?.()?.headerName ||
      '';

    this.eGui = document.createElement('div');
    this.eGui.className = 'ag-header-group-cell-label';
    this.eGui.title = name;

    this.textEl = document.createElement('span');
    this.textEl.className = 'ag-header-group-text';
    this.textEl.textContent = name;

    const icon = document.createElement('span');
    icon.className = 'ag-header-group-icon';

    this.eGui.appendChild(this.textEl);
    this.eGui.appendChild(icon);
  }

  getGui(): HTMLElement { return this.eGui; }

  refresh(params: IHeaderGroupParams): boolean {
    const name =
      (params as any).displayName ||
      (params as any).columnGroup?.getColGroupDef?.()?.headerName ||
      (params as any).columnGroup?.getProvidedColGroupDef?.()?.headerName ||
      '';
    this.eGui.title = name;
    if (this.textEl) this.textEl.textContent = name;
    return true;
  }
}
