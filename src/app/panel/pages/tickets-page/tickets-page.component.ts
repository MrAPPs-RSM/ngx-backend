import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../auth/services/user.service';
import {Ticket} from '../../../models/ticket';
import {TicketService} from '../../../auth/services/ticket.service';
import {DataPaginatorComponent} from '../../components/data-paginator/data-paginator.component';


@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketsPageComponent implements OnInit {

  public itemClass = Ticket;

  @ViewChild('paginator') public paginator: DataPaginatorComponent;

  constructor(public ticketService: TicketService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  // -----------------------events handlers ------------------------------

  public onViewMessages(ticket: Ticket): void {
    this.router.navigate([ticket.id], {relativeTo: this.route}).finally(() => {
    });
  }

  public getLastMessageSender(lastMsg: any): string {
    if (lastMsg.sender === this.userService.getUser().username) {
      return 'Tu';
    } else {
      return lastMsg.sender;
    }
  }

}
