import {DateTime} from 'luxon';

export class Bid {
    id: number;
    type: string;
    username: string;
    price: string;
    insertedAt: DateTime;

    constructor(jsonData: any) {
        this.id = 0;
        this.type = null;
        this.insertedAt = null;
        this.username = null;
        this.price = null;

        this.updateModel(jsonData);
    }

    updateModel(jsonData: any) {
        if ('id' in jsonData) {
            this.id = jsonData['id'];
        }

        if ('bid_type' in jsonData) {
            this.type = jsonData['bid_type'];
        }

        if ('inserted_at' in jsonData) {
            this.insertedAt = jsonData['inserted_at'] !== null ? DateTime.fromISO(jsonData['inserted_at']) : null;
        }

        if ('username' in jsonData) {
            this.username = jsonData['username'];
        }

        if ('auction_price' in jsonData) {
            this.price = jsonData['auction_price'];
        }
    }

    public readableInsertAt(): string {
        return this.insertedAt !== null ? this.insertedAt.toLocal().toLocaleString(DateTime.TIME_WITH_SECONDS) : '---';
    }
}
