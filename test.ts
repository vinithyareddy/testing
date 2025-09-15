.toggle-btn {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #ddd;
  border-left: none;   // blends into legend box
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  width: 28px;
  height: 60px;        // taller, more rectangular
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;

  i {
    font-size: 14px;
    color: #374151;
  }
}
