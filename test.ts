<!-- Right Section -->
<div class="col-md-4 d-flex justify-content-end align-items-center header-icons">

  <!-- Full Screen -->
  <div class="d-flex gap-3 align-items-center">

    <span class="view">
      <i class="fas fa-expand" title="Full Screen"></i>
    </span>

    <!-- Custom Dropdown -->
    <div class="dropdown custom-dropdown">
      <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton"
              data-bs-toggle="dropdown" aria-expanded="false">
        {{ selectedView }}
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li (click)="setView('By Country')">
          <a class="dropdown-item">
            By Country <i *ngIf="selectedView === 'By Country'" class="fas fa-check ms-2"></i>
          </a>
        </li>
        <li (click)="setView('By Region')">
          <a class="dropdown-item">
            By Region <i *ngIf="selectedView === 'By Region'" class="fas fa-check ms-2"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- Ellipsis Menu -->
    <i class="fas fa-ellipsis-v ml-2"></i>
  </div>
</div>


.custom-dropdown {
  .btn {
    padding: 2px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
  }

  .dropdown-menu {
    font-size: 14px;
    min-width: 140px;
  }

  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    i {
      color: #007bff; // blue checkmark
    }
  }
}
