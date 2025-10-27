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
  