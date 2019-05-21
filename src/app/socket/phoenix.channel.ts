import {Observable} from 'rxjs';

export class PhoenixResponse {
  public status: string;
  public response: any;

  constructor(status: string, response = null) {
    this.status = status;
    this.response = response;
  }
}

export class PhoenixChannel {

  private socket;
  public topic;
  private channel;
  private joinedObservable;

  constructor(socket, topic, options = {}) {
    this.socket = socket;
    this.topic = topic;
    this.joinedObservable = null;
    this.channel = this.socket.channel(topic, options);
  }

  on() {
    if (this.joinedObservable === null) {
      const joined = this.channel.join();

      this.joinedObservable = new Observable( (observer) => {
        joined
            .receive('ok', resp => {
              console.log('connected', JSON.stringify(resp));
              observer.next(new PhoenixResponse('ok', resp));
            })
            .receive('error', resp => {
              console.log('error');
              observer.error(resp); })
            .receive('timeout', () => {
              console.log('Networking issue...' + this.topic);
              observer.next(new PhoenixResponse('timeout'));
            })
            .receive('closed', resp => {
              observer.next(new PhoenixResponse('closed'));
              console.log('auction ' + this.topic + ' closed');
            });
      });
    }

    return this.joinedObservable;
  }

  off() {
    if (this.channel.state === 'joined' || this.channel.state === 'joining') {
      this.channel.leave(30);
    }
  }

  observeMessage(message) {
    return new Observable( (observer) => {
      this.channel.on(message, (resp) => {
        console.log(message, resp);
        observer.next(resp);
      });
    });
  }

  sendMessage(event: string, payload = {}, timeout = 30) {
    const message = this.channel.push(event, payload, timeout);
    return new Observable((observer) => {
      message.receive('ok', resp => {
        console.log('sendMessage: sent', resp);
        observer.next(resp);
      }).receive('error', resp => {
        console.log('sendMessage: error');
        observer.error(resp);
      });
    });
  }
}
