.togglebtn {
    display: flex;
    border: 1px solid #ccd5df;
    border-radius: 4px;
    overflow: hidden;
  
    .lft-toggle,
    .rgt-toggle {
      padding: 6px 10px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-right: 1px solid #ccd5df;
  
      i {
        font-size: 14px;
        color: #0071bc;
        font-weight: 400; // lighter by default
      }
  
      &:hover {
        background: #f0f4f8;
      }
  
      &.active {
        background: #0071bc;   // blue highlight
        i {
          color: #fff;
          font-weight: 600;    // bolder when active
        }
      }
    }
  
    .rgt-toggle {
      border-right: none;
    }
  }
  




  .header-icons {
    display: flex;
    align-items: center;
    gap: 8px;
  
    .view, .ellipsis {
      border: 1px solid #ccd5df;
      border-radius: 4px;
      padding: 6px 8px;
      background: #fff;
      cursor: pointer;
  
      i {
        font-size: 14px;
        color: #0071bc;
        font-weight: 400; // lighter by default
      }
  
      &:hover {
        background: #f0f4f8;
      }
  
      &.active {
        background: #0071bc;
        i {
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }
  