<div class="col-lg-3 col-md-3 pe-0 printhide" style="text-align:end;">
    @if(pageTitle !== 'AI Search Results' && pageTitle !== 'Prompt Library'){
    @if (isFilterVisible()) {
    <span class="tagviewShow" (click)="refinerOpen()">
        <div class="">
            <lift-tag text="Filter" [size]="smallSize" [readOnly]="true" [active]="tagActive"
                image="../../assets/images/sliders.svg">
            </lift-tag>
        </div>
    </span>
    }
    @if (!isFilterVisible()) {
    <span class="tagviewShow disabled" title="Filter option is not available">
        <lift-tag text="Filter" [disabled]="true" [size]="smallSize" [readOnly]="true"
            image="../../assets/images/sliders.svg">
        </lift-tag>
    </span>
    }
    }
</div>

@if(pageTitle !== 'AI Search Results' && pageTitle !== 'Prompt Library'){
  <div class="row date-row-height">
      <div class="col-lg-3 col-md-3 ps-0">
          @if (pageTitle === 'Overview') {
          <div class="col-md-12 col-lg-12 text-left ps-0 pt-2">
              <div class="ps-0  d-inline-block"><span class="fnt-md align-text-middle">{{dataasofdate}}</span>
              </div>
          </div>
          }
          @if (pageTitle != 'Overview') {
          <div class="col-md-12 col-lg-12 text-left ps-0 pt-2">
              <div class="d-inline-block">
                  <span class="fnt-md align-text-middle">{{dataasofdate}}</span>
              </div>
          </div>
          }
      </div>
      <div class="col-lg-9 col-md-9 pe-0 d-inline-block bgt-text-end printhide"
          style="align-self: flex-end;text-align:end;">
          @if (isDownloadVisible()) {
          <button type="button" class="btn btn-outline-primary enabled"
              styleSheetFile="assets/css/tfprintbootstap.min.css, assets/css/trust-funds-print.css"
              printSectionId="print-section" [printTitle]="pageTitle" ngxPrint><img
                  src="assets/images/Download.png">&nbsp;&nbsp; Download</button>
          }
      </div>
  </div>
  }