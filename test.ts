import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-swfp-by-country-job',
  templateUrl: './swfp-by-country-job.component.html',
  styleUrls: ['./swfp-by-country-job.component.scss']
})
export class SwfpByCountryJobComponent {
  ResponseFlag = true;   // simulate data load complete
  collapsed = false;
  fullview = false;

  // Demo data (replace with API/service later)
  groupdata = [
    { country: 'United States', flag: 'us', fte: 96, expanded: false },
    { country: 'India', flag: 'in', fte: 10, expanded: false },
    { country: 'Nigeria', flag: 'ng', fte: 6, expanded: false },
    { country: 'Bangladesh', flag: 'bd', fte: 5, expanded: false },
    { country: 'Ethiopia', flag: 'et', fte: 5, expanded: false },
    { country: 'Kenya', flag: 'ke', fte: 5, expanded: false },
    { country: 'Pakistan', flag: 'pk', fte: 5, expanded: false },
    { country: 'Senegal', flag: 'sn', fte: 4, expanded: false }
  ];

  total = [{ label: 'Total', fte: 239 }];

  constructor(private render: Renderer2) {}

  expandRow(row: any) {
    row.expanded = !row.expanded;
  }

  expand() { this.collapsed = false; }
  collapse() { this.collapsed = true; }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }

  getDetailPage() {
    console.log('Navigate → detail page');
  }
}
