// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-quick-access-widget',
//   templateUrl: './quick-access-widget.component.html',
//   styleUrls: ['./quick-access-widget.component.scss']
// })
// export class QuickAccessWidgetComponent {
//   sections = [
//     {
//       title: 'Other Dashboards',
//       expanded: false,
//       showToggle: false,
//       showingMore: false,
//       items: [
//         { label: 'Travel Dashboard', icon: 'fas fa-globe' },
//         { label: 'QA Dashboard', icon: 'fas fa-tasks' },
//         { label: 'RM Portal', icon: 'fas fa-clipboard-list' },
//         { label: 'Procurement Dashboard', icon: 'fas fa-box' },
//         { label: 'Manager’s Learning Dashboard', icon: 'fas fa-graduation-cap' },
//       ]
//     },
//     {
//       title: 'Key/Exception Reports',
//       expanded: false,
//       showToggle: false,
//       showingMore: false,
//       items: [
//         { label: 'ICBS (Telephone) Charges Report', icon: 'fas fa-file-alt' }
//       ]
//     },
//     {
//       title: 'Related Policy, Directives or Procedures',
//       expanded: false,
//       showToggle: false,
//       showingMore: false,
//       items: [
//         { label: 'World Bank Policy & Procedure Framework (PPF)', icon: 'fas fa-file-pdf' },
//         { label: '(PPF) World Bank Staff Manual', icon: 'fas fa-book' }
//       ]
//     },
//     {
//       title: 'P-Card Quick Reference Guides and PCard Reports',
//       expanded: false,
//       showToggle: true,
//       showingMore: false,
//       items: [
//         { label: 'Cardholder Manual', icon: 'fas fa-file-pdf' },
//         { label: 'Quick Reference Guide: Unit PCard Audit Report', icon: 'fas fa-globe' },
//         { label: 'Quick Reference Guide: Unit Reconciliation to Procurement Card Transactions', icon: 'fas fa-file-alt' },
//         { label: 'Quick Reference Guide: PCard Cardholder Report by Unit', icon: 'fas fa-file-alt' },
//         { label: 'Quick Reference Guide: PCard Charges for Fund Center Report', icon: 'fas fa-file-alt' },
//         { label: 'Quick Reference Guide: P-Card vs. MyCard', icon: 'fas fa-globe' }
//       ]
//     },
//     {
//       title: 'WBG Glossary and HQ/CO Salary Sales',
//       expanded: false,
//       showToggle: false,
//       showingMore: false,
//       items: [
//         { label: 'World Bank Business Glossary', icon: 'fas fa-globe' },
//         { label: 'HQ and CO Salary Scales', icon: 'fas fa-globe' }
//       ]
//     }
//   ];

//   toggleSection(section: any) {
//     section.expanded = !section.expanded;
//   }

//   toggleShowMore(section: any) {
//     section.showingMore = !section.showingMore;
//   }

//   getVisibleItems(section: any) {
//     if (!section.showToggle) return section.items;
//     return section.showingMore ? section.items : section.items.slice(0, 2);
//   }
// }


import { Component } from '@angular/core';

@Component({
  selector: 'app-quick-access-widget',
  templateUrl: './quick-access-widget.component.html',
  styleUrls: ['./quick-access-widget.component.scss']
})
export class QuickAccessWidgetComponent {
  mainCollapsed = false;

  toggleMainCollapse() {
    this.mainCollapsed = !this.mainCollapsed;
  }
  quickAccessCollapsed = false;
  sections = [
    {
      title: 'Other Dashboards',
      expanded: false,
      items: [
        { label: 'Travel Dashboard', icon: 'fas fa-globe' },
        { label: 'QA Dashboard', icon: 'fas fa-tasks' },
        { label: 'RM Portal', icon: 'fas fa-clipboard-list' },
        { label: 'Procurement Dashboard', icon: 'fas fa-box' },
        { label: 'Manager’s Learning Dashboard', icon: 'fas fa-graduation-cap' }
      ]
    },
    {
      title: 'Key/Exception Reports',
      expanded: false,
      items: [
        { label: 'ICBS (Telephone) Charges Report', icon: 'fas fa-file-alt' }
      ]
    },
    {
      title: 'Related Policy, Directives or Procedures',
      expanded: false,
      items: [
        { label: 'World Bank Policy & Procedure Framework (PPF)', icon: 'fas fa-file-pdf' },
        { label: '(PPF) World Bank Staff Manual', icon: 'fas fa-book' }
      ]
    },
    {
      title: 'P-Card Quick Reference Guides and PCard Reports',
      expanded: false,
      showToggle: true,
      showingMore: false,
      items: [
        { label: 'Cardholder Manual', icon: 'fas fa-file-pdf' },
        { label: 'Quick Reference Guide: Unit PCard Audit Report', icon: 'fas fa-globe' },
        { label: 'Quick Reference Guide: Unit Reconciliation...', icon: 'fas fa-file-alt' },
        { label: 'Quick Reference Guide: PCard Cardholder Report by Unit', icon: 'fas fa-file-alt' },
        { label: 'Quick Reference Guide: PCard Charges for Fund Center Report', icon: 'fas fa-file-alt' },
        { label: 'Quick Reference Guide: P-Card vs. MyCard', icon: 'fas fa-globe' }
      ]
    },
    {
      title: 'WBG Glossary and HQ/CO Salary Sales',
      expanded: false,
      items: [
        { label: 'World Bank Business Glossary', icon: 'fas fa-globe' },
        { label: 'HQ and CO Salary Scales', icon: 'fas fa-globe' }
      ]
    }
  ];
  toggleQuickAccess() {
    this.quickAccessCollapsed = !this.quickAccessCollapsed;
  }
  

  toggleSection(section: any) {
    section.expanded = !section.expanded;
  }

  toggleShowMore(section: any) {
    section.showingMore = !section.showingMore;
  }

  getVisibleItems(section: any) {
    if (!section.showToggle) return section.items;
    return section.showingMore ? section.items : section.items.slice(0, 2);
  }
}
