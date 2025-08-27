<ng-template #listchildview let - data1 >
  <div class="row"[class.disableview] = "data1.disable === true" >
    <div class="col-md-10 form-group form-check mt-1 width-left formgcheckbox" >
      <div[ngClass]="data1.step === 1 ? 'pl-2' : data1.step === 2 ? 'pl-3' : data1.step === 3 ? 'pl-4': data1.step === 4 ? 'pl-5' : 'pl-6'" >

        @let sid = safeId('sub', data1.step + '_' + data1.vpuCode + '_' + (data1.crntdata[data1.crntdata.childfacet] ?? ''));

<input type="checkbox" class="form-check-input"
[id] = "sid"
[value] = "data1.crntdata[data1.crntdata.childfacet]"
[disabled] = "!!data1.crntdata.disable"
[(ngModel)] = "data1.crntdata.checked"
  (change) = "onhandlesubChildclick(data1.crntdata, data1.subdata, data1.vpuCode)" >

  <label class="form-check-label small-font"[for]="sid" >
    {{ data1.crntdata[data1.crntdata.childfacet] }}
</label>
  </div>
  </div>

@if (data1.crntdata.subchildview === true) {
  <div class="col-md-2 float-right margChild"
    (click) = "onhandlesubChildload(data1.crntdata, data1.subdata, data1.crntdata[data1.crntdata.childfacet], data1.vpuCode)" >
    <span class="txt-right-end" >
      @if (!data1.crntdata.arrowview) { <i class="fa fa-angle-down faicon" aria - hidden="true" > </i> }
  @if (data1.crntdata.arrowview) { <i class="fa fa-angle-up faicon"   aria - hidden="true" > </i> }
  </span>
    </div>
}
</div>
  </ng-template>
