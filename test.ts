<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend-wrapper">
    <h3 class="legend-title">Average Labor cost by Region</h3>
    <div class="legend">
      <ul>
        <li *ngFor="let region of regionGroups">
          <details>
            <summary>
              {{ region.region }} — ${{ region.total }}
            </summary>
            <ul>
              <li *ngFor="let c of region.countries" class="country-row">
                <span class="country-info">
                  <span class="flag">{{ getFlagEmoji(c.code) }}</span>
                  <span class="name">{{ c.country }}</span>
                </span>
                <span class="cost">\${{ c.cost }}</span>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</div>


.legend-wrapper {
  width: 28%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.legend-title {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  color: #fff;
}

.legend {
  background: #0b3d91;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  font-size: 0.9rem;
}
