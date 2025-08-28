.togglebtn {
  display: flex;
  align-items: center;     // 🔑 aligns icons with title text vertically
  justify-content: flex-end; // push icons to the right
  gap: 8px;                // space between icons
  height: 100%;
}

.lft-toggle, .rgt-toggle, .ellipsis {
  width: 28px;
  height: 28px;
  border: 1px solid #d6d6d6;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
  color: #0071bc;
  font-size: 14px;
}
