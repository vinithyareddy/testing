.header-icons {
    display: flex;
    align-items: center;
    gap: 8px; // equal spacing between groups
    margin-bottom: 10px;
  
    .togglebtn {
      display: flex;
      border: 1px solid #ccd5df;
      border-radius: 4px;
      overflow: hidden;
  
      .lft-toggle,
      .rgt-toggle {
        width: 36px;   // fixed size for consistency
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-right: 1px solid #ccd5df;
        cursor: pointer;
  
        i {
          font-size: 16px;
          color: #0071bc;
        }
      }
  
      .rgt-toggle {
        border-right: none;
      }
    }
  
    .view,
    .ellipsis {
      width: 36px;
      height: 36px;
      border: 1px solid #ccd5df;
      border-radius: 4px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
  
      i {
        font-size: 16px;
        color: #0071bc;
      }
    }
  }
  