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
    @ViewChild('image') image: ElementRef;

    constructor() {
    }

    ngOnInit() {
        this.imageUrl = 'http://via.placeholder.com/1900x1800';
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
    }

    private add($event: any) {
        const item: HotSpot = {
            x: $event.offsetX,
            y: $event.offsetY
        };
        this.hotSpots.push(item);
    }

    private onDrag($event: any, hotSpot: HotSpot) {
        hotSpot.isDragging = true;
    }

    private onDragEnd($event: any, hotSpot: HotSpot) {
        hotSpot.isDragging = false;
        if (this.isInBounds($event, hotSpot))  {
            hotSpot.x += $event.offsetX;
            hotSpot.y += $event.offsetY;
        }
    }

    private isInBounds($event: any, hotSpot: HotSpot) {
        const x = parseInt($event.offsetX + hotSpot.x, 10);
        const y = parseInt($event.offsetY + hotSpot.y, 10);

        return (x <= this.image.nativeElement.width && x >= 0) &&
            (y <= this.image.nativeElement.height && y >= 0);
    }

    private onEdit($event: any, hotSpot: HotSpot) {
        $event.preventDefault();
        console.log('On edit');
    }
}

interface HotSpot {
    x: number;
    y: number;
    isDragging?: boolean;
}
