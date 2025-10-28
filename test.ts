.tf-header-title-info {
    cursor: pointer !important;
    width: 12px !important;
    height: 12px !important;
    gap: 2px !important;
    color: #0071bc !important;
    font-weight: 400 !important;
  }

  
  this.powerbirestService.collibrametaData.subscribe((metaData: any) => {
    if ('assets' in metaData && Array.isArray(metaData.assets)) {
      const reportDetail = metaData.assets.find(x => x.ReferenceNumber === 'RPT1');
      if (reportDetail) {
        this.reportInfo = reportDetail.description;
      }
    }
  });

  
  config: PopoverConfig = {
    placement: PopoverPositions.Top,
    adaptivePosition: true,
    container: 'body'
  };
  
  reportInfo = 'This section provides reports such as Top 10 Contributing Partners, Annual Contributions, and Annual Commitments and Disbursements.';
  

## done
generateSearchList() {
  const pagemodules = [];

  this.groupedReports.forEach(element => {
    element.values.forEach(y => {
      y.modulename = y.busArea;
      y.filterType = 'report';
      y.name = y.name;
      y.reportView = 'POWERBI';

      // 🔹 Match Collibra metadata by ReferenceNumber / rptNo
      const meta = this.collibraMetaList?.find(m =>
        m.ReferenceNumber?.trim()?.toLowerCase() === y.rptNo?.trim()?.toLowerCase()
      );

      if (meta) {
        y.description = meta.description || meta.Description;
        console.log(`✅ Matched ${y.rptNo}:`, y.description);
      } else {
        y.description = '';
        console.log(`⚠️ No Collibra match for ${y.rptNo}`);
      }

      pagemodules.push(y);
    });
  });

  const SearchProducts = [...pagemodules];
  this.data.items = SearchProducts;
  this.data = { ...this.data };
}


ngOnInit(): void {
  this.url = window.location.pathname.split('/');

  // 🔹 Step 1: Load Collibra Metadata first
  this.powerbirestService.getMetaData(this.powerbirestService.tfmetaDataUrl)
    .subscribe((meta: any) => {
      if (meta?.assets && Array.isArray(meta.assets)) {
        this.collibraMetaList = meta.assets;
        console.log('✅ Collibra metadata loaded:', this.collibraMetaList.length);
      } else {
        console.warn('⚠️ Collibra metadata empty or malformed:', meta);
      }

      // 🔹 Step 2: Now load Reports only after Collibra arrives
      this.ReportLoad();
    });
}