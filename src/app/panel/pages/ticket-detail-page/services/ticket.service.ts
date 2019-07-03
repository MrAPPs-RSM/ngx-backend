import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket';
import { TicketMessage } from '../models/ticket-message';
import { UserService } from '../../../../auth/services/user.service';
import { ApiService } from '../../../../api/api.service';
import { TicketCategory } from '../models/ticket-category';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private apiService: ApiService,
    private userService: UserService) {
  }

  public getCategories(): Promise<TicketCategory | any> {
    return this.apiService.get('ticket-categories', false);
  }


  public getMyTicket(id: number, page: number = 1, limit: number = 10): Promise<Ticket | any> {
    return this.apiService.get('tickets/' + id + '?per_page=' + limit + '&page=' + page, false);
  }

  public createTicket(payload: any): Promise<any> {
    return this.apiService.put('tickets', payload);
  }

  public updateTicket(id: number, payload: any): Promise<any> {
    return this.apiService.patch('tickets/' + id, payload);
  }

  public sendMessage(ticketId: number, message: string, pictureId: number): Promise<TicketMessage | any> {
    return new Promise((resolve, reject) => {

      this.apiService.post('tickets/' + ticketId + '/messages', { message: message, picture_id: pictureId })
        .then((res) => {
          resolve(new TicketMessage(res, this.userService.getUser().username));
        })
        .catch(reject);
    });
  }
}



