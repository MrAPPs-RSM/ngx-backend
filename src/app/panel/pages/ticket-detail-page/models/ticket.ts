import {TicketMessage} from './ticket-message';
import * as moment from 'moment';

export class Ticket {
  id: number;
  category: string;
  title: string;
  status: string;
  insertedAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  lastMessage: { sender: string, message: string };

  constructor(jsonData: any,
              currentUser: string) {
    this.id = 0;
    this.insertedAt = null;
    this.updatedAt = null;
    this.category = null;
    this.title = null;
    this.status = null;
    this.messages = [];
    this.lastMessage = null;

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
    if ('category' in jsonData) {
      this.category = jsonData['category'];
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
  }

  public isClosed(): boolean {
    return this.status === 'closed';
  }

  public isOpen(): boolean {
    return this.status === 'open';
  }
}
