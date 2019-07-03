import {TicketMessage} from './ticket-message';
import * as moment from 'moment';

export class Ticket {
  id: number;
  categoryId: number;
  title: string;
  status: string;
  insertedAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  user: {id: number, username: string};
  orderId: number;
  lastMessage: { sender: string, message: string };

  constructor(jsonData: any,
              currentUser: string) {
    this.id = 0;
    this.insertedAt = null;
    this.updatedAt = null;
    this.categoryId = null;
    this.title = null;
    this.status = null;
    this.messages = [];
    this.lastMessage = null;
    this.orderId = null;
    this.user = {id: null, username: null};

    this.updateModel(jsonData, currentUser);
  }

  updateModel(jsonData: any, currentUser: string) {
    if ('id' in jsonData) {
      this.id = jsonData['id'];
    }
    if ('inserted_at' in jsonData) {
      this.insertedAt = jsonData['inserted_at'] !== null ? moment(jsonData['inserted_at']).format('DD/MM/YYYY, HH:mm') : null;
    }
    if ('updated_at' in jsonData) {
      this.updatedAt = jsonData['updated_at'] !== null ? moment(jsonData['updated_at']).format('DD/MM/YYYY, HH:mm') : null;
    }
    if ('category_id' in jsonData) {
      this.categoryId = jsonData['category_id'];
    }
    if ('title' in jsonData) {
      this.title = jsonData['title'];
    }
    if ('status' in jsonData) {
      this.status = jsonData['status'];
    }
    if ('messages' in jsonData) {
      jsonData['messages'].forEach((message: any) => {
        this.messages.push(new TicketMessage(message, currentUser));
      });
    }
    if ('last_message' in jsonData) {
      this.lastMessage = {sender: jsonData['last_message'].user.username, message: jsonData['last_message'].message};
    }

    if ('order_id' in jsonData) {
      this.orderId = jsonData['order_id'];
    }

    if ('user' in jsonData) {
      this.user = jsonData['user'];
    }

    if ('user_id' in jsonData) {
      this.user.id = jsonData['user_id'];
    }
  }

  public isClosed(): boolean {
    return this.status === 'closed';
  }

  public isOpen(): boolean {
    return this.status === 'open';
  }
}
