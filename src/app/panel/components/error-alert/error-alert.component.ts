import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import ErrorBag from '../../../strategies/form/ErrorBag';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css']
})
export class ErrorAlertComponent implements OnInit {
  @Input() errorBag: ErrorBag;
  @Input() errorMessages: string[]|undefined;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

  hasErrors() {
    return this.errorBag.hasErrors() || (this.errorMessages && this.errorMessages.length > 0);
  }

  closeErrors() {
    this.close.emit();
  }
}
