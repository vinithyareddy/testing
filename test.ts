<div class="page-wrapper">
  <!-- 1️⃣ Header Section -->
  <div class="header-box">
    <nav class="breadcrumb">
      <a href="#">Home</a>
      <span class="divider">/</span>
      <a href="#">AI Search Results</a>
      <span class="divider">/</span>
      <span class="current">Prompt Library</span>
    </nav>

    <h2 class="page-title">Prompt Library</h2>
  </div>

  <!-- 2️⃣ Centered Content Section (No Box Border) -->
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
          <li><a href="#">Provide number of grants for my Program TF0505706</a></li>
          <li><a href="#">Show top 10 IBRD/IDA TFs by Contributions</a></li>
          <li><a href="#">Contributions received by all Trustees in my Climate GP</a></li>
          <li><a href="#">Which Report should I use to get contributions by fiscal year</a></li>
        </ul>
      </section>

      <section class="section">
        <h3>Policies and Procedures</h3>
        <ul>
          <li><a href="#">Explain what is Cost Recovery</a></li>
          <li><a href="#">Umbrella Programs at the World Bank</a></li>
        </ul>
      </section>
    </div>
  </div>

  <!-- 3️⃣ Search Bar -->
  <div class="search-bar">
    <input
      type="text"
      [(ngModel)]="searchQuery"
      placeholder="Start Typing..."
    />
  </div>
</div>


.page-wrapper {
  background-color: #e4eae6; // ✅ soft page bg
  min-height: 100vh;
  padding: 2rem 3rem;
  font-family: "Segoe UI", sans-serif;
  color: #1d1d1d;
  padding: 0;
}

/* 1️⃣ Header Section */
.header-box {
  background: #ebebeb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  padding: 1.5rem 2rem;
height: 55px;

  .breadcrumb {
    font-size: 14px;
    color: #666;

    a {
      text-decoration: none;
      color: #0078d4;
      &:hover {
        text-decoration: underline;
      }
    }

    .divider {
      margin: 0 0.4rem;
      color: #999;
    }

    .current {
      color: #333;
      font-weight: 500;
    }
  }

  .page-title {
    font-size: 22px;
    font-weight: 500;
    color: #111;
  }
}

/* 2️⃣ Content Section - centered, clean */
.content-section {
  display: flex;
  justify-content: center;
  text-align: left;
}

.content-inner {
  max-width: 800px; /* keeps content nicely centered */
  color: #333;

  .intro {
    margin-bottom: 1rem;
    line-height: 1.6;
    font-size: 22px;
    color: #181818;
    font-weight: 500;
  }

  .intro-text {
    margin-bottom: 1rem;
    line-height: 1.6;
    font-size: 16px;
    color: #444;
  }

  .section {

    h3 {
      font-size: 16px;
      color: #302f2f;
      font-weight: 570;
      margin-bottom: 0.8rem;
    }

    ul {
      list-style-type: disc; /* ✅ adds bullet points */
      margin-left: 1.8rem; /* ✅ pushes list slightly to the right */
      padding-left: 0.5rem;

      li {
        margin-bottom: 0.6rem;
        line-height: 1.5;
   /* ✅ bullet color */
   &::marker {
    color: #0078d4; /* theme blue */
    font-size: 1rem;
  }

        a {
          color: #0078d4;
          text-decoration: none;
          font-size: 15px;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

/* 3️⃣ Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  background: #ebebeb;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  margin-top: 5rem;
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 85px;

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    color: #333;
    background: transparent;
    margin-bottom: 50px;
  }
}
:host {
  display: block;
  margin: 0 !important;
  padding: 0 !important;
}

:host ::ng-deep html,
:host ::ng-deep body {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}


import { Component } from '@angular/core';

@Component({
  selector: 'app-gene-ai',
  templateUrl: './gene-ai.component.html',
  styleUrls: ['./gene-ai.component.scss']
})
export class GeneAiComponent {
  searchQuery: string = '';
}

