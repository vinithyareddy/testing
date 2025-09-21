.chart-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 50%;
  padding: 6px 10px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

  i {
    font-size: 14px;
    color: #444;
  }

  &.left-arrow {
    left: 5px;   // keeps it inside container, not outside
  }

  &.right-arrow {
    right: 5px;
  }

  &:hover {
    background: #f0f0f0;
  }
}
