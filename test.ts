[
    { "proficiency": "Awareness", "fte": 33 },
    { "proficiency": "Skilled", "fte": 56 },
    { "proficiency": "Advanced", "fte": 30 },
    { "proficiency": "Expert", "fte": 6 }
  ]

  [
    { "name": "Male", "y": 210 },
    { "name": "Female", "y": 190 }
  ]

  
  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  constructor(private http: HttpClient) {}

  getSkillSupplyProficiency(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/skill-supply-proficiency.json');
  }

  getWorkforceByGender(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/workforce-gender.json');
  }
}
