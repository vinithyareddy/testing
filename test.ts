getSkillSupplyProficiency(): Observable<any[]> {
    return this.http.get<any[]>('/assets/json/skill-supply-proficiency.json');
  }
  
  getWorkforceByGender(): Observable<any[]> {
    return this.http.get<any[]>('/assets/json/workforce-gender.json');
  }
  