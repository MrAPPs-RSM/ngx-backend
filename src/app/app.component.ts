import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private _router: Router) {
    }

    ngOnInit() {
    }
}
