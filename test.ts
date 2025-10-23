<app-trust-funds-top-header></app-trust-funds-top-header>
<div class="page-wrapper">
    <!--Centered Content Section -->
    <div class="content-section">
        <div class="content-inner">
            <p class="intro">
                Genie-AI gives you access to World Bank knowledge along with external Google search results,
                with safeguards that offer superior data protection compared to public AI chat options.
            </p>
  
            <p class="intro-text">
                Stay updated on the Bank's AI journey here. Create AI-powered collections from curated WB documents
                with Standard Reports Help.
            </p>
  
            <section class="section">
                <h3>Data and Analytics</h3>
                <ul>
                    <li><a (click)="navigateToSearch('Provide number of grants for my Program TF0505706')">Provide number of grants for my Program TF0505706</a></li>
                    <li><a (click)="navigateToSearch('Show top 10 IBRD/IDA TFs by Contributions')">Show top 10 IBRD/IDA TFs by Contributions</a></li>
                    <li><a (click)="navigateToSearch('Contributions received by all Trustees in my Climate GP')">Contributions received by all Trustees in my Climate GP</a></li>
                    <li><a (click)="navigateToSearch('Which Report should I use to get contributions by fiscal year')">Which Report should I use to get contributions by fiscal year</a></li>
                </ul>
            </section>
  
            <section class="section">
                <h3>Policies and Procedures</h3>
                <ul>
                    <li><a (click)="navigateToSearch('Explain what is Cost Recovery')">Explain what is Cost Recovery</a></li>
                    <li><a (click)="navigateToSearch('Umbrella Programs at the World Bank')">Umbrella Programs at the World Bank</a></li>
                </ul>
            </section>
        </div>
    </div>
</div>

<!-- Use the shared search component -->
<app-chat-search></app-chat-search>



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FrameworkService } from '@framework/core/services';
import { SrServicesService } from 'services/sr-services.service';
  
@Component({
  selector: 'app-prompt-library-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './prompt-library-page.component.html',
  styleUrls: ['./prompt-library-page.component.scss']
})
  
export class PromptLibraryPageComponent implements OnInit {
  
  constructor(
    public srservice: SrServicesService, 
    public fwService: FrameworkService,
    private router: Router
  ) {
    const combineParams = this.fwService.apiGetAppData('routeParams');
    combineParams.module = 'Trust Funds New';
    combineParams.section = 'prompt-library';
    combineParams.path = window.location.pathname;
    combineParams.Facets = '';
    this.fwService.apiSetAppData('routeParams', combineParams);
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.fwService
        .apiUpdateSiteTitle({ title: 'Standard Reports | Trust Funds', link: '/tf' })
        .apiToggleLeftNav(false)
        .apiToggleHeaderControls({ settings: false, actions: false, help: false, isBeta: false, search: false, notifications: false })
        .apiToggleSplashScreen(false)
        .apiActionMenuToggle(false);
      this.fwService.apiTrackMyPageWithAppInsights({ pageName: 'Standard Reports - Trust Funds - Prompt Library', subSections: [] });
    }, 100);
  }

  navigateToSearch(prompt: string): void {
    if (prompt && prompt.trim() !== '') {
      localStorage.setItem('tfSearchPrompt', prompt.trim());
      this.router.navigate(['/tf/ai-search-results']);
    }
  }
}

else if (paths.includes('prompt-library-page')) {
  this.pathname = '1';
  breadcrumbs.push(
    { label: 'Home', path: '/tf' }, 
    { label: 'AI Search Results', path: '/tf/ai-search-results' },
    { label: 'Prompt Library', path: '' }
  );
  this.pageTitle = 'Prompt Library';
}.section {
  ul {
    li {
      a {
        cursor: pointer;
        text-decoration: underline;
        color: #0071bc; // or your preferred link color
        
        &:hover {
          color: #005a9c; // darker shade on hover
        }
      }
    }
  }
}