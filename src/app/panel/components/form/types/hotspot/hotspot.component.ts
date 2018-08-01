import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'app-hotspot',
    templateUrl: './hotspot.component.html',
    styleUrls: ['./hotspot.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotspotComponent implements OnInit {

    @Input() field: any;

    public imageUrl: string;
    public hotSpots: HotSpot[];
    @ViewChild('imageWrapper') imageWrapper: ElementRef;

    constructor() {
    }

    ngOnInit() {
        this.imageUrl = 'http://via.placeholder.com/500x600';
        this.hotSpots = [
            {
                x: 10,
                y: 5
            },
            {
                x: 50,
                y: 89
            }
        ];
        this.imageWrapper.nativeElement.width = 600;
    }

    private add($event: any) {
        const item: HotSpot = {
            x: $event.offsetX,
            y: $event.offsetY
        };
        this.hotSpots.push(item);
    }

    private onDragEnd($event: any, hotSpot: HotSpot) {
        setTimeout(() => {
            hotSpot.x = $event.x;
            hotSpot.y = $event.y;
        }, 500);
    }
}

interface HotSpot {
    x: number;
    y: number;
}
