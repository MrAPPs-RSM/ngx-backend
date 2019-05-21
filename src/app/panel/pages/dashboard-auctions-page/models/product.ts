export class Product {
    id: number;
    categoryId: number;
    limitedDays: number;
    name: string;
    cover: string;
    cost: string;
    desc: string;
    shippingFees: string;
    gallery: Array<any>;
    isDigital?: boolean;

    constructor(jsonData: any) {
        this.id = 0;
        this.name = null;
        this.categoryId = 0;
        this.cover = null;
        this.cost = null;
        this.desc = null;
        this.gallery = [];
        this.shippingFees = null;
        this.isDigital = false;
        this.limitedDays = 0;
        this.updateModel(jsonData);
    }

    updateModel(jsonData: any) {
        if ('id' in jsonData) {
            this.id = jsonData['id'];
        }

        if ('name' in jsonData) {
            this.name = jsonData['name'];
        }

        if ('category_id' in jsonData) {
            this.categoryId = jsonData['category_id'];
        }

        if ('cover' in jsonData) {
            this.cover = jsonData['cover'];
        }

        if ('cost' in jsonData) {
            this.cost = jsonData['cost'];
        }

        if ('desc' in jsonData) {
            this.desc = jsonData['desc'];
        }

        if ('gallery' in jsonData) {
            this.gallery = jsonData['gallery'];
        }

        if ('limited_days' in jsonData) {
            this.limitedDays = jsonData['limited_days'];
        }

        if ('shipping_fees' in jsonData) {
            this.shippingFees = jsonData['shipping_fees'];
        }

        if ('digital' in jsonData) {
            this.isDigital = jsonData['digital'];
        }
    }

    public getGalleryImage(): string {
        let firstImageIndex = 0;
        if (this.gallery.length > 0) {
            for (let i = 0; i < this.gallery.length; i++) {
                const pic = this.gallery[i];
                if (pic.content_type.includes('image')) {
                    firstImageIndex = i;
                    break;
                }
            }
            return this.gallery[firstImageIndex].picture.thumb;
        } else {
            return this.cover;
        }

    }
}
