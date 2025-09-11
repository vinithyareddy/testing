.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: #f9f9f9;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ddd;
}

.country-list {
  flex: 1;
  overflow-y: auto;
}

.country-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.country-item:hover {
  background: #f0f0f0;
}

.flag {
  font-size: 22px;
  margin-right: 10px;
}

.info {
  font-size: 14px;
  color: #444;
}

.globe {
  flex: 1;
  background: radial-gradient(#1c1c2b, #000);
}


<div class="container">
  <!-- Sidebar -->
  <div class="sidebar">
    <input class="search" placeholder="Search by country" (input)="onSearch($event)" />
    <div class="country-list">
      <div *ngFor="let c of filteredData" class="country-item" (click)="focusCountry(c)">
        <span class="flag">{{c.flag}}</span>
        <div class="info">
          <div>{{c.country}}</div>
          <small>Unique Skills: {{c.uniqueSkills}}</small><br>
          <small>Skill Supply (FTE): {{c.skillSupply}}</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Globe -->
  <div #globeContainer class="globe"></div>
</div>


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Globe from 'globe.gl';
import worldData from '../../../assets/world-globe-data.json';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements OnInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  data: any[] = worldData;
  filteredData: any[] = [];

  globe: any;
  tooltip: any = null;

  ngOnInit() {
    this.filteredData = this.data;

    this.globe = Globe()(this.globeContainer.nativeElement)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundColor('#000')
      .pointsData(this.filteredData)
      .pointLat('lat')
      .pointLng('lng')
      .pointAltitude(0.05)
      .pointRadius(0.7)
      .pointColor(() => 'orange')
      .pointLabel((d: any) =>
        `<div style="padding:6px;font-size:13px;">
           <b>${d.flag} ${d.country}</b><br/>
           Unique Skills: ${d.uniqueSkills}<br/>
           Skill Supply (FTE): ${d.skillSupply}
         </div>`
      );

    // auto rotate
    this.globe.controls().autoRotate = true;
    this.globe.controls().autoRotateSpeed = 0.6;
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredData = this.data.filter(c =>
      c.country.toLowerCase().includes(query)
    );
    this.globe.pointsData(this.filteredData);
  }

  focusCountry(country: any) {
    this.globe.pointOfView({ lat: country.lat, lng: country.lng, altitude: 1.5 }, 2000);
  }
}
