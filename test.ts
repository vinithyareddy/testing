<div class="legend-toggle" [class.collapsed]="legendCollapsed">
  <div class="legend-wrapper">
    <!-- existing search + country list -->
    <div class="search-box">
      <input type="text" placeholder="Search by country" [(ngModel)]="searchTerm" (input)="filterList()" />
      <i class="fas fa-search"></i>
    </div>
    <div class="country-list">
      <div *ngFor="let c of filteredList" class="country-card">
        <img [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
        <div class="country-details">
          <div class="country-name">{{ c.country }}</div>
          <div class="metrics">
            <span>Unique Skills: <b>{{ c.uniqueSkills }}</b></span>
            <span>Skill Supply (FTE): <b>{{ c.skillSupply }}</b></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- toggle button -->
  <button class="toggle-btn" (click)="legendCollapsed = !legendCollapsed">
    <i class="fas" [ngClass]="legendCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
  </button>
</div>


.legend-toggle {
  position: relative;
  display: flex;
  transition: width 0.3s ease;

  .legend-wrapper {
    width: 260px;  // expanded width
    transition: width 0.3s ease, opacity 0.3s ease;
  }

  &.collapsed .legend-wrapper {
    width: 0;
    opacity: 0;
    overflow: hidden;
  }

  .toggle-btn {
    position: absolute;
    top: 50%;
    right: -12px;
    transform: translateY(-50%);
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
    z-index: 10;
  }
}
