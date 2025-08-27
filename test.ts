<div class="refiner position-relative" >

  <div class="refiner-header" >

    <div class="d-flex justify-content-between align-items-center pl-1" >

      <div class="refiner-title" > Filters </div>

        < div >




        <!-- < a class="text-uppercase font-weight-bold color-white"(click) = "clearFilter()" href = "javascript:;" > Clear

          ({{ FilterCount }}) </> -->

          < lift - button[type]="buttonGhost" class="p-1" text = "Clear ({{FilterCount}})"(click) = "clearFilter()"

          [size] = "buttonSmall" > </>

            & nbsp;

<lift-button[type]="buttonPrimary"(click) = "applyFilter()" text = "Apply"

[size] = "buttonSmall" > </lift-button>

< !-- < a class="refiner-btn-option text-uppercase font-weight-bold"(click) = "applyFilter()"

href = "javascript:;" > Apply </> &nbsp; -->

  & nbsp;& nbsp;& nbsp;& nbsp;& nbsp;

<span class="refiner-close"(click) = "closeRefiner()" > <i class="fas fa-times" > </i></span >

  </div>




  </div>

  </div>

  < div class="refiner-scroll" >

    <div class="row  subordinate-option" >

      <div class="col-md-6 pl-4 form-group form-check" >

        <input type="checkbox" class="form-check-input" id = "subordinate" title = "subordinate" alt = "subordinate"

        [(ngModel)] = "subordinatestatus"(change) = "onsubordinateclick()" />

        <h6 class="form-check-label subordinate-font" > Include Subordinate </h6>

          </div>

          < div class="col-md-6" style = "text-align: right;" >

            <lift-button[type]="buttonPrimary"(click) = "SetdefaultFilter()"[size] = "buttonSmall"

text = "Set as default" > </lift-button>

  </div>

  </div>

