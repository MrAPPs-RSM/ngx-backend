import * as moment from 'moment';

export class TicketMessage {
  id: number;
  message: string;
  pictureUrl: string;
  user: { username: string };
  insertedAt: string;
  sent: boolean;

  constructor(jsonData: any, currentUser: string) {
    this.id = 0;
    this.insertedAt = null;
    this.message = null;
    this.user = {username: null};
    this.sent = false;
    this.pictureUrl = null;

    this.updateModel(jsonData, currentUser);
  }

  updateModel(jsonData: any, currentUser: string) {
    if ('id' in jsonData) {
      this.id = jsonData['id'];
    }
    if ('message' in jsonData) {
      this.message = jsonData['message'];
    }
    if ('inserted_at' in jsonData) {
      this.insertedAt = jsonData['inserted_at'] !== null ? moment(jsonData['inserted_at']).format('DD/MM/YYYY, HH:mm') : null;
    }
    if ('user' in jsonData) {
      this.user = jsonData['user'];
    }
    if ('picture_url' in jsonData) {
      this.pictureUrl = jsonData['picture_url'];
    }

    this.sent = this.user.username === currentUser;
  }
}
