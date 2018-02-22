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
                title: 'ID',
                type: 'number'
            },
            name: {
                title: 'Full Name',
                type: 'string'
            },
            color: {
                title: 'Color',
                type: 'color'
            },
            link: {
                title: 'Link',
                type: 'url'
            },
            email: {
                title: 'Email',
                type: 'email'
            },
            image: {
                title: 'Image',
                type: 'image',
                filter: false
            },
            visible: {
                title: 'Visible',
                type: 'boolean',
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
            color: "black",
            email: "Sincere@april.biz",
            link: "www.value.com",
            image: "http://via.placeholder.com/350x150",
            visible: true
        },
        {
            id: 2,
            name: "Ervin Howell",
            color: "red",
            email: "Shanna@melissa.tv",
            link: "www.value.com",
            image: "http://via.placeholder.com/250/red/white",
            visible: false
        },
        {
            id: 3,
            name: "Ervin Howell",
            color: "green",
            email: "Shanna@melissa.tv",
            link: "https://www.value.com",
            visible: true
        },
        {
            id: 4,
            name: "Ervin Howell",
            color: "yellow",
            email: "Shanna@melissa.tv",
            link: "www.value.com",
            visible: false
        },
        {
            id: 5,
            name: "Ervin Howell",
            color: "grey",
            email: "Shanna@melissa.tv",
            link: "http://www.value.com",
            visible: false
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

    onRowSelect(event: any) {
        console.log('ON Select row(s)');
        console.log(event);
    }

}
