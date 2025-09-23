<div class="budget-card-box-lg" #cartboxchartsection [ngClass]="{ 'fullscreen': isFullscreen }">
    <div class="budget-box-chart-lg">
        <div class="d-flex justify-content-between align-items-center flex-wrap">
            <!-- Left Section -->
            <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
                <span class="title-with-icon d-flex align-items-center gap-2">
                    {{ selectedView === 'By Region' ? 'Skill Supply by Location' : 'Skill Supply by Country' }}
                    <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
                </span>
            </div>

            <!-- Right Section -->
            <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">
                <!-- Search Box -->
                <div class="search-container">
                    <input type="text" 
                           placeholder="Search by country" 
                           [(ngModel)]="searchTerm"
                           (input)="onSearchChange()"
                           class="search-input">
                    <i class="fas fa-search search-icon"></i>
                </div>

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

                <!-- Toggle Buttons -->
                <div class="d-flex gap-3">
                    <span class="view" (click)="toggleFullscreen()">
                        <i [ngClass]="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'" title="Zoom"></i>
                    </span>
                    <div class="ellipsis ml-2">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="globe-wrapper">
            <!-- Left Panel - Country List -->
            <div class="country-panel">
                <div class="country-list-container" [ngClass]="{ 'scrollable': selectedView === 'By Country' }">
                    <!-- Search Results or Country List -->
                    <div class="country-item" 
                         *ngFor="let country of getFilteredCountries()" 
                         (click)="selectCountry(country)"
                         [ngClass]="{ 'selected': selectedCountry?.code === country.code }">
                        <div class="country-flag-container">
                            <img [src]="'assets/images/flags/' + country.code.toLowerCase() + '.svg'" 
                                 class="country-flag" 
                                 alt="{{ country.country }} flag">
                            <span class="country-name">{{ country.country }}</span>
                        </div>
                        <div class="country-stats">
                            <div class="stat-row">
                                <span class="stat-label">Unique Skills</span>
                                <span class="stat-value">{{ country.uniqueSkills || (country.cost * 2) }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Skill Supply (FTE)</span>
                                <span class="stat-value">{{ country.skillSupply || country.cost }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Globe Container -->
            <div #globeContainer class="globe-container-enhanced"></div>
            
            <!-- Zoom Controls -->
            <div class="zoom-container">
                <button (click)="zoomIn()" class="zoom-btn">+</button>
                <button (click)="zoomOut()" class="zoom-btn">−</button>
            </div>

            <!-- View More -->
            <div class="viewmore-container">
                <span class="viewmore-text">View More</span>
                <i class="fa fa-angle-right viewmore-icon"></i>
            </div>
        </div>
    </div>
</div>

<ng-template #infotemp>
    <lift-popover popoverTitle="" popoverText="">
        <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
</ng-template>


.globe-wrapper {
  display: flex;
  background: linear-gradient(135deg, #2c5aa0 0%, #1a4480 50%, #0d2a5c 100%);
  padding: 0;
  color: #fff;
  position: relative;
  min-height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

.country-panel {
  width: 320px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  
  .search-container {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
  }
}

.country-list-container {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  
  &.scrollable {
      max-height: 600px;
  }
}

.country-item {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
      background-color: #f0f8ff;
  }
  
  &.selected {
      background-color: #e3f2fd;
      border-left: 3px solid #2196f3;
  }
}

.country-flag-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  .country-flag {
      width: 24px;
      height: 16px;
      margin-right: 10px;
      border: 1px solid #ddd;
      border-radius: 2px;
  }
  
  .country-name {
      font-weight: 500;
      color: #333;
      font-size: 14px;
  }
}

.country-stats {
  margin-left: 34px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
  
  .stat-label {
      flex: 1;
  }
  
  .stat-value {
      font-weight: 500;
      color: #333;
  }
}

.search-container {
  position: relative;
  margin-right: 15px;
  
  .search-input {
      width: 200px;
      padding: 8px 35px 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      
      &:focus {
          outline: none;
          border-color: #2196f3;
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      }
  }
  
  .search-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 14px;
  }
}

.globe-container-enhanced {
  flex: 1;
  position: relative;
  min-height: 600px;
  background: radial-gradient(circle at 30% 30%, #4a90e2, #2c5aa0);
}

.zoom-container {
  position: absolute;
  bottom: 60px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .zoom-btn {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      color: #2c5aa0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      
      &:hover {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
  }
}

.viewmore-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  
  .viewmore-text {
      margin-right: 5px;
  }
  
  .viewmore-icon {
      font-size: 12px;
  }
  
  &:hover {
      color: #e3f2fd;
  }
}

// Globe-specific styles
:host ::ng-deep {
  .country-path {
      stroke-width: 0.5px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.highlighted {
          stroke: #fff;
          stroke-width: 2px;
          stroke-dasharray: 3,2;
          filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));
      }
      
      &:hover {
          stroke: rgba(255,255,255,0.6);
          stroke-width: 1px;
      }
  }
  
  .graticule {
      fill: none;
      stroke: rgba(255, 255, 255, 0.2);
      stroke-width: 0.5px;
  }
  
  .country-label {
      font-family: Arial, sans-serif;
      font-size: 10px;
      fill: #fff;
      text-anchor: middle;
      pointer-events: none;
      text-shadow: 0 0 3px rgba(0,0,0,0.8);
      
      &.major {
          font-size: 12px;
          font-weight: bold;
      }
      
      &.small {
          font-size: 8px;
          opacity: 0.8;
      }
  }
  
  .enhanced-tooltip {
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 13px;
      min-width: 180px;
      z-index: 1000;
      
      .tooltip-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid #eee;
          
          .tooltip-flag {
              width: 24px;
              height: 16px;
              margin-right: 8px;
              border: 1px solid #ddd;
              border-radius: 2px;
          }
          
          .tooltip-title {
              font-weight: 600;
              color: #333;
          }
      }
      
      .tooltip-stats {
          .stat-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              
              .stat-label {
                  color: #666;
                  font-size: 12px;
              }
              
              .stat-value {
                  font-weight: 500;
                  color: #333;
              }
          }
      }
  }
}