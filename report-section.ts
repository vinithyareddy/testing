import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss']
})
export class RoleSelectionComponent {

  @Input() groupedSegments: any;
  @Input() SEGMENT_ICONS: any;

  @Output() back = new EventEmitter();
  @Output() continue = new EventEmitter<any>();

  name = '';
  selectedSegment: any;
  selectedPersona: any;

  handleSegmentSelect(segment: any) {
    this.selectedSegment = segment;
    this.selectedPersona = null;
  }

  handlePersonaSelect(persona: any) {
    this.selectedPersona = persona;
  }

  handleContinue() {
    this.continue.emit({
      segment: this.selectedSegment,
      persona: this.selectedPersona,
      name: this.name
    });
  }

  getPersonaNames(personas: any[]) {
    return personas.map(p => p.name).join(', ');
  }

  getSegmentDescription(segment: any) {
    return segment.description || '';
  }
}
