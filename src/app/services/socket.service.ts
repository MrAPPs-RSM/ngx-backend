import {Injectable} from '@angular/core';
import {ChannelType, PhoenixChannels} from '../socket/phoenix.channels';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {PhoenixResponse} from '../socket/phoenix.channel';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private currentSocketErrorStatusSubject: BehaviorSubject<string>;
    private currentChannel: ChannelType;
    private jwtToken: string;
    messagesSubjects: any;
    private isSleeping: boolean;
    public sleepingSubject: BehaviorSubject<boolean>;
    public generalJoinedSubject: BehaviorSubject<boolean>;

    constructor(private phoenixChannels: PhoenixChannels) {
        this.currentChannel = ChannelType.None;
        this.jwtToken = null;
        this.messagesSubjects = {};
        this.currentSocketErrorStatusSubject = new BehaviorSubject<any>(null);
        this.isSleeping = false;
        this.sleepingSubject = new BehaviorSubject<boolean>(this.isSleeping);
        this.generalJoinedSubject = new BehaviorSubject<boolean>(false);
    }

    public setSleepingStatus(isSleeping: boolean) {
        this.isSleeping = isSleeping;
        this.sleepingSubject.next(this.isSleeping);
    }

    public generalJoinedSubjectObservable(): Observable<boolean> {
        return this.generalJoinedSubject.asObservable();
    }

    setJwtToken(jwtToken: string = null): Observable<any> {
        if (jwtToken === this.jwtToken) {
            if (this.phoenixChannels.isConnected()) {
                return;
            }
        } else {
            if (jwtToken === null) {
                this.jwtToken = null;
            } else {
                this.jwtToken = jwtToken;
            }
        }

        return this.connect(jwtToken !== null);
    }

    public isConnected(): boolean {
        return this.phoenixChannels.isConnected();
    }

    public connect(reconnectChannels = true): Observable<any> {

        const observable = this.phoenixChannels.connect(this.jwtToken === null ? {} : {'params': {'token': this.jwtToken}});
        observable.subscribe(value => {

            if (this.jwtToken && value['status'] === 'opened') {
                this.joinGeneral().subscribe((response: PhoenixResponse) => {

                    this.generalJoinedSubject.next(response.status === 'ok');
                });

            } else {
                this.leaveGeneral();
            }
            },
            error => {
                this.leaveGeneral();
                this.currentSocketErrorStatusSubject.next('error');
            });
        this.phoenixChannels.reconnectChannels(reconnectChannels);
        this.reobserveMessages();
        return observable;
    }

    private reobserveMessages() {
        Object.keys(this.messagesSubjects).forEach((channel) => {
            Object.keys(this.messagesSubjects[channel]).forEach((message) => {
                if (this.phoenixChannels.getChannel(ChannelType[channel]) !== null) {
                    const currentSubject = this.getMessageSubject(ChannelType[channel], message);
                    const observable = this.phoenixChannels.observeMessage(ChannelType[channel], message);
                    observable.subscribe(currentSubject);
                }
            });
        });
    }

    private clearChannelSubjects(channelType: ChannelType) {
        if (channelType in this.messagesSubjects) {
            const topicSubjects = this.messagesSubjects[channelType];

            Object.keys(topicSubjects).forEach((message) => {
                const subject: Subject<any> = topicSubjects[message];
                subject.complete();
            });

            delete this.messagesSubjects[channelType];
        }
    }

    public getCurrentSocketErrorStatusObservable(): Observable<string> {
        return this.currentSocketErrorStatusSubject.asObservable();
    }

    private cleanChannelReferences(channel: ChannelType) {
        this.phoenixChannels.removeFromChannel(channel);
        this.clearChannelSubjects(channel);
    }

    public leaveCurrentChannel() {
        if (this.currentChannel !== ChannelType.None) {
            console.log('leaving', this.currentChannel);
            this.cleanChannelReferences(this.currentChannel);
            this.currentChannel = ChannelType.None;
        }
    }

    public joinGeneral(): Observable<any> {
        return this.phoenixChannels.joinChannel(ChannelType.General, 'general');
    }

    public leaveGeneral() {
        console.log('leave general');
        this.phoenixChannels.removeFromChannel(ChannelType.General);
        this.generalJoinedSubject.next(false);
    }

    public disconnect(keepChannels: boolean = true) {
        this.phoenixChannels.disconnect(keepChannels);
    }

    public joinLobby(): Observable<any> {
        this.cleanChannelReferences(ChannelType.Auction);
        this.currentChannel = ChannelType.Lobby;
        return this.phoenixChannels.joinChannel(this.currentChannel, 'auction:lobby');
    }

    public joinAuction(id: string): Observable<any> {
        this.cleanChannelReferences(ChannelType.Lobby);
        this.currentChannel = ChannelType.Auction;
        return this.phoenixChannels.joinChannel(this.currentChannel, 'auction:' + id);
    }

    public makeABid(auctionId: number) {
        const payload = {
            'auction_id': auctionId
        };

        return this.phoenixChannels.sendMessage(
            ChannelType.General,
            'bid',
            payload
        );
    }

    public addAuctionToFavorite(auctionId: number) {
        const payload = {
            'auction_id': auctionId
        };

        return this.phoenixChannels.sendMessage(
            ChannelType.General,
            'bookmark',
            payload
        );
    }

    public setAutochargeBid(auctionId: number) {
        const payload = {
            'auction_id': auctionId
        };

        return this.phoenixChannels.sendMessage(
            ChannelType.General,
            'toggle_autorecharge',
            payload
        );
    }

    public setAutoBid(bids: number, auctionId: number) {
        const payload = {
            'bids': bids,
            'auction_id': auctionId
        };


        return this.phoenixChannels.sendMessage(
            ChannelType.General,
            'set_autobid',
            payload
        );
    }

    public unsetAutoBid(auctionId: number) {
        const payload = {
            'auction_id': auctionId
        };

        return this.phoenixChannels.sendMessage(
            ChannelType.General,
            'unset_autobid',
            payload
        );
    }

    public getMessageSubject(channel: ChannelType, message: string) {

        if (channel in this.messagesSubjects) {
            const currentChannelSubjects = this.messagesSubjects[channel];
            if (message in currentChannelSubjects) {
                return currentChannelSubjects[message];
            }
        } else {
            this.messagesSubjects[channel] = {};
        }

        return null;
    }

    public observeMessage(message, channel = this.currentChannel): Observable<any> {
        const currentSubject = this.getMessageSubject(channel, message);

        if (currentSubject) {
            return currentSubject;
        } else {
            const observable = this.phoenixChannels.observeMessage(channel, message);
            const subject = new Subject();
            observable.subscribe(subject);
            this.messagesSubjects[channel][message] = subject;

            return subject;
        }
    }

}
