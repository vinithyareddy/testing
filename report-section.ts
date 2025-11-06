import { Component } from '@angular/core';

@Component({
  selector: 'app-accounting-bottom-section',
  templateUrl: './accounting-bottom-section.component.html',
  styleUrls: ['./accounting-bottom-section.component.scss']
})
export class AccountingBottomSectionComponent {
  faqData = [
    {
      question: 'How do I install the Power BI Desktop Application?',
      answer:
        'To download the Power BI Desktop App, go to the Software Center on your PC and search for Power BI to install it.'
    },
    {
      question: 'How do I download a report in Excel format?',
      answer:
        'Tag observations with AI and make sense of collected data using analytics and visualization.'
    },
    {
      question: 'What’s the difference between Favorites and Bookmarks?',
      answer:
        'Favorites save reports for quick access, while Bookmarks capture specific filter views for reuse.'
    },
    {
      question: 'How can I browse reports?',
      answer:
        'Use the Reports Explorer or search bar to find Power BI dashboards organized by category.'
    }
  ];
}
