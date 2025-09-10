<!-- Custom Dropdown -->
<div class="dropdown custom-dropdown">
  <button class="btn btn-light dropdown-toggle" type="button" (click)="showMenu = !showMenu">
    {{ selectedView }}
  </button>
  <ul class="dropdown-menu" *ngIf="showMenu">
    <li (click)="setView('By Country'); showMenu=false">
      <a class="dropdown-item">
        By Country
        <i *ngIf="selectedView === 'By Country'" class="fas fa-check ms-2"></i>
      </a>
    </li>
    <li (click)="setView('By Region'); showMenu=false">
      <a class="dropdown-item">
        By Region
        <i *ngIf="selectedView === 'By Region'" class="fas fa-check ms-2"></i>
      </a>
    </li>
  </ul>
</div>


showMenu: boolean = false;


.dropdown-menu {
  z-index: 2000 !important;
}
