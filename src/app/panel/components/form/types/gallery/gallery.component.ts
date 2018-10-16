import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Gallery} from '../../interfaces/gallery';
import {ApiService} from '../../../../../api/api.service';
import {ToastsService} from '../../../../../services/toasts.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../../../environments/environment';

declare const $: any;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GalleryComponent implements OnInit, AfterViewInit {

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

    ngAfterViewInit() {
        $('[data-fancybox]').fancybox({
            buttons: [
                'zoom',
                'download',
                'thumbs',
                'close'
            ]
        });
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

    onImageError($event: any, media: Media): void {
       media.url = environment.assets.imageError;
    }
}

interface Media {
    url: string;
    title: string;
}
