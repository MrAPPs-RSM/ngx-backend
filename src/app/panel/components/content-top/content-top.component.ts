import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GlobalState} from '../../../global.state';

@Component({
    selector: 'app-content-top',
    templateUrl: './content-top.component.html',
    styleUrls: ['./content-top.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentTopComponent implements OnInit {

    private activePage: string;
    private breadcrumb: any[] = [];

    constructor(private _state: GlobalState) {
    }

    ngOnInit() {
        this._state.subscribe('activePage', (activeLink) => {
            if (activeLink) {
                this.activePage = activeLink.title;
                if (activeLink.route) {
                    if (activeLink.breadcrumbLevel === 1) {
                        this.breadcrumb = [];
                        this.breadcrumb.push(activeLink);
                    } else {
                        const indexesToDelete = [];
                        this.breadcrumb.forEach((link, index) => {
                            if (link.breadcrumbLevel > activeLink.breadcrumbLevel) {
                                indexesToDelete.push(index);
                            }
                        });

                        if (indexesToDelete.length) {
                            indexesToDelete.forEach((index) => {
                                this.breadcrumb.splice(index, 1);
                            });
                        } else {
                            this.breadcrumb.push(activeLink);
                        }
                    }
                } else {
                    this.breadcrumb = [];
                }
            }
        });
    }
}