@for (refineData of filterjsonData; track refineData; let i = $index) {


 

        @if (refineData.listview === true) {




  <lift-accordion >

    <lift-accordion - item(click)="LoadChildData(refineData.children)"[open] = "refineData.open" class="mt-0" >

      <div title class="refinby-cat-header" >

        <h6>{{ refineData.title }
} </h6>

  </div>

@if (refineData.title === 'VPU Group') {




  <angular2-multiselect[data]="vpuItemList"[(ngModel)] = "selectedItemsvpugroup"

  [settings] = "dropdownSettings"(onSelect) = "onItemSelectvpugroup($event)"

    (onDeSelect) = "OnItemDeSelect($event)" > </angular2-multiselect>




}

@if (refineData.title === 'Fund Center') {




  <angular2-multiselect[data]="vpuItemList"[(ngModel)] = "selectedItems"[settings] = "dropdownSettings"

    (onSelect) = "onItemSelect($event)"(onDeSelect) = "OnItemDeSelect($event)" > </angular2-multiselect>




}

@if (refineData.title === 'Requesting VPU Group') {




  <angular2-multiselect[data]="costObjReqItemList"[(ngModel)] = "cost_obj_req_selectedItems"

  [settings] = "dropdownSettings"(onSelect) = "onItemSelectcostReq($event)"

    (onDeSelect) = "OnItemDeSelect($event)" > </angular2-multiselect>




}

@if (refineData.title === 'Responsible VPU Group') {




  <angular2-multiselect[data]="costObjResItemList"[(ngModel)] = "cost_obj_res_selectedItems"

  [settings] = "dropdownSettings"(onSelect) = "onItemSelectcostRes($event)"

    (onDeSelect) = "OnItemDeSelect($event)" > </angular2-multiselect>




}

@if (refineData.title === 'WPA Requesting VPU Group') {




  <angular2-multiselect[data]="wpaReqItemList"[(ngModel)] = "wpa_req_selectedItems"

  [settings] = "dropdownSettings"(onSelect) = "onItemSelectwpaReq($event)"

    (onDeSelect) = "OnItemDeSelect($event)"(onSelectAll) = "onSelectAll($event)"

      (onDeSelectAll) = "onDeSelectAll($event)" > </angular2-multiselect>




}

@if (refineData.title === 'WPA Responsible VPU Group') {




  <angular2-multiselect[data]="wpaResItemList"[(ngModel)] = "wpa_res_selectedItems"

  [settings] = "dropdownSettings"(onSelect) = "onItemSelectwpaRes($event)"

    (onDeSelect) = "OnItemDeSelect($event)"(onSelectAll) = "onSelectAll($event)"

      (onDeSelectAll) = "onDeSelectAll($event)" > </angular2-multiselect>




}

<ng-container >

  @for (childData of refineData.children; track childData; let j = $index) {


 

                    <div class="refinebylist"[ngClass] = "(j < refineData.children.length-1) ? 'border-bottom' : ''" >

  @if (spinnerload && childData.data.length === 0) {




    <img src="assets/images/loader.gif" width = "25px" >


 

                        }

@if (refineData.children.length > 1) {

  <div title class="refinby-cat-header pb-2" >

    <h6>{{ childData.title }
} </h6>

  </div>

                        }

@if (childData.searchable === true) {




  @if ((childData.data.length > 5)) {

    <div class="form-group" >

      <div class="input-group" >




        <input type="text" class="form-control searchbox-input"

        [(ngModel)] = "childData.filterSearch" placeholder = "Search" >

          <div class="searchbox-icon" >

            <span class="fa fa-search search-input-icon1 form-control-feedback" > </span>

              </div>

              </div>

              </div>





  }




}

@if (childData.data.length > 0) {

  <ul>

    @for (resData of childData.data | filter: childData.filterSearch; track resData; let k =

      $index) {


 

                            @if (((!childData.showMore || (childData.showMore === true && k < childData.showMoreLimit))

    && resData[childData.measureQuery['name']] !== '')) {
    <li class="pb-1 pt-1" >

      <!--row ml - 0 p - 0 -- >

        <div class="row" >

          <div class="col-md-10 form-group form-check" >

            @if (refineData.title !== 'VPU Group' &&

              refineData.title !== 'Requesting VPU Group'

              && refineData.title !== 'Responsible VPU Group' &&

              refineData.title !== 'WPA Requesting VPU Group'

              && refineData.title !== 'WPA Responsible VPU Group') {

      @if ((childData.type === 'checkbox')) {

        <input type="checkbox" class="form-check-input"

        [id] = "resData[childData.measureQuery['code']] + '~' + i + j + k"

        [title] = "resData[childData.measureQuery['name']]"

        [value] = "resData[childData.measureQuery['code']]"

        [(ngModel)] = "resData.checked"(change) = "onhandleclick(childData, resData)"

        [disabled] = "(childData.key === 'bg1%1' && resData[childData.measureQuery['code']] === 'N')" >

                                        }

      @if ((childData.type === 'radiobox')) {




        <input type="radio" class="form-check-input"

        [id] = "resData[childData.measureQuery['code']] + '_' + i + '_' + j"

        name = "group_{{i}}_{{j}}"[title] = "resData[childData.measureQuery['name']]"

        [value] = "resData[childData.measureQuery['code']]"

        [checked] = "resData.checked"(change) = "onhandleRadio(childData, resData)" />


 

                                        }




    }

    @if (refineData.title === 'VPU Group' ||

      refineData.title === 'Requesting VPU Group' ||

      refineData.title === 'Responsible VPU Group' ||

      refineData.title === 'WPA Requesting VPU Group'

      || refineData.title === 'WPA Responsible VPU Group') {




      <label class="form-check-label small-font marleft"

      for= "{{resData[childData.measureQuery['code']]}}~{{i}}{{j}}{{k}}"

      [innerHtml] = "resData[childData.measureQuery['name']]"

        (click) = "onhandleDropdownclick($event,childData,refineData, resData[childData.measureQuery['name']],resData)" > {{ resData[childData.measureQuery['name']]}} </label>




  }

  @if (refineData.title !== 'VPU Group' &&

    refineData.title !== 'Requesting VPU Group'

    && refineData.title !== 'Responsible VPU Group'

    && refineData.title !== 'WPA Requesting VPU Group'

    && refineData.title !== 'WPA Responsible VPU Group') {




    <label class="form-check-label small-font"

    [for]="resData[childData.measureQuery['code']] + '~' + i + j + k"

    [innerHTML] = "resData[childData.measureQuery['name']]" > </label>




  }

  </div>

  @if (childData.subchildview === true) {

    <div class="col-md-2"

      (click) = "onhandleDropdownclick($event,childData,refineData, resData[childData.measureQuery['name']],resData)" >

      <span class="txt-right-end" > @if (!resData.arrowview) {

        <i class="fa fa-angle-down faicon" aria - hidden="true" > </i>

      }

    @if (resData.arrowview) {

      <i class="fa fa-angle-up faicon" aria - hidden="true" > </i>

    } </span>

      </div>

  }

  </div>




  @if (childData.vpudata !== undefined && childData.vpudata.length > 0 &&

    resData[childData.measureQuery['name']] === keyvalue && resData.arrowview) {




    @for (val of childData.vpudata; track val; let z = $index) {


 

                                <!----- VPU-- >

      <ng-container

      * ngTemplateOutlet="listchildview; context:{$implicit:{crntdata:val,vpuname:resData[childData.measureQuery['name']], subdata:childData, disable:resData.checked, step:1}}" > </ng-container>

        < !----- Dept group---->

          @if (val.deptgrpdata !== undefined && val.deptgrpdata.length > 0 && val.arrowview ===

            true) {




      @for (deptgrp of val.deptgrpdata; track deptgrp; let z = $index) {


 

                                <ng-container

        * ngTemplateOutlet="listchildview; context:{$implicit:{crntdata:deptgrp,vpuname:resData[childData.measureQuery['name']], subdata:childData, disable:resData.checked, step:2}}" > </ng-container>

          < !----- Dept-- >

            @if (deptgrp.deptdata !== undefined && deptgrp.deptdata.length > 0 &&

              deptgrp.arrowview === true) {




        @for (dept of deptgrp.deptdata; track dept; let z = $index) {


 

                                <ng-container

          * ngTemplateOutlet="listchildview; context:{$implicit:{crntdata:dept,vpuname:resData[childData.measureQuery['name']], subdata:childData, disable:resData.checked, step:3}}" > </ng-container>

        @if (dept.unitdata !== undefined && dept.unitdata.length > 0 && dept.arrowview === true) {




          @for (unit of dept.unitdata; track unit; let z = $index) {


 

                                <ng-container

            * ngTemplateOutlet="listchildview; context:{$implicit:{crntdata:unit,vpuname:resData[childData.measureQuery['name']], subdata:childData, disable:resData.checked, step:4}}" >

              </ng-container>




        }




      }




    }




  }





}


 

                                }



 

                                }



 

                                }

</li>

                                }


 

                                }

</ul>

                        }

@if ((childData.data | filter: childData.filterSearch).length > childData.showMoreLimit) {

  <div class="viewmore_option pb-2 pt-2" >

    @if (childData.showMoreLimit < childData.data.length) {
      <span

                                (click)="viewlist(i, j, childData.data.length)" > <a href="javascript:;" > Show

      more < /a></span >

                                }

  @if (childData.showMoreLimit === childData.data.length) {

    <span (click)="viewlist(i, j, 5)" > <a href="javascript:;" > Show less < /a></span >

                                }

  </div>

}

</div>


 

                    }

</ng-container>

  </lift-accordion>

  </lift-accordion>


 

        }


 

        }

