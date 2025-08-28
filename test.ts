.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  .togglebtn {
    display: flex;
    align-items: flex-end;     // pushes icons to bottom
    justify-content: flex-end; // pushes icons to right
    gap: 8px;                  // spacing between icons
    height: 100%;              // take full header height

    .lft-toggle,
    .rgt-toggle,
    .ellipsis {
      width: 28px;
      height: 28px;
      border: 1px solid #d6d6d6;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      color: #0071bc;
    }
  }

  .widget-heading {
    display: flex;
    align-items: flex-start; // title stays up
  }
}
