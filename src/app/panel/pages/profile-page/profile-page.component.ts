import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User, UserService} from '../../../auth/services/user.service';
import {Language, LanguageService} from '../../services/language.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePageComponent implements OnInit {

    params: any = {}; // Setup params
    user: User;

    private currentLang: Language;

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _userService: UserService,
                public _languageService: LanguageService) {
    }

    ngOnInit() {
        if (this._languageService.isMultiLang()) {
            this.currentLang = this._languageService.getCurrentLang();
        }

        this.user = this._userService.getUser();
        this.params = this._route.snapshot.data;
    }

    onLanguageChange(language: Language): void {
        this._languageService.setCurrentLang(language);
    }
}
