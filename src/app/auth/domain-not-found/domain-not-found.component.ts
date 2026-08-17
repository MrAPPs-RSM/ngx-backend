import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-domain-not-found',
    templateUrl: './domain-not-found.component.html',
    styleUrls: ['./domain-not-found.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DomainNotFoundComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}
