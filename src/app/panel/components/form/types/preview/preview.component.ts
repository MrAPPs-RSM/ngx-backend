import { Component, OnInit } from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent extends BaseInputComponent implements OnInit {

  ngOnInit() {
  }

}
