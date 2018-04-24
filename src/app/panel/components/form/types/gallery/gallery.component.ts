import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Gallery} from '../../interfaces/gallery';
import {ApiService} from '../../../../../api/api.service';
import {ToastsService} from '../../../../../services/toasts.service';
import {ActivatedRoute} from "@angular/router";

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

    constructor(private _apiService: ApiService,
                private _toast: ToastsService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.isLoading = false;
        this.loadGallery();
    }

    private loadGallery(): void {
        this.isLoading = true;
        let endpoint = this.field.options.endpoint;
        if (endpoint.indexOf(':id') !== -1) {
            endpoint = endpoint.replace(':id', this._route.snapshot.params['id']);
        }
        this._apiService.get(endpoint).then((data) => {
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
