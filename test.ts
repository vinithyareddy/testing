.polygonLabel((d: any) => {
  const entry = this.laborData.find(c => c.country === d.properties.name);
  if (!entry) return "";
  return `
    <div class="globe-tooltip">
      <img src="https://flagcdn.com/16x12/${entry.code.toLowerCase()}.png" />
      <span class="name">${entry.country}</span><br/>
      <span class="label">Average Cost:</span>
      <span class="value">$${entry.cost}</span>
    </div>
  `;
});


.globe-tooltip {
  padding: 6px;
  font-size: 13px;
  background: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;

  img {
    margin-right: 6px;
    vertical-align: middle;
  }

  .label {
    margin-right: 4px;
  }

  .value {
    font-weight: bold;
  }
}