</div>

  </div>

  < ng - template #listchildview let - data1 >

    <!--row ml - 0 p - 0 -- >

      <div class="row "[class.disableview] = "data1.disable === true" >

        <div class="col-md-10 form-group form-check mt-1 width-left formgcheckbox" >

          <!-- < ng - container * ngIf="data1.step === 1" > & nbsp;& nbsp;& nbsp; </ng-container>

            < ng - container * ngIf="data1.step === 2" > & nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp; </ng-container>

              < ng - container * ngIf="data1.step === 3" >

                & nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp; </ng-container> -->

  < div

  [ngClass]="data1.step === 1 ? 'pl-2' : data1.step === 2 ? 'pl-3' : data1.step === 3 ? 'pl-4': data1.step === 4 ? 'pl-5' : 'pl-6'" >

    <input type="checkbox" class="form-check-input"[id] = "data1.crntdata[data1.crntdata.childfacet]"

    [value] = "data1.crntdata[data1.crntdata.childfacet]"[attr.disabled] = "data1.crntdata.disable"

    [(ngModel)] = "data1.crntdata.checked"

      (change) = "onhandlesubChildclick(data1.crntdata, data1.subdata, data1.vpuname)" >




    <label class="form-check-label small-font"[for]="data1.crntdata[data1.crntdata.childfacet]" >

      {{ data1.crntdata[data1.crntdata.childfacet] }}

</label>

  </div>

  </div>

@if (data1.crntdata.subchildview === true) {

  <div class="col-md-2 float-right margChild"

    (click) = "onhandlesubChildload(data1.crntdata,data1.subdata, data1.crntdata[data1.crntdata.childfacet] ,data1.vpuname)" >

    <span class="txt-right-end" > @if (!data1.crntdata.arrowview) {

      <i class="fa fa-angle-down faicon" aria - hidden="true" > </i>

    }

  @if (data1.crntdata.arrowview) {

    <i class="fa fa-angle-up faicon" aria - hidden="true" > </i>

  } </span>

    </div>

}

</div>

  </ng-template>




  < !--@if (isPopupVisible) {

    <div class="popup-overlay" >

      <div class="popup-box" >

        <p class="mb-4" > {{ popupMessage }
  } </p>

    < lift - button[type]="buttonPrimary"(click) = "closePopup()" text = "OK" > </lift-button>

      </div>

      </div>

} -->