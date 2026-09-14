import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface ToastNotificationData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-toast-notification',
    standalone: false,
    templateUrl: './toast-notification.component.html',
    styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent {

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: ToastNotificationData,
        private readonly _snackBarRef: MatSnackBarRef<ToastNotificationComponent>
    ) {
    }

    public dismiss(): void {
        this._snackBarRef.dismiss();
    }
}
