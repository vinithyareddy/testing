// Force remove all margins from parent elements using ::ng-deep
::ng-deep {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden;
  }

  app-root {
    margin: 0 !important;
    padding: 0 !important;
    display: block;
  }
}

// Remove all default margins from the host component
:host {
  display: block;
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw !important;
  margin-right: -50vw !important;
}

.page-wrapper {
  background-color: #e4eae6;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
  color: #1d1d1d;
  padding: 0;
  margin: 0;
  width: 100%;
}

/* 1️⃣ Header Section */
.header-box {
  background: #ebebeb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  padding: 1.5rem 2rem;
  height: 55px;
  margin: 0;
  width: 100%;

  .breadcrumb {
    font-size: 14px;
    color: #666;
    margin: 0;

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
    margin: 0.5rem 0 0 0;
  }
}

/* 2️⃣ Content Section - centered, clean */
.content-section {
  display: flex;
  justify-content: center;
  text-align: left;
  padding: 2rem 1rem;
}

.content-inner {
  max-width: 800px;
  color: #333;

  .intro {
    margin-bottom: 1rem;
    margin-top: 0;
    line-height: 1.6;
    font-size: 22px;
    color: #181818;
    font-weight: 500;
  }

  .intro-text {
    margin-bottom: 1rem;
    margin-top: 0;
    line-height: 1.6;
    font-size: 16px;
    color: #444;
  }

  .section {
    margin-bottom: 1.5rem;

    h3 {
      font-size: 16px;
      color: #302f2f;
      font-weight: 570;
      margin-bottom: 0.8rem;
      margin-top: 0;
    }

    ul {
      list-style-type: disc;
      margin-left: 1.8rem;
      margin-top: 0;
      margin-bottom: 0;
      padding-left: 0.5rem;

      li {
        margin-bottom: 0.6rem;
        line-height: 1.5;

        &::marker {
          color: #0078d4;
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
  margin-top: 3rem;
  margin-bottom: 2rem;
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
