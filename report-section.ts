import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-promptathon-popup',
  templateUrl: './promptathon-popup.component.html',
  styleUrls: ['./promptathon-popup.component.scss']
})
export class PromptathonPopupComponent {

  @Output() next = new EventEmitter<void>();

  handleNext() {
    this.next.emit();
  }

}
