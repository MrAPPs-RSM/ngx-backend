import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Gallery} from '../../interfaces/gallery';
import {ApiService} from '../../../../../api/api.service';
import {ToastsService} from '../../../../../services/toasts.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GalleryComponent implements OnInit {

    @Input() field: Gallery;

    isLoading: boolean;
    gallery: Media[];

    constructor(private _apiService: ApiService, private _toast: ToastsService) {
    }

    ngOnInit() {
        this.isLoading = false;
        this.loadGallery();
    }

    private loadGallery(): void {
        this.isLoading = true;
        this._apiService.get(this.field.options.endpoint).then((data) => {
            this.isLoading = false;
            this.gallery = data;
        }).catch((err) => {
            this.isLoading = false;
            this._toast.error(err);
        });
    }
}

interface Media {
    url: string;
}
