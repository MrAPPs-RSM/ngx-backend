import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Cell} from '../../../../../lib/data-set/cell';
import {environment} from '../../../../../../../../../environments/environment';
import {UtilsService} from '../../../../../../../../services/utils.service';

@Component({
    selector: 'image-view-component',
    template: `
        <div class="img-wrapper">
            <a [href]="renderValue" download></a>
            <img [src]="renderValue" (error)="retryUrl($event)">
            <i class="fa fa-download"></i>
        </div>
    `,
    styleUrls: ['./image-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageViewComponent implements OnInit {

    @Input() cell: Cell;

    renderValue: string;
    private count: number;

    ngOnInit() {
        this.count = 0;
        const value = this.cell.getValue();
        if (value) {
            if (typeof value === 'string') {
                if (UtilsService.isValidURL(value)) {
                    this.renderValue = value;
                } else {
                    // Loopback Local Storage File
                    this.renderValue = value;
                }
            } else {
                // Google Cloud Storage File
                this.renderValue = value.thumbnails.small;
            }
        } else {
            this.renderValue = environment.assets.imageError;
        }
    }

    /** Sometimes, Google Cloud takes a few seconds to make the image accessible */
    retryUrl($event: any): void {
        if (this.count < 3) {
            this.count++;
            setTimeout(() => {
                $event.target.src = this.renderValue;
            }, 2000);
        } else {
            this.renderValue = environment.assets.imageError;
        }
    }
}
