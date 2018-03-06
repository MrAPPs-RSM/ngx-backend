import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {User, UserService} from '../../../auth/services/user.service';
import {Language, LanguageService} from '../../services/language.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit, OnDestroy {

    private params: any = {}; // Setup params
    private user: User;

    private currentLang: Language;

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _userService: UserService,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService,
                public _languageService: LanguageService) {
    }

    ngOnInit() {
        this.currentLang = this._languageService.getCurrentLang();

        this.user = this._userService.getUser();
        this.params = this._route.snapshot.data;
        this._pageTitle.set(this._route);
    }

    onLanguageChange(language: Language): void {
        this._languageService.setCurrentLang(language);
    }

    ngOnDestroy() {
        this._pageRefresh.setLastPath(this._router.url);
    }
}
