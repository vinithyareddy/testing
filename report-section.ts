import { Component } from '@angular/core';

type ReportCard = {
  category: string;
  title: string;
  views: number;
  downloads: number;
};

@Component({
  selector: 'app-reports-section',
  templateUrl: './reports-section.component.html',
  styleUrls: ['./reports-section.component.scss']
})
export class ReportsSectionComponent {
  view: 'grid' | 'list' = 'grid';
  searchText = '';

  reports: ReportCard[] = [
    { category: 'ACCOUNTS PAYABLE', title: 'Budget vs Actuals By Fund GroupFormatted', views: 58, downloads: 21 },
    { category: 'ACCOUNTS PAYABLE', title: 'Sources & Uses By Department', views: 19, downloads: 87 },
    { category: 'ACCOUNTS PAYABLE', title: 'Sources & Uses By Department', views: 24, downloads: 49 },
    { category: 'ACCOUNTS PAYABLE', title: 'Sources & Uses By Department', views: 18, downloads: 19 },
    { category: 'ASSURANCE & QUALITY CONTROL', title: 'Sources & Uses By Department', views: 10, downloads: 19 },
    { category: 'COUNTRY OFFICE ACCOUNTING', title: 'Sources & Uses By Department', views: 72, downloads: 41 },
    { category: 'ASSURANCE & QUALITY CONTROL', title: 'Sources & Uses By Department', views: 64, downloads: 15 },
    { category: 'COUNTRY OFFICE ACCOUNTING', title: 'Sources & Uses By Department', views: 98, downloads: 82 },
    { category: 'ASSURANCE & QUALITY CONTROL', title: 'Sources & Uses By Department', views: 10, downloads: 19 },
    { category: 'COUNTRY OFFICE ACCOUNTING', title: 'Sources & Uses By Department', views: 72, downloads: 41 }
  ];

  filtered: ReportCard[] = [...this.reports];

  onSearch() {
    const q = this.searchText.trim().toLowerCase();
    this.filtered = !q
      ? [...this.reports]
      : this.reports.filter(r =>
          (r.title + ' ' + r.category).toLowerCase().includes(q)
        );
  }
}
