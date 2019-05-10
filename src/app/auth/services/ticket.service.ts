import {Injectable} from '@angular/core';
import {Ticket} from '../../models/ticket';
import {TicketMessage} from '../../models/ticket-message';
import {TicketCategory} from '../../models/interfaces';
import {UserService} from './user.service';
import {ApiService} from '../../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private static categories: Array<TicketCategory> = [
    {
      id: 1,
      name: 'Dov\'è il mio ordine?'
    },
    {
      id: 2,
      name: 'Problemi con il mio ordine'
    },
    {
      id: 3,
      name: 'Modificare un ordine'
    },
    {
      id: 4,
      name: 'Resi e rimborsi'
    },
    {
      id: 5,
      name: 'Pagamenti'
    },
    {
      id: 6,
      name: 'Richiesta fattura'
    },
    {
      id: 7,
      name: 'Offerte e Buoni Sconto'
    },
    {
      id: 8,
      name: 'Ho un\'altra domanda'
    }
  ];

  constructor(private apiService: ApiService,
              private userService: UserService) {
  }

  public getMyTickets(limit: number = 10, page: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.get('tickets?page_size=' + limit + '&page=' + page, false).then((res) => {
        resolve(res);
      }).catch(reject);
    });
  }

  public getCategories(): Array<TicketCategory> {
    return TicketService.categories;
  }

  public getMyTicket(id: number, page: number = 1, limit: number = 10): Promise<Ticket | any> {
    return new Promise((resolve, reject) => {
      this.apiService.get('tickets/' + id + '?per_page=' + limit + '&page=' + page, false)
        .then((res) => {
          resolve(res);
        }).catch(reject);
    });
  }

  public sendMessage(ticketId: number, message: string, pictureId: number): Promise<TicketMessage | any> {
    return new Promise((resolve, reject) => {

      this.apiService.patch('tickets/' + ticketId, {message: message, picture_id: pictureId})
        .then((res) => {
          resolve(new TicketMessage(res, this.userService.getUser().username));
        })
        .catch(reject);
    });
  }
}



