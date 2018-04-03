import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-timetable-picker',
    templateUrl: './timetable-picker.component.html',
    styleUrls: ['./timetable-picker.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimetablePickerComponent extends BaseInputComponent implements OnInit {

    timeMask = [/[1-9]/, /\d/, ':', /\d/, /\d/];

    subForm: FormGroup;
    mS: FormControl = new FormControl(); // morning start
    mE: FormControl = new FormControl(); // morning end
    aS: FormControl = new FormControl(); // afternoon start
    aE: FormControl = new FormControl(); // afternoon end

    ngOnInit() {
        this.subForm = new FormGroup({
            'mS': this.mS,
            'mE': this.mE,
            'aS': this.aS,
            'aE': this.aE
        });
    }

    onChange($event: any, model: string) {
        console.log($event, model);
    }
}
