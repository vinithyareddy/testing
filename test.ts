<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>
    <ul>
      <li *ngFor="let region of regionGroups" class="region">
        <details>
          <summary>
            <span class="region-name">{{ region.region }}</span>
            <span class="region-cost">\${{ region.total }}</span>
          </summary>
          <ul class="country-list">
            <li *ngFor="let c of region.countries" class="country">
              <img 
                class="flag"
                [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'"
                alt="{{ c.country }} flag"
              />
              <span class="country-name">{{ c.country }}</span>
              <span class="country-cost">\${{ c.cost }}</span>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>


.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
  padding: 15px;
  border-radius: 10px;
  color: #fff;
}

.globe-container {
  width: 70%;
  height: 600px;
}

.legend {
  width: 28%;
  background: #0b3d91;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  font-size: 0.9rem;
}

.legend h3 {
  margin-top: 0;
  text-align: center;
}

.region {
  margin-bottom: 10px;
}

details summary {
  cursor: pointer;
  font-weight: bold;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: #154361;
  border-radius: 5px;
}

.country-list {
  list-style: none;
  margin: 5px 0 0 0;
  padding-left: 15px;
}

.country {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  background: #174a8b;
  margin: 3px 0;
  border-radius: 4px;
}

.country:hover {
  background: #1f5aa5;
}

.flag {
  width: 16px;
  height: 12px;
  margin-right: 8px;
}

.country-name {
  flex: 1;
}


// Add country ISO2 codes (needed for flag icons)
laborData: CountryCost[] = [
  { country: 'United States of America', region: 'North America', cost: 57, code: 'US' },
  { country: 'Canada', region: 'North America', cost: 7, code: 'CA' },
  { country: 'Mexico', region: 'North America', cost: 3, code: 'MX' },
  { country: 'Brazil', region: 'South America', cost: 12, code: 'BR' },
  { country: 'Argentina', region: 'South America', cost: 9, code: 'AR' },
  { country: 'Colombia', region: 'South America', cost: 5, code: 'CO' }
];
