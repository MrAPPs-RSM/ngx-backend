import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Ticket } from './models/ticket';
import { TicketService } from './services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { TicketMessage } from './models/ticket-message';
import { UserService } from '../../../auth/services/user.service';
import { TicketCategory } from './models/ticket-category';

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

  /* to edit ticket fields */
  public editableTicketFields: {
    title: string;
    status: string;
    category: string;
  } = {
      title: null,
      status: null,
      category: null
    };

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

  constructor(
    public ticketService: TicketService,
    private route: ActivatedRoute,
    private userService: UserService,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.ticketCategories = this.ticketService.getCategories();
    this.file.reset();
    const data = this.route.snapshot.params;
    if (Object.entries(data).length > 0 && 'id' in data) {
      this.id = 'id' in data ? <number>data['id'] : null;
      this.loadTicket().then((res) => {
        this.ticket = new Ticket(
          { ...res.ticket, ...{ messages: res.messages } },
          this.userService.getUser().username
        );
        this.changeDetector.detectChanges(); // to update viewChilds
        this.doScroll();


        /* load editable fields of the ticket */
        this.editableTicketFields.title = this.ticket.title;
        this.editableTicketFields.status = this.ticket.status;
        this.editableTicketFields.category = this.ticket.category;
      });
    }
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
    this.ticketService.updateTicket(this.ticket.id, this.editableTicketFields);
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
