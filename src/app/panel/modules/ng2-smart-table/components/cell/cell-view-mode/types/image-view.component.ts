import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';
import {environment} from '../../../../../../../../environments/environment';
import {UtilsService} from '../../../../../../../services/utils.service';

@Component({
    selector: 'image-view-component',
    template: `<img [src]="renderValue" (error)="retryUrl($event)">`,
    styles: ['img { max-width: 70px; }']
})
export class ImageViewComponent implements OnInit {

    @Input() cell: Cell;

    private renderValue: string;

    ngOnInit() {
        const value = this.cell.getValue();
        if (value) {
            if (typeof value === 'string') {
                if (UtilsService.isValidURL(value)) {
                    this.renderValue = value;
                } else {
                    // Loopback Local Storage File
                    this.renderValue = environment.api.baseFilesUrl + value;
                }
            } else {
                // Google Cloud Storage File
                this.renderValue = value.thumbnails.small;
            }
        } else {
            this.renderValue = '../../../../../../../../assets/images/image-error.png';
        }
    }

    /** Sometimes, Google Cloud takes a few seconds to make the image accessible */
    private retryUrl($event: any): void {
        setTimeout(() => {
            $event.target.src = this.renderValue;
        }, 2000);
    }
}
