<div class="searchBox">
  <i class="fa fa-search search-icon"></i>
  <lift-search [data]="data" [config]="config"></lift-search>
</div>

import { Component, OnInit } from '@angular/core';
import { LiftSearchComponent, SearchSelectData, SearchConfig } from '@lift/search';

@Component({
  standalone: true,
  imports: [LiftSearchComponent],
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  data: SearchSelectData = {
    items: [],
    optionField: 'name'
  };

  config: SearchConfig = {
    placeholder: 'Search',
    styleClass: 'custom-lift-search'  // 👈 add this class hook
  };
}


/* --- Container --- */
.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
    border-radius: 8px;
  
    .search-icon {
      position: absolute;
      top: 50%;
      left: 12px;
      transform: translateY(-50%);
      color: #8c8c8c;         // subtle gray
      font-size: 14px;
      pointer-events: none;   // lets clicks go through
      z-index: 2;
    }
  
    lift-search {
      display: block;
      width: 100%;
    }
  }
  
  /* --- Apply only to this lift-search instance --- */
  .custom-lift-search input.form-control.shadow-none.border-0 {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    padding-left: 35px !important; // space for the search icon
    font-size: 14px;
    box-sizing: border-box;
  }
  
  /* --- Hover and focus effects for polish --- */
  .custom-lift-search input.form-control.shadow-none.border-0:focus {
    outline: none;
    border-color: #0078d4;      // blue focus border (same as Figma)
    box-shadow: 0 0 3px rgba(0, 120, 212, 0.3);
  }
  