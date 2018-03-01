import { Component, OnInit } from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent extends BaseInputComponent implements OnInit {

  ngOnInit() {
  }

}
