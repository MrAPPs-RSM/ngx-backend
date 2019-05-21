import {Product} from './product';
import {DateTime} from 'luxon';
import {Bid} from './bid';

interface Translation {
    translationKey: string;
    translationParam: object;
}

export class Auction {
    id: number;
    defaultTimer: number;
    maxPrice: number;
    timer: number;
    decimalTimer: number;
    startsIn: number;
    autobidBalance: number;
    totalBids: number;
    price: string;
    status: string;
    lastBidder: string;
    cost: string;
    startsAt: DateTime;
    product: Product;
    closedAt: DateTime;
    lastBids: Array<Bid>;
    favorite: boolean;
    isBlinking: boolean;
    isAutobiddable: boolean;
    isRedeemable: boolean;
    isAutorechargeEnabled: boolean;
    hasWinner: boolean;
    canTestify: boolean;
    isLocked: boolean;

    constructor(jsonData: any) {
        this.id = 0;
        this.price = null;
        this.startsAt = null;
        this.product = new Product({});
        this.status = null;
        this.lastBidder = null;
        this.favorite = false;
        this.cost = null;
        this.maxPrice = null;
        this.closedAt = null;
        this.lastBids = [];
        this.defaultTimer = 0;
        this.timer = 0;
        this.decimalTimer = 0;
        this.startsIn = 0;
        this.isBlinking = false;
        this.isAutobiddable = false;
        this.autobidBalance = 0;
        this.totalBids = 0;
        this.isRedeemable = true;
        this.isAutorechargeEnabled = false;
        this.hasWinner = false;
        this.canTestify = false;
        this.isLocked = false;

        this.updateModel(jsonData);
    }

    rearrangeLastBids() {
        if (this.lastBids.length > 7) {
            this.lastBids.splice(7);
        }
    }

    updateModel(jsonData: any) {
        if ('id' in jsonData) {
            this.id = jsonData['id'];
        }

        if ('status' in jsonData) {
            this.status = jsonData['status'];

            if (this.status === 'closed') {
                this.autobidBalance = 0;
                this.hasWinner = this.lastBids.length > 0;
            }
        }

        if ('price' in jsonData) {
            this.price = jsonData['price'];
        }

        if ('starts_at' in jsonData) {
            this.startsAt = jsonData['starts_at'] !== null ? DateTime.fromISO(jsonData['starts_at']) : null;
        }

        if ('total_bids' in jsonData) {
            this.totalBids = jsonData['total_bids'];
        }

        if ('is_locked' in jsonData) {
            this.isLocked = jsonData['is_locked'];
        }

        if (('last_bids' in jsonData && Object.keys(jsonData['last_bids']).length > 0)
            || 'last_bid' in jsonData && Object.keys(jsonData['last_bid']).length > 0) {

            this.hasWinner = this.isClosed();

            if ('last_bid' in jsonData) {
                this.lastBidder = jsonData['last_bid']['username'];
                this.lastBids.splice(0, 0, new Bid(jsonData['last_bid']));
            } else {
                this.lastBids = [];
                jsonData['last_bids'].forEach((bidData) => {
                    this.lastBids.push(new Bid(bidData));
                });
                if (this.lastBids.length > 0) {
                    this.lastBidder = this.lastBids[0].username;
                }
            }

            this.rearrangeLastBids();
        }

        if ('favorite' in jsonData) {
            this.favorite = jsonData['favorite'] !== null ? jsonData['favorite'] : this.favorite;
        }

        if ('cost' in jsonData) {
            this.cost = jsonData['cost'] !== null ? jsonData['cost'] : this.cost;
        }

        if ('closed_at' in jsonData) {
            this.closedAt = jsonData['closed_at'] !== null ? DateTime.fromISO(jsonData['closed_at']) : null;
        }

        if ('max_price_pct' in jsonData) {
            this.maxPrice = jsonData['max_price_pct'];
        }

        if ('isBlinking' in jsonData) {
            this.isBlinking = jsonData['isBlinking'];
        }

        if ('autobiddable' in jsonData) {
            this.isAutobiddable = jsonData['autobiddable'];
        }

        if ('ab_balance' in jsonData) {
            this.autobidBalance = jsonData['ab_balance'];
        }

        if ('product' in jsonData) {
            this.product = new Product(jsonData['product']);
        }

        if ('starts_in' in jsonData) {
            this.startsIn = jsonData['starts_in'];
        }

        if ('default_timer' in jsonData) {
            this.defaultTimer = jsonData['default_timer'];
        }

        if ('timer' in jsonData) {
            this.timer = jsonData['timer'];
            this.decimalTimer = this.timer;
        }

        if ('redeemable' in jsonData) {
            this.isRedeemable = jsonData['redeemable'];
        }

        if ('auto_recharged' in jsonData) {
            this.isAutorechargeEnabled = jsonData['auto_recharged'];
        }

        if ('can_testify' in jsonData) {
            this.canTestify = jsonData['can_testify'];
        }
    }

