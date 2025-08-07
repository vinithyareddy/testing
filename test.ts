<div class="row tile-widget-bottomtext">
  <div class="col-sm-12 d-flex flex-column">
    <div class="d-flex align-items-center mt-3">
      <div class="budget-box-h3 textEliipsis mb-0">Forecast Sources</div>
      <div class="budget-box-right mb-0 ml-2">{{TotalSouces | number}}{{filterUnit}}</div>
    </div>
    <div class="d-flex align-items-center mt-1">
      <div class="budget-box-h3 textEliipsis mb-0">Forecast Uses</div>
      <div class="budget-box-right mb-0 ml-2">{{TotalUses | number}}{{filterUnit}}</div>
    </div>
  </div>
</div>


/* keep pairs tight and aligned */
.box-md .tile-widget-bottomtext .d-flex {
  justify-content: flex-start;
}

.box-md .tile-widget-bottomtext .budget-box-right {
  /* small gap between label and value */
  margin-left: .5rem;
  /* keep numbers aligned on baseline with label text */
  line-height: 1;
}
