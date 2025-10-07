.togglebtn {
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 4px;
    cursor: pointer;

    &.lft-toggle-active,
    &.rgt-toggle-active {
      background-color: #0071bc;
      i {
        color: #fff;
      }
    }

    i {
      font-size: 16px;
      color: #0071bc;
      line-height: 1; // ensures proper vertical centering
    }
  }
}
