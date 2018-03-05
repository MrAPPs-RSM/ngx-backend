import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {User, UserService} from '../../../auth/services/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit, OnDestroy {

    private params: any = {}; // Setup params
    private user: User;

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _userService: UserService,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        this.user = this._userService.getUser();
        this.params = this._route.snapshot.data;
        this._pageTitle.set(this._route);
    }

    ngOnDestroy() {
        this._pageRefresh.setLastPath(this._router.url);
    }
}
