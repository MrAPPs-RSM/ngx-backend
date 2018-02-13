import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['../assets/sass/ngx-backend.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private _router: Router) {
    }

    ngOnInit() {
    }
}
