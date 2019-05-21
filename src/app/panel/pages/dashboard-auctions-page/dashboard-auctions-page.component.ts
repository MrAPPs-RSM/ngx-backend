import {Component, OnInit} from '@angular/core';
import {merge, Subscription} from 'rxjs';
import {SocketService} from '../../../services/socket.service';
import {ApiService} from '../../../api/api.service';
import {Auction} from './models/auction';
import {PhoenixResponse} from '../../../socket/phoenix.channel';
import {ChannelType} from '../../../socket/phoenix.channels';

@Component({
    selector: 'app-dashboard-auctions-page',
    templateUrl: './dashboard-auctions-page.component.html',
    styleUrls: ['./dashboard-auctions-page.component.scss']
})
export class DashboardAuctionsPageComponent implements OnInit {

    private subscriptions: Subscription = new Subscription();

    public auctions: Auction[] = [];
    public newAuction: Auction = null;

    constructor(private socketService: SocketService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.subscriptions.add(
            this.socketService.sleepingSubject.subscribe((isSleeping) => {
                if (!isSleeping) {
                    this.loadAuctions();
                }
            })
        );
    }

    private loadAuctions(): void {
        this.apiService.get('auctions').then((res) => {
            this.auctions = [];
            res.data.map((auctionJson) => {
                this.auctions.push(new Auction(auctionJson));
            });
            console.log('passo', 'nuove aste', this.auctions);

            // joining lobby and subscribe to live update of auctions
            this.joinLobby();

        }).catch((error) => {
            console.error(JSON.stringify(error));
        });
    }

    private joinLobby(): void {
        this.socketService.joinLobby().subscribe((lobbyResponse: PhoenixResponse) => {

            if (lobbyResponse.status === 'ok') {
                if (this.socketService.getMessageSubject(ChannelType.Lobby, 'info') === null) {
                    merge(
                        this.socketService.observeMessage('info'),
                        this.socketService.observeMessage('countdown')
                    ).subscribe((socketResponse) => {
                        this.handleLobbyEvent(socketResponse);
                    });
                }
            }

        }, (error) => {
            console.log(JSON.stringify(error));
        });
    }

    private handleLobbyEvent(socketResponse: any): void {
        let auction = null;

        if ('auction' in socketResponse) {
            auction = socketResponse['auction'];
        } else {
            auction = {'id': socketResponse['auction_id'], 'starts_in': socketResponse['starts_in']};
        }

        let isAuctionExisting = false;

        for (let i = 0; i < this.auctions.length; i++) {
            if (auction.id === this.auctions[i].id) {
                if (this.auctions[i].isBidInfoEvent(auction)) {
                    this.auctions[i].updateModel({isBlinking: false});
                    setTimeout(() => {
                        this.auctions[i].updateModel({isBlinking: true});
                    }, 0);
                }

                this.auctions[i].updateModel(auction);
                isAuctionExisting = true;
                break;
            }
        }

        if (!isAuctionExisting) {
            const newAuction = new Auction(auction);
            this.auctions.push(newAuction);
            this.newAuction = newAuction;
        }
    }

}
