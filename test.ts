.country-card {
  display: flex;
  flex-direction: column;   // stack vertically
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: default;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
}

.country-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  .flag-icon {
    width: 22px;
    height: auto;
    margin-right: 8px;
    border-radius: 3px;
  }

  .country-name {
    font-weight: 600;
    font-size: 14px;
    color: #111827;
  }
}

.metrics {
  font-size: 13px;
  color: #374151;
  display: flex;
  flex-direction: column;   // stack labels vertically
  gap: 2px;

  span {
    display: block;
  }
}


.legend-wrapper {
  width: 350px;
  padding: 15px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}


.search-box {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 8px;
  margin-bottom: 12px;

  input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-size: 14px;
    color: #111827;
  }

  i {
    color: #6b7280;
  }
}
<div *ngFor="let c of filteredList" class="country-card">
  <div class="country-header">
    <img [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
    <div class="country-name">{{ c.country }}</div>
  </div>
  <div class="metrics">
    <span>Unique Skills: <b>{{ c.uniqueSkills }}</b></span>
    <span>Skill Supply (FTE): <b>{{ c.skillSupply }}</b></span>
  </div>
</div>
