import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    public settings: any = {
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Full Name'
            },
            username: {
                title: 'User Name'
            },
            email: {
                title: 'Email'
            },
            visible: {
                title: 'Visible',
                filter: {
                    type: 'checkbox',
                    config: {
                        true: 'true',
                        false: 'false',
                        resetText: 'clear',
                    },
                },
            }
        },
        actions: {
            columnTitle: 'Actions',
            add: {
                content: 'Add new'
            },
            list: [
                {
                    name: 'edit',
                    content: 'Edit'
                },
                {
                    name: 'delete',
                    content: 'Delete'
                },
                {
                    name: 'custom',
                    content: 'Custom'
                }
            ]
        }
    };

    public data = [
        {
            id: 1,
            name: "Leanne Graham",
            username: "Bret",
            email: "Sincere@april.biz",
            visible: true
        },
        {
            id: 2,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 3,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 4,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 5,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 6,
            name: "Nicholas DuBuque",
            username: "Nicholas.Stanton",
            email: "Rey.Padberg@rosamond.biz",
            visible: true
        },
        {
            id: 1,
            name: "Leanne Graham",
            username: "Bret",
            email: "Sincere@april.biz",
            visible: true
        },
        {
            id: 2,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 3,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 4,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 5,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            visible: false
        },
        {
            id: 6,
            name: "Nicholas DuBuque",
            username: "Nicholas.Stanton",
            email: "Rey.Padberg@rosamond.biz",
            visible: true
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    onAction(event: any) {
        console.log('ON Action');
        console.log(event);
    }

    onCreate(event: any) {
        console.log('ON Create');
        console.log(event);
    }

}
