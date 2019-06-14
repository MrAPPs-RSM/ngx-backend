import { from as observableFrom, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { TablePageComponent } from '../pages/table-page/table-page.component';
import { FormPageComponent } from '../pages/form-page/form-page.component';
import { ProfilePageComponent } from '../pages/profile-page/profile-page.component';
import { LanguageService } from './language.service';
import { MenuService } from './menu.service';
import { NotfoundPageComponent } from '../pages/notfound-page/notfound-page.component';

import { PendingChangesGuard } from '../../auth/guards/pending-changes.guard';
import { TicketDetailPageComponent } from '../pages/ticket-detail-page/ticket-detail-page.component';


const TYPES = {
  profile: ProfilePageComponent,
  dashboard: DashboardPageComponent,
  ticketDetail: TicketDetailPageComponent,
  table: TablePageComponent,
  form: FormPageComponent,
};

@Injectable()
export class SetupService {

  public _lastRouteLoading: Date;

  constructor(private _router: Router,
    private _menuService: MenuService,
    private _apiService: ApiService,
    private _languageService: LanguageService) {
  }

  public setup(): Observable<any> {
    console.log('CALLING SETUP');
    const promise = new Promise<any>((resolve, reject) => {

      if (this._lastRouteLoading == null || Date.now() - this._lastRouteLoading.getMilliseconds() < 10000) {
        // this._apiService.get(environment.api.setupEndpoint)
          // .then((data) => {
            const data = {
                    "contentLanguages": [
                        {
                            "id": 1,
                            "name": "English",
                            "isoCode": "en",
                            "isDefault": true
                        }
                    ],
                    "pages": [
                        {
                            "path": "profile",
                            "type": "profile",
                            "params": {
                                "menu": {
                                    "title": "Profile",
                                    "sidebar": false,
                                    "breadcrumbLevel": 1
                                }
                            }
                        },
                        {
                            "path": "tickets",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Tickets",
                                    "sidebar": true,
                                    "icon": "fa fa-ticket",
                                    "order": 0,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "tickets",
                                            "filter": "{\"order\":\"updated_at DESC\"}"
                                        },
                                        "noDataMessage": "No tickets",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": false,
                                            "list": [
                                                {
                                                    "name": "View",
                                                    "content": "<i class=\"fa fa-eye\"></i>",
                                                    "class": "info",
                                                    "config": {
                                                        "path": "tickets/:id"
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "user.username": {
                                                "title": "User",
                                                "type": "string",
                                                "filter": false
                                            },
                                            "title": {
                                                "title": "Title",
                                                "type": "string",
                                                "filter": false
                                            },
                                            "last_message.message": {
                                                "title": "Last message",
                                                "type": "string",
                                                "filter": false
                                            },
                                            "category": {
                                                "title": "Category",
                                                "type": "string",
                                                "filter": false
                                            },
                                            "updated_at": {
                                                "title": "Last update",
                                                "type": "date",
                                                "filter": false
                                            },
                                            "status": {
                                                "title": "Status",
                                                "type": "string",
                                                "filter": false
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "tickets/:id",
                            "type": "ticketDetail",
                            "params": {
                                "menu": {
                                    "title": "Ticket Detail",
                                    "sidebar": false,
                                    "breadcrumbLevel": 2
                                }
                            }
                        },
                        {
                            "path": "products",
                            "type": "table",
                            "params": {
                                "isHomePage": true,
                                "menu": {
                                    "title": "Products",
                                    "sidebar": true,
                                    "icon": "fa fa-apple",
                                    "order": 1,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "products",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No products",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "products/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "products/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Attachments",
                                                    "content": "<i class=\"fa fa-paperclip\"></i>",
                                                    "class": "info",
                                                    "config": {
                                                        "path": "products/attachments/list/:title",
                                                        "titleField": "name",
                                                        "params": {
                                                            "type": "tableParameters",
                                                            "filter": "{\"order\":\"id ASC\",\"where\":{\"product_id\":\":id\"}}"
                                                        }
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "products/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "name": {
                                                "title": "Name",
                                                "type": "string"
                                            },
                                            "cost": {
                                                "title": "Cost",
                                                "type": "number"
                                            },
                                            "category.name": {
                                                "title": "Category",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New product",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "products"
                                        },
                                        "submit": {
                                            "redirectAfter": "products"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "key": "category_id",
                                                    "label": "Category",
                                                    "lang": false,
                                                    "placeholder": "No category selected",
                                                    "options": "product-categories/select/options",
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "name",
                                                    "type": "text",
                                                    "label": "Name",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "cover_id",
                                                    "type": "file",
                                                    "label": "Cover",
                                                    "options": {
                                                        "api": {
                                                            "upload": "uploads"
                                                        },
                                                        "allowedContentTypes": [
                                                            ".png",
                                                            ".jpg",
                                                            ".jpeg",
                                                            ".gif"
                                                        ]
                                                    },
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "cost",
                                                    "type": "number",
                                                    "label": "Cost",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "real_cost",
                                                    "type": "number",
                                                    "label": "Real Cost",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "shipping_fees",
                                                    "type": "number",
                                                    "label": "Shipping Fees",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "limited_days",
                                                    "type": "number",
                                                    "label": "Winning Limits",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "free_bids",
                                                    "type": "number",
                                                    "label": "Free Bids",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "products"
                                        },
                                        "submit": {
                                            "label": "Save",
                                            "redirectAfter": "products"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "key": "category_id",
                                                    "label": "Category",
                                                    "lang": false,
                                                    "placeholder": "No category selected",
                                                    "options": "product-categories/select/options",
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "name",
                                                    "type": "text",
                                                    "label": "Name",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "cover_id",
                                                    "type": "file",
                                                    "label": "Cover",
                                                    "options": {
                                                        "api": {
                                                            "upload": "uploads"
                                                        },
                                                        "allowedContentTypes": [
                                                            ".png",
                                                            ".jpg",
                                                            ".jpeg",
                                                            ".gif"
                                                        ]
                                                    },
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "cost",
                                                    "type": "number",
                                                    "label": "Cost",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "real_cost",
                                                    "type": "number",
                                                    "label": "Real Cost",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "shipping_fees",
                                                    "type": "number",
                                                    "label": "Shipping Fees",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "limited_days",
                                                    "type": "number",
                                                    "label": "Winning Limits",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "free_bids",
                                                    "type": "number",
                                                    "label": "Free Bids",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products_categories",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Product categories",
                                    "sidebar": true,
                                    "icon": "fa fa-tags",
                                    "order": 1,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "product-categories",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No product categories",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "products_categories/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "products_categories/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "product-categories/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "name": {
                                                "title": "Name",
                                                "type": "string"
                                            },
                                            "icon": {
                                                "title": "Icon",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products_categories/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New product category",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "product-categories"
                                        },
                                        "submit": {
                                            "redirectAfter": "products_categories"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "name",
                                                    "type": "text",
                                                    "label": "Name",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "icon",
                                                    "type": "text",
                                                    "label": "Icon",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products_categories/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "product-categories"
                                        },
                                        "submit": {
                                            "redirectAfter": "products_categories"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "name",
                                                    "type": "text",
                                                    "label": "Name",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "icon",
                                                    "type": "text",
                                                    "label": "Icon",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products/attachments/list/:title",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Attachments",
                                    "sidebar": false,
                                    "breadcrumbLevel": 2
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "product-attachments",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No attachments",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "products/attachments/create",
                                                    "params": {
                                                        "associateFields": [
                                                            {
                                                                "queryKey": "product_id",
                                                                "formKey": "product_id"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "product-attachments/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "content_type": {
                                                "title": "Content Type",
                                                "type": "string"
                                            },
                                            "picture": {
                                                "title": "Picture",
                                                "type": "image",
                                                "filter": false
                                            },
                                            "youtube": {
                                                "title": "Youtube",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 100
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "products/attachments/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New Attachment",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "product-attachments"
                                        },
                                        "submit": {
                                            "label": "Save",
                                            "redirectAfter": "products/attachments/list/:title"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "number",
                                                    "key": "product_id",
                                                    "hidden": true,
                                                    "label": ""
                                                },
                                                {
                                                    "type": "select",
                                                    "key": "content_type",
                                                    "label": "Content Type",
                                                    "lang": false,
                                                    "placeholder": "No content type selected",
                                                    "options": [
                                                        {"id": "image/jpeg", "text": "image/jpeg"},
                                                        {"id": "youtube", "text": "youtube"}
                                                    ],
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "attachment_id",
                                                    "type": "file",
                                                    "label": "Picture",
                                                    "options": {
                                                        "api": {
                                                            "upload": "uploads"
                                                        },
                                                        "allowedContentTypes": [
                                                            ".png",
                                                            ".jpg",
                                                            ".jpeg",
                                                            ".gif"
                                                        ]
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "youtube",
                                                    "type": "text",
                                                    "label": "Youtube",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "auctions",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Auctions",
                                    "sidebar": true,
                                    "icon": "fa fa-gavel",
                                    "order": 2,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "auctions",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No auctions",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "auctions/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "auctions/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "auctions/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "product.name": {
                                                "title": "Product",
                                                "type": "string"
                                            },
                                            "product.cost": {
                                                "title": "Product cost",
                                                "type": "number"
                                            },
                                            "product.real_cost": {
                                                "title": "Product Real cost",
                                                "type": "number"
                                            },
                                            "autobiddable": {
                                                "title": "Auto Biddable",
                                                "type": "boolean"
                                            },
                                            "starts_at": {
                                                "title": "Starts at",
                                                "type": "date"
                                            },
                                            "closed_at": {
                                                "title": "Closed at",
                                                "type": "date"
                                            },
                                            "default_timer": {
                                                "title": "Default timer",
                                                "type": "number"
                                            },
                                            "price": {
                                                "title": "Price",
                                                "type": "number"
                                            },
                                            "max_price_pct": {
                                                "title": "Max price pct.",
                                                "type": "number"
                                            },
                                            "status": {
                                                "title": "Status",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "auctions/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New auction",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "auctions"
                                        },
                                        "submit": {
                                            "redirectAfter": "auctions"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "key": "product_id",
                                                    "label": "Product",
                                                    "lang": false,
                                                    "placeholder": "No product selected",
                                                    "search": {
                                                        "endpoint": "products/select/options"
                                                    },
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "autobiddable",
                                                    "type": "checkbox",
                                                    "label": "Auto Biddable",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "starts_at",
                                                    "type": "date",
                                                    "label": "Starts at",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "default_timer",
                                                    "type": "number",
                                                    "label": "Default timer",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "max_price_pct",
                                                    "type": "number",
                                                    "label": "Max price pct.",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "price",
                                                    "type": "plain",
                                                    "label": "Price"
                                                },
                                                {
                                                    "key": "closed_at",
                                                    "type": "plain",
                                                    "label": "Closed at"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "auctions/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "auctions"
                                        },
                                        "submit": {
                                            "label": "Save",
                                            "redirectAfter": "auctions"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "key": "product_id",
                                                    "label": "Product",
                                                    "lang": false,
                                                    "placeholder": "No product selected",
                                                    "search": {
                                                        "endpoint": "products/select/options"
                                                    },
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "autobiddable",
                                                    "type": "checkbox",
                                                    "label": "Auto Biddable",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },

                                                {
                                                    "key": "starts_at",
                                                    "type": "date",
                                                    "label": "Starts at",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "default_timer",
                                                    "type": "number",
                                                    "label": "Default timer",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "max_price_pct",
                                                    "type": "number",
                                                    "label": "Max price pct.",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "price",
                                                    "type": "plain",
                                                    "label": "Price"
                                                },
                                                {
                                                    "key": "closed_at",
                                                    "type": "plain",
                                                    "label": "Closed at"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "offers/packages/list/:title",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "sidebar": false,
                                    "breadcrumbLevel": 2
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "bid-packages",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No packages",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "offers/packages/create",
                                                    "params": {
                                                        "associateFields": [
                                                            {
                                                                "queryKey": "offer_id",
                                                                "formKey": "offer_id"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "offers/packages/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "bid-packages/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "title": {
                                                "title": "Title",
                                                "type": "string"
                                            },
                                            "desc": {
                                                "title": "Description",
                                                "type": "string"
                                            },
                                            "amount": {
                                                "title": "Amount",
                                                "type": "number"
                                            },
                                            "featured": {
                                                "title": "Featured",
                                                "type": "boolean"
                                            },
                                            "price": {
                                                "title": "Price",
                                                "type": "number"
                                            },
                                            "price_per_bid": {
                                                "title": "Price per bid",
                                                "type": "number"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "offers/packages/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New package",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "bid-packages"
                                        },
                                        "submit": {
                                            "redirectAfter": "offers/packages/list/:title"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "number",
                                                    "key": "offer_id",
                                                    "hidden": true,
                                                    "label": ""
                                                },
                                                {
                                                    "key": "title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "amount",
                                                    "type": "number",
                                                    "label": "Amount",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "featured",
                                                    "type": "checkbox",
                                                    "label": "Featured",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "price",
                                                    "type": "number",
                                                    "label": "Price",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "price_per_bid",
                                                    "type": "number",
                                                    "label": "Price per bid",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "offers/packages/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "bid-packages"
                                        },
                                        "submit": {
                                            "redirectAfter": "offers/packages/list/:title"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "amount",
                                                    "type": "number",
                                                    "label": "Amount",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "featured",
                                                    "type": "checkbox",
                                                    "label": "Featured",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "price",
                                                    "type": "number",
                                                    "label": "Price",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "price_per_bid",
                                                    "type": "number",
                                                    "label": "Price per bid",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "offers",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Offers",
                                    "sidebar": true,
                                    "icon": "fa fa-archive",
                                    "order": 4,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "offers",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No offers",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "offers/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "offers/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Packages",
                                                    "content": "<i class=\"fa fa-archive\"></i>",
                                                    "class": "info",
                                                    "config": {
                                                        "path": "offers/packages/list/:title",
                                                        "titleField": "title",
                                                        "params": {
                                                            "type": "tableParameters",
                                                            "filter": "{\"order\":\"id ASC\",\"where\":{\"offer_id\":\":id\"}}"
                                                        }
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "offers/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "title": {
                                                "title": "Title",
                                                "type": "string"
                                            },
                                            "subtitle": {
                                                "title": "Subtitle",
                                                "type": "number"
                                            },
                                            "valid_from": {
                                                "title": "Valid from",
                                                "type": "date"
                                            },
                                            "valid_until": {
                                                "title": "Valid until",
                                                "type": "date"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "offers/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New offer",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "offers"
                                        },
                                        "submit": {
                                            "redirectAfter": "offers"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "subtitle",
                                                    "type": "text",
                                                    "label": "Subtitle",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "valid_from",
                                                    "type": "date",
                                                    "label": "Valid from",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "valid_until",
                                                    "type": "date",
                                                    "label": "Valid until",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "offers/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "offers"
                                        },
                                        "submit": {
                                            "redirectAfter": "offers"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "subtitle",
                                                    "type": "text",
                                                    "label": "Subtitle",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "valid_from",
                                                    "type": "date",
                                                    "label": "Valid from",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "valid_until",
                                                    "type": "date",
                                                    "label": "Valid until",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "users",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Users",
                                    "sidebar": true,
                                    "icon": "fa fa-user",
                                    "order": 4,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "users",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No users",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "users/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "users/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Credits History",
                                                    "content": "<i class=\"fa fa-clock-o\"></i>",
                                                    "bgColor": "pink",
                                                    "config": {
                                                        "path": "users/credits-history/:title",
                                                        "titleField": "username",
                                                        "params": {
                                                            "type": "tableParameters",
                                                            "filter": "{\"where\":{\"user_id\":\":id\"}}"
                                                        }
                                                    }
                                                },
                                                {
                                                    "name": "Orders",
                                                    "content": "<i class=\"fa fa-shopping-cart\"></i>",
                                                    "class": "info",
                                                    "config": {
                                                        "path": "orders",
                                                        "params": {
                                                            "type": "tableParameters",
                                                            "filter": "{\"where\":{\"user_id\":\":id\"}}"
                                                        }
                                                    }
                                                },
                                                {
                                                    "name": "Testimonials",
                                                    "content": "<i class=\"fa fa-diamond\"></i>",
                                                    "bgColor": "orange",
                                                    "config": {
                                                        "path": "testimonials",
                                                        "params": {
                                                            "type": "tableParameters",
                                                            "filter": "{\"where\":{\"user_id\":\":id\"}}"
                                                        }
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "users/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "admin": {
                                                "title": "Admin",
                                                "type": "boolean"
                                            },
                                            "username": {
                                                "title": "Username",
                                                "type": "string"
                                            },
                                            "email": {
                                                "title": "E-mail",
                                                "type": "string"
                                            },
                                            "first_name": {
                                                "title": "First name",
                                                "type": "string"
                                            },
                                            "last_name": {
                                                "title": "Last name",
                                                "type": "string"
                                            },
                                            "phone": {
                                                "title": "Phone",
                                                "type": "string"
                                            },
                                            "referral_code": {
                                                "title": "Referral code",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "users/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New user",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "bid-packages"
                                        },
                                        "submit": {
                                            "redirectAfter": "packages"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "admin",
                                                    "type": "checkbox",
                                                    "label": "Admin",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "username",
                                                    "type": "text",
                                                    "label": "Username",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "email",
                                                    "type": "email",
                                                    "label": "E-mail",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "first_name",
                                                    "type": "text",
                                                    "label": "First name",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "last_name",
                                                    "type": "text",
                                                    "label": "Last name",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "street",
                                                    "type": "text",
                                                    "label": "Street",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "zip_code",
                                                    "type": "text",
                                                    "label": "Zip code",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "city",
                                                    "type": "text",
                                                    "label": "City",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "district",
                                                    "type": "text",
                                                    "label": "District",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "phone",
                                                    "type": "text",
                                                    "label": "Phone",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "referral_code",
                                                    "type": "text",
                                                    "label": "Referral code",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "balance",
                                                    "type": "number",
                                                    "label": "Balance",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "users/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "users"
                                        },
                                        "submit": {
                                            "redirectAfter": "users"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "admin",
                                                    "type": "checkbox",
                                                    "label": "Admin",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "username",
                                                    "type": "text",
                                                    "label": "Username",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "email",
                                                    "type": "email",
                                                    "label": "E-mail",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "first_name",
                                                    "type": "text",
                                                    "label": "First name",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "last_name",
                                                    "type": "text",
                                                    "label": "Last name",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "street",
                                                    "type": "text",
                                                    "label": "Street",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "zip_code",
                                                    "type": "text",
                                                    "label": "Zip code",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "city",
                                                    "type": "text",
                                                    "label": "City",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "district",
                                                    "type": "text",
                                                    "label": "District",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "phone",
                                                    "type": "text",
                                                    "label": "Phone",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "referral_code",
                                                    "type": "text",
                                                    "label": "Referral code",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "balance",
                                                    "type": "number",
                                                    "label": "Balance",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "users/credits-history/:title",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "sidebar": false,
                                    "icon": "fa fa-clock-o",
                                    "breadcrumbLevel": 3
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "credit-history",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No credits",
                                        "columns": {
                                            "inserted_at": {
                                                "title": "Inserted at",
                                                "type": "date"
                                            },
                                            "amount": {
                                                "title": "Amount",
                                                "filter": false,
                                                "type": "number"
                                            },
                                            "message": {
                                                "title": "Name",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "orders",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Orders",
                                    "sidebar": true,
                                    "icon": "fa fa-shopping-cart",
                                    "order": 5,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "orders",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No orders",
                                        "generalActions": [
                                            {
                                                "name": "Report",
                                                "content": "Report <i class=\"fa fa-download\"><\/i> ",
                                                "class": "success",
                                                "config": {
                                                    "endpoint": "orders/report",
                                                    "addFilters": false,
                                                    "method": "get",
                                                    "responseType": "file_download",
                                                    "forceDownload": true,
                                                    "refreshAfter": false
                                                }
                                            }
                                        ],
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": null,
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "orders/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Generate receipt",
                                                    "content": "<i class=\"fa fa-file-text\"></i>",
                                                    "class": "info",
                                                    "config": {
                                                        "endpoint": "orders/:id/receipt",
                                                        "method": "post",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "receipt": {
                                                "title": "Receipt",
                                                "type": "string"
                                            },
                                            "payment_method": {
                                                "title": "Payment method",
                                                "type": "string"
                                            },
                                            "status": {
                                                "title": "Status",
                                                "type": "string"
                                            },
                                            "product_name": {
                                                "title": "Product name",
                                                "type": "string"
                                            },
                                            "total": {
                                                "title": "Total",
                                                "type": "number"
                                            },
                                            "inserted_at": {
                                                "title": "Inserted at",
                                                "type": "date"
                                            },
                                            "user.username": {
                                                "title": "User",
                                                "type": "string",
                                                "filter": false
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "orders/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "orders"
                                        },
                                        "submit": {
                                            "redirectAfter": "orders"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "class": "col-sm-6",
                                                    "key": "status",
                                                    "label": "Status",
                                                    "lang": false,
                                                    "placeholder": "No status selected",
                                                    "options": [
                                                        {"id": "pending", "text": "pending"},
                                                        {"id": "shipped", "text": "shipped"},
                                                        {"id": "delivered", "text": "delivered"}
                                                    ],
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "download_url",
                                                    "class": "col-sm-6",
                                                    "type": "text",
                                                    "label": "Download url",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "courier",
                                                    "class": "col-sm-6",
                                                    "type": "text",
                                                    "label": "Courier",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "tracking_url",
                                                    "class": "col-sm-6",
                                                    "type": "text",
                                                    "label": "Tracking url",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "receipt",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Receipt"
                                                },
                                                {
                                                    "key": "payment_method",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Payment method"
                                                },
                                                {
                                                    "key": "product_name",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Product name"
                                                },
                                                {
                                                    "key": "product_price",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Product price"
                                                },
                                                {
                                                    "key": "product_taxes",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Product taxes"
                                                },
                                                {
                                                    "key": "shipping_fees",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Shipping fees"
                                                },
                                                {
                                                    "key": "shipping_taxes",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Shipping taxes"
                                                },
                                                {
                                                    "key": "total_no_taxes",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Total no taxes"
                                                },
                                                {
                                                    "key": "total_taxes",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Total taxes"
                                                },
                                                {
                                                    "key": "total",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Total"
                                                },
                                                {
                                                    "key": "transaction_id",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Transaction id"
                                                },
                                                {
                                                    "key": "inserted_at",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Inserted at"
                                                },
                                                {
                                                    "key": "updated_at",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "Updated at"
                                                },
                                                {
                                                    "key": "user",
                                                    "class": "col-sm-4",
                                                    "type": "plain",
                                                    "label": "User"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "promotions",
                            "type": "table",
                            "params": {
                                "isHomePage": true,
                                "menu": {
                                    "title": "Promotions",
                                    "sidebar": true,
                                    "icon": "fa fa-line-chart",
                                    "order": 6,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "promotions",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No promotions",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "promotions/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "promotions/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "promotions/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "code": {
                                                "title": "Code",
                                                "type": "string"
                                            },
                                            "free_bids": {
                                                "title": "Free Bids",
                                                "type": "number"
                                            },
                                            "expires_at": {
                                                "title": "Expires at",
                                                "type": "date"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 100
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "promotions/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New promotion",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "promotions"
                                        },
                                        "submit": {
                                            "redirectAfter": "promotions"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "code",
                                                    "type": "text",
                                                    "label": "Code",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "free_bids",
                                                    "type": "number",
                                                    "label": "Free Bids",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "expires_at",
                                                    "type": "date",
                                                    "label": "Expires at",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "promotions/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "promotions"
                                        },
                                        "submit": {
                                            "redirectAfter": "promotions"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "code",
                                                    "type": "text",
                                                    "label": "Code",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "free_bids",
                                                    "type": "number",
                                                    "label": "Free Bids",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "expires_at",
                                                    "type": "date",
                                                    "label": "Expires at",
                                                    "isDateTime": true,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "testimonials",
                            "type": "table",
                            "params": {
                                "isHomePage": true,
                                "menu": {
                                    "title": "Testimonials",
                                    "sidebar": true,
                                    "icon": "fa fa-diamond",
                                    "order": 7,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "testimonials",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No testimonials",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": null,
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "testimonials/edit/:id"
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "user.username": {
                                                "title": "User",
                                                "type": "string",
                                                "filter": false
                                            },
                                            "auction.product.name": {
                                                "title": "Product",
                                                "type": "string"
                                            },
                                            "picture_url": {
                                                "title": "Picture",
                                                "type": "image",
                                                "filter": false
                                            },
                                            "status": {
                                                "title": "Status",
                                                "type": "string"
                                            },
                                            "inserted_at": {
                                                "title": "Inserted at",
                                                "type": "date"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 100
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "testimonials/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "testimonials"
                                        },
                                        "submit": {
                                            "redirectAfter": "testimonials"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "plain",
                                                    "key": "picture_url",
                                                    "label": "Picture"
                                                },
                                                {
                                                    "type": "select",
                                                    "key": "status",
                                                    "label": "Status",
                                                    "lang": false,
                                                    "placeholder": "No status selected",
                                                    "options": "testimonials/statuses",
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "pages",
                            "type": "table",
                            "params": {
                                "isHomePage": true,
                                "menu": {
                                    "title": "CMS Pages",
                                    "sidebar": true,
                                    "icon": "fa fa-file-text",
                                    "order": 8,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "pages",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No CMS pages",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "pages/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "pages/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Sections",
                                                    "content": "<i class=\"fa fa-angle-right\"></i>",
                                                    "class": "info",
                                                    "config": {
                                                        "path": "pages/sections/list/:title",
                                                        "titleField": "seo_title",
                                                        "params": {
                                                            "type": "tableParameters",
                                                            "filter": "{\"where\":{\"page_id\":\":id\"}}"
                                                        }
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "pages/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "path": {
                                                "title": "Path",
                                                "type": "string"
                                            },
                                            "seo_title": {
                                                "title": "Title",
                                                "type": "string"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "pages/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New CMS page",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "pages"
                                        },
                                        "submit": {
                                            "redirectAfter": "pages"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "path",
                                                    "type": "text",
                                                    "label": "Path",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "seo_title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "seo_desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "pages/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "pages"
                                        },
                                        "submit": {
                                            "redirectAfter": "pages"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "path",
                                                    "type": "text",
                                                    "label": "Path",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "seo_title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "seo_desc",
                                                    "type": "textarea",
                                                    "label": "Description",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "pages/sections/list/:title",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Sections",
                                    "sidebar": false,
                                    "breadcrumbLevel": 2
                                },
                                "tables": [
                                    {
                                        "drag": true,
                                        "api": {
                                            "endpoint": "page-sections",
                                            "filter": "{\"order\":\"weight ASC\"}"
                                        },
                                        "noDataMessage": "No sections for this CMS page",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "pages/sections/create",
                                                    "params": {
                                                        "associateFields": [
                                                            {
                                                                "queryKey": "page_id",
                                                                "formKey": "page_id"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "pages/sections/edit/:id/:title",
                                                        "titleField": "title"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "page-sections/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number",
                                                "filter": false
                                            },
                                            "title": {
                                                "title": "Title",
                                                "type": "string",
                                                "filter": false
                                            },
                                            "type": {
                                                "title": "Type",
                                                "type": "string",
                                                "filter": false
                                            }
                                        },
                                        "pager": {
                                            "perPage": 100
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "pages/sections/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New Section",
                                    "breadcrumbLevel": 3,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "page-sections"
                                        },
                                        "submit": {
                                            "redirectAfter": "pages/sections/list/:title"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "number",
                                                    "key": "page_id",
                                                    "hidden": true,
                                                    "label": ""
                                                },
                                                {
                                                    "key": "title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "subtitle",
                                                    "type": "text",
                                                    "label": "Subtitle",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "type": "select",
                                                    "key": "type",
                                                    "label": "Type",
                                                    "lang": false,
                                                    "placeholder": "No type selected",
                                                    "options": [
                                                        {"id": "html", "text": "html"},
                                                        {"id": "accordion", "text": "accordion"}
                                                    ],
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "html",
                                                    "type": "textarea",
                                                    "label": "Content",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "visibleOn": {
                                                        "type": "html"
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "contents",
                                                    "type": "list_details",
                                                    "label": "Contents",
                                                    "visibleOn": {
                                                        "type": "accordion"
                                                    },
                                                    "unique": false,
                                                    "fields": [
                                                        {
                                                            "key": "title",
                                                            "type": "text",
                                                            "label": "Title",
                                                            "validators": {
                                                                "required": true
                                                            }
                                                        },
                                                        {
                                                            "key": "html",
                                                            "type": "textarea",
                                                            "label": "Content",
                                                            "options": {
                                                                "editor": true,
                                                                "allowContent": true
                                                            },
                                                            "validators": {
                                                                "required": true
                                                            }
                                                        },
                                                        {
                                                            "type": "number",
                                                            "key": "id",
                                                            "hidden": true,
                                                            "label": ""
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "pages/sections/edit/:id/:title",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 3,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "page-sections"
                                        },
                                        "submit": {
                                            "redirectAfter": "pages/sections/list/:title"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "title",
                                                    "type": "text",
                                                    "label": "Title",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "subtitle",
                                                    "type": "text",
                                                    "label": "Subtitle",
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "type": "select",
                                                    "key": "type",
                                                    "label": "Type",
                                                    "lang": false,
                                                    "placeholder": "No type selected",
                                                    "options": [
                                                        {"id": "html", "text": "html"},
                                                        {"id": "accordion", "text": "accordion"}
                                                    ],
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "html",
                                                    "type": "textarea",
                                                    "label": "Content",
                                                    "options": {
                                                        "editor": true,
                                                        "allowContent": true
                                                    },
                                                    "visibleOn": {
                                                        "type": "html"
                                                    },
                                                    "validators": {
                                                        "required": false
                                                    }
                                                },
                                                {
                                                    "key": "contents",
                                                    "type": "list_details",
                                                    "label": "Contents",
                                                    "visibleOn": {
                                                        "type": "accordion"
                                                    },
                                                    "unique": false,
                                                    "fields": [
                                                        {
                                                            "key": "title",
                                                            "type": "text",
                                                            "label": "Title",
                                                            "validators": {
                                                                "required": true
                                                            }
                                                        },
                                                        {
                                                            "key": "html",
                                                            "type": "textarea",
                                                            "label": "Content",
                                                            "options": {
                                                                "editor": true,
                                                                "allowContent": true
                                                            },
                                                            "validators": {
                                                                "required": true
                                                            }
                                                        },
                                                        {
                                                            "type": "number",
                                                            "key": "id",
                                                            "hidden": true,
                                                            "label": ""
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "queued_auctions",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Queued Auctions",
                                    "sidebar": true,
                                    "icon": "fa fa-gavel",
                                    "order": 9,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "api": {
                                            "endpoint": "queued-auctions",
                                            "filter": "{\"order\":\"id DESC\"}"
                                        },
                                        "noDataMessage": "No queued auctions",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "queued_auctions/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "queued_auctions/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "queued-auctions/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number"
                                            },
                                            "product.name": {
                                                "title": "Product",
                                                "type": "string"
                                            },
                                            "product.cost": {
                                                "title": "Product cost",
                                                "type": "number"
                                            },
                                            "autobiddable": {
                                                "title": "Auto Biddable",
                                                "type": "boolean"
                                            },
                                            "default_timer": {
                                                "title": "Default timer",
                                                "type": "number"
                                            },
                                            "max_price_pct": {
                                                "title": "Max price pct.",
                                                "type": "number"
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "queued_auctions/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New queued auction",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "queued-auctions"
                                        },
                                        "submit": {
                                            "redirectAfter": "queued_auctions"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "key": "product_id",
                                                    "label": "Product",
                                                    "lang": false,
                                                    "placeholder": "No product selected",
                                                    "search": {
                                                        "endpoint": "products/select/options"
                                                    },
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "autobiddable",
                                                    "type": "checkbox",
                                                    "label": "Auto Biddable",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "default_timer",
                                                    "type": "number",
                                                    "label": "Default timer",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "max_price_pct",
                                                    "type": "number",
                                                    "label": "Max price pct.",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "queued_auctions/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "queued-auctions"
                                        },
                                        "submit": {
                                            "label": "Save",
                                            "redirectAfter": "queued_auctions"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "type": "select",
                                                    "key": "product_id",
                                                    "label": "Product",
                                                    "lang": false,
                                                    "placeholder": "No product selected",
                                                    "search": {
                                                        "endpoint": "products/select/options"
                                                    },
                                                    "multiple": false,
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "autobiddable",
                                                    "type": "checkbox",
                                                    "label": "Auto Biddable",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "default_timer",
                                                    "type": "number",
                                                    "label": "Default timer",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "max_price_pct",
                                                    "type": "number",
                                                    "label": "Max price pct.",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "slide_show",
                            "type": "table",
                            "params": {
                                "menu": {
                                    "title": "Slideshow",
                                    "sidebar": true,
                                    "icon": "fa fa-television",
                                    "order": 10,
                                    "breadcrumbLevel": 1
                                },
                                "tables": [
                                    {
                                        "drag": true,
                                        "api": {
                                            "endpoint": "slide-show",
                                            "filter": "{\"order\":\"weight ASC\"}"
                                        },
                                        "noDataMessage": "No slideshows",
                                        "actions": {
                                            "columnTitle": "Actions",
                                            "add": {
                                                "name": "Add",
                                                "content": "<i class=\"fa fa-plus\"></i>",
                                                "class": "success",
                                                "config": {
                                                    "path": "slide_show/create"
                                                }
                                            },
                                            "list": [
                                                {
                                                    "name": "Edit",
                                                    "content": "<i class=\"fa fa-edit\"></i>",
                                                    "class": "warning",
                                                    "config": {
                                                        "path": "slide_show/edit/:id"
                                                    }
                                                },
                                                {
                                                    "name": "Delete",
                                                    "content": "<i class=\"fa fa-trash\"></i>",
                                                    "class": "danger",
                                                    "config": {
                                                        "endpoint": "slide-show/:id",
                                                        "method": "delete",
                                                        "confirm": true
                                                    }
                                                }
                                            ]
                                        },
                                        "columns": {
                                            "id": {
                                                "title": "ID",
                                                "type": "number",
                                                "filter": false
                                            },
                                            "picture_id.url": {
                                                "title": "Picture",
                                                "type": "image",
                                                "filter": false
                                            },
                                            "link_url": {
                                                "title": "Link",
                                                "type": "string",
                                                "filter": false
                                            }
                                        },
                                        "pager": {
                                            "perPage": 20
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "slide_show/create",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "New Slideshow",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "api": {
                                            "endpoint": "slide-show"
                                        },
                                        "submit": {
                                            "redirectAfter": "slide_show"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "picture_id",
                                                    "type": "file",
                                                    "label": "Picture",
                                                    "options": {
                                                        "api": {
                                                            "upload": "uploads"
                                                        },
                                                        "allowedContentTypes": [
                                                            ".png",
                                                            ".jpg",
                                                            ".jpeg",
                                                            ".gif"
                                                        ]
                                                    },
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "link_url",
                                                    "type": "text",
                                                    "label": "Link",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "path": "slide_show/edit/:id",
                            "type": "form",
                            "params": {
                                "menu": {
                                    "title": "",
                                    "breadcrumbLevel": 2,
                                    "sidebar": false
                                },
                                "forms": [
                                    {
                                        "isEdit": true,
                                        "api": {
                                            "endpoint": "slide-show"
                                        },
                                        "submit": {
                                            "label": "Save",
                                            "redirectAfter": "slide_show"
                                        },
                                        "fields": {
                                            "base": [
                                                {
                                                    "key": "picture_id",
                                                    "type": "file",
                                                    "label": "Picture",
                                                    "options": {
                                                        "api": {
                                                            "upload": "uploads"
                                                        },
                                                        "allowedContentTypes": [
                                                            ".png",
                                                            ".jpg",
                                                            ".jpeg",
                                                            ".gif"
                                                        ]
                                                    },
                                                    "validators": {
                                                        "required": true
                                                    }
                                                },
                                                {
                                                    "key": "link_url",
                                                    "type": "text",
                                                    "label": "Link",
                                                    "validators": {
                                                        "required": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                };
            
            console.log('SETUP OK');
            this._lastRouteLoading = new Date();

            if ('contentLanguages' in data) {
              this._languageService.setContentLanguages(data['contentLanguages']);
            }

            console.log('Before calling loadRoutes');
            this.loadRoutes(data);
            console.log('Before calling prepareMenu');
            this._menuService.prepareMenu(data);
            console.log('Before calling resolve()');
            resolve();
         /* })
          .catch((error) => {
            console.log('SETUP KO');
            this._lastRouteLoading = null;
            reject();
          }); */
      } else {
        // console.log("SALTO CARICAMENTO ROTTE...");
        resolve();
      }
    });

    return observableFrom(promise);
  }

  private remapRoutesData(data: any): Array<any> {
    let routes = [];

    if ('pages' in data) {
      routes = routes.concat(this.remapRoutesData(data.pages));
    } else {
      for (const item of data) {
        if ('children' in item) {
          routes = routes.concat(this.remapRoutesData(item.children));
        } else {
          routes.push(item);
        }
      }
    }
    return routes;
  }

  private loadRoutes(data: any): void {

    const routerConfig = this._router.config;

    const routes = [{ path: '404', component: NotfoundPageComponent }];

    for (const item of this.remapRoutesData(data)) {
      if (item.type in TYPES) {
        const route = {
          path: item.path,
          component: TYPES[item.type],
          data: item.params
        };

        if (item.type === 'form') {
          route['canDeactivate'] = [PendingChangesGuard];
        }

        routes.push(route);
      }
    }

    if (environment.domains) {
      routerConfig[0].children[0].children = routes;
    } else {
      routerConfig[0].children = routes;
    }

    this._router.resetConfig(routerConfig);
  }

}