    public timeToStart(): string {
        return this.startsAt !== null ? this.startsAt.toLocal().toLocaleString(DateTime.TIME_SIMPLE) : '---';
    }

    public getTimeLeftOrTimer(isDetails: boolean = false): Translation {
        let translationKey = 'auction.starts_at';
        let translationParam: object = {time: this.timeToStart()};

        switch (this.status) {
            case 'started':
                if (isDetails) {
                    translationKey = this.price;
                    translationParam = null;
                } else {
                    translationKey = this.readableCountDownSeconds(this.timer);
                    translationParam = null;
                }
                break;
            case 'closed':
                translationKey = this.hasWinner ? 'auction.sold' : 'auction.closed';
                translationParam = null;
                break;
            case 'stopped':
                if (isDetails) {
                    translationKey = this.price;
                    translationParam = null;
                } else {
                    translationKey = 'auction.restarts_at';
                }
                break;
            case 'starting':
                if (this.startsIn > 0) {
                    translationKey = 'auction.starts_in';
                    translationParam = {time: this.readableCountDownSeconds(this.startsIn)};
                }
                break;
        }

        return {
            translationKey: translationKey,
            translationParam: translationParam
        };
    }

    public getBuyButtonText(): Translation {
        return {
            translationKey: this.isAutobiddable ? 'auction.price_format' : 'auction.buy_at_price',
            translationParam: {price: this.product.cost}
        };
    }

    public readableClosedAt(): string {
        return this.closedAt !== null ? this.closedAt.toLocal().toLocaleString(DateTime.DATETIME_MED) : '---';
    }

    public readableClosedAtDate(): string {
        return this.closedAt !== null ? this.closedAt.toLocal().toLocaleString(DateTime.DATE_MED) : '---';
    }

    public readableClosedAtTime(): string {
        return this.closedAt !== null ? this.closedAt.toLocal().toLocaleString(DateTime.TIME_24_SIMPLE) : '---';
    }

    public readableCountDownSeconds(seconds: number): string {
        return DateTime.fromMillis(seconds * 1000).toFormat('mm:ss');
    }

    public imAutobidding(): boolean {
        return this.autobidBalance > 0;
    }

    public isRunning(): boolean {
        return this.status === 'started';
    }

    public isStarting(): boolean {
        return this.status === 'starting';
    }

    public isClosed(): boolean {
        return this.status === 'closed';
    }

    public isStopped(): boolean {
        return this.status === 'stopped';
    }

    public hasLimitedDays(): boolean {
        return this.product.limitedDays > 0;
    }

    public getLimitedDaysVal() {
        let resKey = 'auction.none';
        let resParam = null;
        if (this.hasLimitedDays()) {
            resKey = this.product.limitedDays > 1 ? 'auction.limitedDaysVal' : 'auction.limitedDayVal';
            resParam = {days: this.product.limitedDays};
        }
        return {
            key: resKey,
            param: resParam
        };
    }

    public isBidInfoEvent(socketResponseAuction): boolean {
        let res = false;
        if ('last_bid' in socketResponseAuction) {
            if (this.lastBids.length > 0) {
                const currentBid = this.lastBids[0];
                const newBid = socketResponseAuction.last_bid;
                if (currentBid.id !== newBid.id) {
                    res = true;
                }
            } else {
                res = true;
            }
        }
        return res;
    }

    public get leastBalanceValue(): number | string {
        return this.isAutorechargeEnabled ? '∞' : this.autobidBalance;
    }

    public getGalleryImage(): string {
        let firstImageIndex = 0;

        for (let i = 0; i < this.product.gallery.length; i++) {
            const pic = this.product.gallery[i];
            if (pic.content_type.includes('image')) {
                firstImageIndex = i;
                break;
            }
        }

        if ('picture' in this.product.gallery[firstImageIndex]) {
            return this.product.gallery[firstImageIndex].picture.thumb;
        } else {
            return '';
        }
    }
}
