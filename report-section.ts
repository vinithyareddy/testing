import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-corporate-badge',
  templateUrl: './corporate-badge.component.html',
  styleUrls: ['./corporate-badge.component.scss']
})
export class CorporateBadgeComponent {

  searchText = '';

  dropdownOptions = ['A', 'B', 'C', 'D'];

  selectedFilter1 = 'Filter 1';
  selectedFilter2 = 'Filter 2';

  isDropdown1Open = false;
  isDropdown2Open = false;

  dummyCards = [
    { domain: 'CORPORATE', title: 'Financial Summary Dashboard', category: 'Analytics', views: 56, downloads: 12 },
    { domain: 'CORPORATE', title: 'HR Workforce Insights', category: 'Analytics', views: 72, downloads: 20 },
    { domain: 'CORPORATE', title: 'Governance Compliance Report', category: 'Power BI', views: 44, downloads: 10 },
    { domain: 'CORPORATE', title: 'Operational Risk Overview', category: 'Analytics', views: 68, downloads: 15 },
  ];

  toggleDropdown1(event: Event) {
    event.stopPropagation();
    this.isDropdown1Open = !this.isDropdown1Open;
    this.isDropdown2Open = false;
  }

  toggleDropdown2(event: Event) {
    event.stopPropagation();
    this.isDropdown2Open = !this.isDropdown2Open;
    this.isDropdown1Open = false;
  }

  selectFilter1(val: string, event: Event) {
    event.stopPropagation();
    this.selectedFilter1 = val;
    this.isDropdown1Open = false;
  }

  selectFilter2(val: string, event: Event) {
    event.stopPropagation();
    this.selectedFilter2 = val;
    this.isDropdown2Open = false;
  }

  clearFilters() {
    this.searchText = '';
    this.selectedFilter1 = 'Filter 1';
    this.selectedFilter2 = 'Filter 2';
  }

  @HostListener('document:click')
  closeAll() {
    this.isDropdown1Open = false;
    this.isDropdown2Open = false;
  }
}
