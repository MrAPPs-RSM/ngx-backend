import {Socket} from 'phoenix/assets/js/phoenix.js';
import {PhoenixChannel} from './phoenix.channel';
import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

export enum ChannelType {
    None = 'None',
    Lobby = 'Lobby',
    Auction = 'Auction',
    General = 'General'
}

@Injectable({
    providedIn: 'root',
    useFactory: () => new PhoenixChannels(),
    deps: [PhoenixChannels],
})
export class PhoenixChannels {
    private socket: Socket;
    channels = {};

    constructor() {
        this.socket = null;
    }

    private checkSocket() {
        if (this.socket === null) {
            throw new Error('Socket not initialized');
        }
    }

    private checkChannel(channelType: ChannelType) {
        if (channelType !== ChannelType.None &&
            !(channelType in this.channels)) {
            throw new Error('Channel ' + channelType + ' not found');
        }
    }

    public reconnectChannels(isUserLoggedIn = false) {
        this.checkSocket();

        Object.keys(this.channels).forEach((key) => {
            const channel: PhoenixChannel = this.channels[key];
            if (key === ChannelType.General.toString() && !isUserLoggedIn) {
                this.removeFromChannel(ChannelType[key]);
            } else {
                this.joinChannel(ChannelType[key], channel.topic, true);
            }
        });
    }

    public isConnected() {
        return this.socket && (this.socket.connectionState() === 'connecting' || this.socket.connectionState() === 'open');
    }

    public connect(options = {}, keepChannels = true): Observable<any> {
        if (this.socket !== null) {
            this.disconnect(keepChannels);
        }

        this.socket = new Socket(environment.socketEndpoint, options);
        console.log('connecting... ');
        this.socket.connect();

        return new Observable((observer) => {
            this.socket.onError((error) => {
                console.log(error);
                observer.error(error);
            });

            this.socket.onOpen(() => {
                console.log('CONNECTED');
                observer.next({'status': 'opened'});
            });

            this.socket.onClose(() => {
                console.log('DISCONNECTED');
                observer.next({'status': 'closed'});
            });

        });
    }

    public disconnect(keepChannels: boolean = true) {

        this.checkSocket();

        if (!keepChannels) {
            Object.keys(this.channels).forEach((key) => {
                this.removeFromChannel(ChannelType[key]);
            });
        }
        console.log('disconnecting...');
        this.socket.disconnect();
    }

    public getChannel(channelType: ChannelType): PhoenixChannel {
        return channelType in this.channels ? this.channels[channelType] : null;
    }

    public joinChannel(channelType: ChannelType, topic: string, forceRefresh = false): Observable<any> {

        this.checkSocket();

        if (!forceRefresh) {
            const actualChannel = this.getChannel(channelType);

            if (actualChannel) {

                if (actualChannel.topic === topic) {
                    return actualChannel.on();
                } else {
                    actualChannel.off();
                }
            }
        }

        const channel = new PhoenixChannel(this.socket, topic);
        console.log('join', topic);
        this.channels[channelType] = channel;

        return channel.on();
    }

    public removeFromChannel(channelType: ChannelType) {
        this.checkSocket();

        if (channelType in this.channels) {
            const channel: PhoenixChannel = this.channels[channelType];
            channel.off();

            delete this.channels[channelType];
        }
    }

    public sendMessage(channelType: ChannelType, event: string, payload = {}): Observable<any> {
        this.checkSocket();
        this.checkChannel(channelType);

        const channel: PhoenixChannel = this.channels[channelType];
        return channel.sendMessage(event, payload);
    }

    public observeMessage(channelType: ChannelType, message: string) {
        this.checkSocket();
        this.checkChannel(channelType);

        return this.getChannel(channelType).observeMessage(message);
    }
}
