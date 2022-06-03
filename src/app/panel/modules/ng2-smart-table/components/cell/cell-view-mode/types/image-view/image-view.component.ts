import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Cell} from '../../../../../lib/data-set/cell';
import {environment} from '../../../../../../../../../environments/environment';
import {UtilsService} from '../../../../../../../../services/utils.service';

@Component({
    selector: 'image-view-component',
    template: `
        <div class="img-wrapper" [ngClass]="{'isDownloadable': isDownloadable}">
            <a [href]="renderValue" download
               (click)="onClick($event)"
            ></a>
            <img [src]="renderValue" (error)="retryUrl($event)">
        </div>
    `,
    styleUrls: ['./image-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageViewComponent implements OnInit {

    @Input() cell: Cell;

    renderValue: string;
    isDownloadable: boolean = true;
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
            this.isDownloadable = false;
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

    onClick($event: any): void {
        if (!this.isDownloadable) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }
}
