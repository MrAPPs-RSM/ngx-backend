import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Ticket } from './models/ticket';
import { TicketService } from './services/ticket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketMessage } from './models/ticket-message';
import { UserService } from '../../../auth/services/user.service';
import { TicketCategory } from './models/ticket-category';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../api/api.service';
import { ToastsService } from '../../../services/toasts.service';

@Component({
  selector: 'app-ticket-detail-page',
  templateUrl: './ticket-detail-page.component.html',
  styleUrls: ['./ticket-detail-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketDetailPageComponent implements OnInit {

  public ticket: Ticket = null;
  public newMessage: string = null;
  public id: number = null;
  public page: number = 1;
  public endReached: boolean = false;
  public showFileUpload: boolean = false;
  public file: { id?: number, uploaded?: boolean, url?: string, reset: any } = {
    reset: function () {
      this.uploaded = false;
      this.id = null;
      this.url = '';
    }
  };
  public removeFiles: boolean = false;

  @ViewChild('msgWrapper') msgWrapper: ElementRef;
  @ViewChild('msgList') msgList: ElementRef;

  public ticketStatuses = [
    {
      id: 'open',
      text: 'Aperto'
    },
    {
      id: 'closed',
      text: 'Chiuso'
    }
  ];

  public ticketCategories: TicketCategory[];

  public orders: any[];
  public typeAheadOrders: EventEmitter<string> = new EventEmitter<string>();

  public users: any[];
  public typeAheadUsers: EventEmitter<string> = new EventEmitter<string>();

  public isCreate = false;

  constructor(
    private _apiService: ApiService,
    public ticketService: TicketService,
    private toastService: ToastsService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadCategories();
    this.file.reset();
    const data = this.route.snapshot.params;
    if (Object.entries(data).length > 0 && 'id' in data) {
      this.id = 'id' in data ? <number>data['id'] : null;
      if (!isNaN(this.id)) {
        this.loadTicket().then((res) => {
          this.ticket = new Ticket(
            { ...res.ticket, ...{ messages: res.messages } },
            this.userService.getUser().username
          );
          this.changeDetector.detectChanges(); // to update viewChilds
          this.doScroll();

          if (this.ticket.orderId) {
            this.loadOrdersSelect(this.ticket.orderId).then((orders) => {
              this.orders = orders;
            }).catch(() => {});
          }

          if (this.ticket.user) {
            this.loadUsersSelect(this.ticket.user.username).then((users) => {
              this.users = users;
            }).catch(() => {});
          }
        });
      } else {
        this.isCreate = true;
        this.ticket = new Ticket({},
          this.userService.getUser().username
        );
        this.typeListenerUsers();
      }
    }

    this.typeListenerOrders();
  }

  /* When type in select */
  private typeListenerOrders(): void {
    this.typeAheadOrders.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(tag => this.loadOrdersSelect(tag))
    ).subscribe(data => {
      // this._cd.markForCheck();
      this.orders = data;
    }, (err) => {
      console.log(err);
      this.orders = [];
    });
  }

  private loadOrdersSelect(search): Promise<any> {
    return this._apiService.get('tickets/select/orders', { search: search });
  }

  /* When type in select */
  private typeListenerUsers(): void {
    this.typeAheadUsers.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(tag => this.loadUsersSelect(tag))
    ).subscribe(data => {
      // this._cd.markForCheck();
      this.users = data;
    }, (err) => {
      console.log(err);
      this.users = [];
    });
  }

  private loadUsersSelect(search): Promise<any> {
    return this._apiService.get('users/search', { search: search });
  }

  private loadCategories(): void {
    this.ticketService.getCategories().then((res) => {
      this.ticketCategories = res;
    }).catch((err) => console.log(err));
  }
  get disableSend(): boolean {
    if (!this.file.uploaded) {
      return !this.newMessage || this.newMessage === '';
    } else {
      return false;
    }
  }

  get disableTextArea(): boolean {
    return this.showFileUpload || this.file.uploaded || (this.ticket && this.ticket.isClosed());
  }

  private loadTicket(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ticketService.getMyTicket(this.id, this.page).then((res) => {
        if (this.page === res.total_pages) {
          this.endReached = true;
        } else {
          this.page++;
        }
        const obj = res.ticket;
        obj.messages = res.messages;
        resolve(res);
      }).catch((err) => {
        console.error(err);
      });
    });
  }

  private doScroll(): void {
    const element = this.msgWrapper.nativeElement;
    const to = this.msgList.nativeElement.scrollHeight;
    this.smoothScrollTo(element, to, 1);
  }

  public toggleFileUpload(): void {
    this.showFileUpload = !this.showFileUpload;
  }

  public onFileUpload($event: any): void {
    console.log($event);
    this.file.uploaded = true;
    this.file.id = $event.id;
    this.file.url = $event.url;
  }

  public onMsgListScroll($event: any): void {
    const oldScrollHeight = $event.srcElement.scrollHeight;
    if ($event.srcElement.scrollTop === 0) {
      if (!this.endReached) {
        this.loadTicket().then((res) => {
          res.messages.forEach((message) => {
            this.ticket.messages.push(new TicketMessage(message, this.userService.getUser().username));
          });
          this.changeDetector.detectChanges(); // to update viewChilds
          const newScrollHeight = this.msgWrapper.nativeElement.scrollHeight;
          $event.srcElement.scrollTop = newScrollHeight - oldScrollHeight;
        });
      }
    }
  }

  public onFileCancel($event: any): void {
    this.file.reset();
    this.showFileUpload = false;
  }

  public onKeyDownTextArea($event: any): void {
    // if enter press
    if ($event.keyCode === 13) {
      $event.preventDefault();
      $event.stopPropagation();

      if (!this.disableSend) {
        this.sendMessage();
      }
    }
  }

  public sendMessage() {
    this.ticketService.sendMessage(this.ticket.id, this.newMessage, this.file.id).then((message: TicketMessage) => {
      this.ticket.messages.unshift(message);

      this.doScroll();

      this.removeFiles = true;
      this.newMessage = null;
      this.showFileUpload = false;
      this.file.reset();
    }).catch((err) => {
      console.log(err);
    });
  }

  public onEditableFieldsSubmit($event: any): void {
    const payload = {
      title: this.ticket.title,
      category_id: this.ticket.categoryId,
      status: this.ticket.status,
      order_id: this.ticket.orderId,
      user_id: this.ticket.user.id
    };

    console.log(payload);

    if (this.isCreate) {
      this.ticketService.createTicket(payload).then((res) => {
        // this.ticket.updateModel(res, this.userService.getUser().username);
        this.router.navigate(['pages/tickets/' + res.id]).finally(() => {
          this.toastService.success();
        });
      }).catch((err) => this.toastService.error());
    } else {
      this.ticketService.updateTicket(this.ticket.id, payload).then(() => {
        this.toastService.success();
      }).catch((err) => this.toastService.error());
    }
  }

  private smoothScrollTo(element: any, to: number, duration: number) {
    if (duration <= 0) {
      return;
    }

    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;

    setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) {
        return;
      }
      this.smoothScrollTo(element, to, (duration - 10));
    }, 10);
  }

}
