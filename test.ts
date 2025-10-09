import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
import { SwfpFilterService } from 'app/modules/shared/swfp-shared/services/swfp-filter.service';
import { SwfpModuleEnum } from 'app/enums/swfp-module.enum';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DestroyRef, inject } from '@angular/core';



widgetId: string = 'SSSI_2'; // unique ID for Skill Supply by Location
module: string = SwfpModuleEnum.HC_WF;
public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
private destroyRef = inject(DestroyRef);





constructor(
    public store: Store<SwfpFilterState>,
    public queryBuilder: SwfpQueryBuilderService,
    public filterService: SwfpFilterService,
    public apiService: SwfpApiService
  ) { }
  