# ngxBackend API
==============================

## Init

### Login (POST)

##### URL

Nota: la rotta è configurabile nel file di configurazione di ngxBackend.

```
POST /api/login
```

##### Richiesta

```json
{
   "username": "pippo",
   "password": "pippo",
   "remember": true
}
```

##### Risposta 200 OK

```json
{
   "id": "<my_access_token>",
   "userId": 1,
   "user": {
      "username": "pippo",
      "email": "pippo@gmail.com"
   }
}
```

Il campo **id** nella risposta conterrà l'Access Token necessario per utilizzare le chiamate autenticate.

ngxBackend passerà questo valore ad ogni chiamata nel campo **access_token** (sempre in querystring).

Esempio:

```
GET /api/products ? access_token = xcZaWOL...
```

--

### Setup (GET)

##### URL

Nota: la rotta è configurabile nel file di configurazione di ngxBackend.

```
GET /api/setup
```

Questa chiamata restituisce l'intera configurazione delle pagine del pannello.

Fare riferimento al seguente URL per la struttura:

<https://github.com/MrAPPs-RSM/ngx-backend/wiki/pages>

##### Esempio di configurazione di base

```json
{
  "contentLanguages": [
    {
      "id": 1,
      "name": "Italiano",
      "isoCode": "it",
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
      "path": "products/list",
      "type": "table",
      "params": {
        "isHomePage": true,
        "menu": {
          "title": "Prodotti",
          "sidebar": true,
          "icon": "fa fa-apple",
          "order": 1,
          "breadcrumbLevel": 1
        },
        "tables": [
          {
            "api": {
              "endpoint": "products",
              "filter": "{\"where\":{\"category\":\"product\"}}"
            },
            "noDataMessage": "Nessun prodotto trovato",
            "actions": {
              "columnTitle": "Azioni",
              "add": {
                "name": "Aggiungi",
                "content": "<i class=\"fa fa-plus\"></i>",
                "class": "success",
                "config": {
                  "path": "products/create"
                }
              },
              "list": [
                {
                  "name": "Modifica",
                  "content": "<i class=\"fa fa-edit\"></i>",
                  "class": "warning",
                  "config": {
                    "path": "products/edit/:id/:title",
                    "titleField": "name"
                  }
                },
                {
                  "name": "Elimina",
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
                "title": "Nome",
                "type": "string"
              },
              "image_url": {
                "title": "Immagine",
                "type": "image",
                "filter": false
              },
              "cost": {
                "title": "Prezzo",
                "type": "number"
              },
              "category": {
                "title": "Categoria",
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
          "title": "Nuovo prodotto",
          "breadcrumbLevel": 2,
          "sidebar": false
        },
        "forms": [
          {
            "api": {
              "endpoint": "products"
            },
            "submit": {
              "confirm": false,
              "redirectAfter": "products/list"
            },
            "fields": {
              "base": [
                {
                  "key": "name",
                  "type": "text",
                  "label": "Nome",
                  "validators": {
                    "required": true
                  }
                },
                {
                  "key": "image_id",
                  "type": "file",
                  "label": "Immagine",
                  "options": {
                    "api": {
                      "upload": "images/upload"
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
                  "label": "Prezzo",
                  "validators": {
                    "required": true
                  }
                },
                {
                  "key": "desc",
                  "type": "textarea",
                  "label": "Descrizione",
                  "options": {
                    "editor": false
                  },
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
      "path": "products/edit/:id/:title",
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
              "label": "Salva",
              "confirm": false,
              "redirectAfter": "products/list"
            },
            "fields": {
              "base": [
                {
                  "key": "name",
                  "type": "text",
                  "label": "Nome",
                  "validators": {
                    "required": true
                  }
                },
                {
                  "key": "image_id",
                  "type": "file",
                  "label": "Immagine",
                  "options": {
                    "api": {
                      "upload": "images/upload"
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
                  "label": "Prezzo",
                  "validators": {
                    "required": true
                  }
                },
                {
                  "key": "desc",
                  "type": "textarea",
                  "label": "Descrizione",
                  "options": {
                    "editor": false
                  },
                  "validators": {
                    "required": false
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}
```

## Tabella

### List (GET)

Elenco di entità da mostrare in tabella (paginata).

La rotta è configurabile nella chiamata **setup** per ogni entity.

##### URL

```
GET /api/<entity>
```

##### Esempio di URL

```
GET /api/products
```

##### Richiesta

```json
{
   "where": {
      "and": [
         {
            "name": {
               "like": "%penna%"
            }
         },
         {
            "inserted_at": {
               "between": [
                  "2019-01-11T23:00:00.000Z",
                  "2019-01-21T23:00:00.000Z"
               ]
            }
         },
         {
            "enabled": true
         }
      ]
   },
   "order": "id ASC",
   "skip": 0,
   "limit": 10
}
```

##### Risposta 200 OK

```json
[
   {
      "id": 1,
      "name": "Penna Bic",
      "image_url": "https://www.retif.it/media/image/400x/penna-bic-cristal-blu-pack-da-50_01.jpg",
      "cost": 1,
      "category": "product"
   },
   {
      "id": 2,
      "name": "Temperamatite",
      "image_url": "https://www.retif.it/media/image/400x/penna-bic-cristal-blu-pack-da-50_01.jpg",
      "cost": 1.6,
      "category": "product"
   }
]
```

--

### Count (GET)

Conteggio totale delle entità da mostrare in tabella, necessario per il paginatore.

La rotta deve corrispondere alla rotta **list** corrispondente, aggiungendo il suffisso **/count**.

##### URL

```
GET /api/<entity>/count
```

##### Esempio di URL

```
GET /api/products/count
```

##### Richiesta

Il body di richiesta della chiamata **count** è lo stesso della chiamata **list**, ad esclusione dei parametri _order_, _skip_ e _limit_.

```json
{
   "where": {
      "and": [
         {
            "name": {
               "like": "%penna%"
            }
         },
         {
            "inserted_at": {
               "between": [
                  "2019-01-11T23:00:00.000Z",
                  "2019-01-21T23:00:00.000Z"
               ]
            }
         },
         {
            "enabled": true
         }
      ]
   }
}
```

##### Risposta 200 OK

```json
{
   "count": 150
}
```

--

### Delete (DELETE)

Eliminazione di un singolo oggetto.

La rotta è configurabile nella chiamata **setup** per ogni entity.

##### URL

```
DELETE /api/<entity>/<id>
```

##### Esempio di URL

```
DELETE /api/products/1
```

##### Risposta 200 OK

```json
{
   "success": true
}
```

--

### Sort (PATCH)

Ordinamento degli elementi in tabella.

La rotta deve corrispondere alla rotta **list** corrispondente, aggiungendo il suffisso **/sort**.

##### URL

```
PATCH /api/<entity>/sort
```

##### Esempio di URL

```
PATCH /api/products/sort
```

##### Richiesta

Nella richiesta viene passata la situazione aggiornata (come appare in tabella dopo l'azione di _drag_) e i dati del paginatore (numero di pagina e numero di elementi per pagina).

```json
{
   "data": [
      {
         "id": 3,
         [...]
      },
      {
         "id": 1,
         [...]
      },
      {
         "id": 2,
         [...]
      },
      [...]
   ],
   "page": 1,
   "perPage": 25
}
```

##### Risposta 200 OK

```json
{
   "success": true
}
```

## Form

### Detail (GET)

Elenco completo dei campi da mostrare nel form (editabili e non) per un singolo oggetto.

La rotta è configurabile nella chiamata **setup** per ogni entity.

##### URL

```
GET /api/<entity>/<id>
```

##### Esempio di URL

```
GET /api/products/1
```

##### Risposta 200 OK

```json
{
   "id": 1,
   "name": "Penna Bic",
   "image_url": "https://www.retif.it/media/image/400x/penna-bic-cristal-blu-pack-da-50_01.jpg",
   "desc": "test",
   "cost": 1,
   "shipping_fees": 0,
   "inserted_at": "2019-02-01T23:00:00.000Z",
   "updated_at": "2019-02-01T23:00:00.000Z",
   "category": "product"
}
```

--

### Create (PUT)

Inserimento di un nuovo oggetto.

La rotta è configurabile nella chiamata **setup** per ogni entity.

##### URL

```
PUT /api/<entity>
```

##### Esempio di URL

```
PUT /api/products
```

##### Richiesta

```json
{
   "name": "iPad Pro",
   "image_id": 5,
   "desc": "test",
   "cost": 899
}
```

##### Risposta 200 OK

```json
{
   "id": 3,
   "name": "iPad Pro",
   "image_url": "https://www.retif.it/media/image/400x/penna-bic-cristal-blu-pack-da-50_01.jpg",
   "desc": "test",
   "cost": 899,
   "shipping_fees": 0,
   "inserted_at": "2019-02-04T15:30:00.000Z",
   "updated_at": "2019-02-04T15:30:00.000Z",
   "category": "product"
}
```

--

### Edit (PATCH)

Modifica dei dati di un oggetto esistente.

La rotta è configurabile nella chiamata **setup** per ogni entity.

##### URL

```
PATCH /api/<entity>/<id>
```

##### Esempio di URL

```
PATCH /api/products/3
```

##### Richiesta

```json
{
   "name": "iPad Pro 12 pollici",
   "image_id": 5,
   "desc": "modificata",
   "cost": 999
}
```

##### Risposta 200 OK

```json
{
   "id": 3,
   "name": "iPad Pro 12 pollici",
   "image_url": "https://www.retif.it/media/image/400x/penna-bic-cristal-blu-pack-da-50_01.jpg",
   "desc": "modificata",
   "cost": 999,
   "shipping_fees": 0,
   "inserted_at": "2019-02-04T15:30:00.000Z",
   "updated_at": "2019-02-04T18:00:00.000Z",
   "category": "product"
}
```

## Varie

### Select Options (GET)

Lista di elementi dinamici per un determinato componente HTML Select.

La rotta è configurabile nella chiamata **setup** per ogni Select.

##### URL

```
GET /api/<entity>/select/options
```

##### Esempio di URL

```
GET /api/products/select/options
```

##### Richiesta

```json
{
   "search": "ipad"
}
```

##### Risposta 200 OK

```json
[
   {
      "id": 3,
      "text": "iPad Pro"
   },
   {
      "id": 7,
      "text": "iPad 2018"
   }
]
```

--

### File Upload (POST)

Upload di un file.

La rotta è configurabile nella chiamata **setup** per ogni componente File Input.

##### URL

```
POST /api/upload/file
```

##### Richiesta

```
{
   "file": <binary>
}
```

##### Risposta 200 OK

Prevedere una tabella dove salvare i dati relativi ai files uploadati.

```json
{
   "id": 1510,
   "type": "image/png",
   "normalizedType": "image",
   "url": "https://www.retif.it/media/image/400x/penna-bic-cristal-blu-pack-da-50_01.jpg",
   "name": "penna-bic-cristal-blu-pack-da-50_01.jpg"
}
```

---

## Gestione degli errori

##### Risposta standard

In caso di errore rispondere con la seguente struttura.

```json
{
   "error": {
      "statusCode": 400,
      "message": "Oops! An Error occurred.",
      "code": "BAD_REQUEST"
   }
}
```

| code                  | statusCode |
|-----------------------|------------|
| BAD_REQUEST           | 400        |
| UNAUTHORIZED          | 401        |
| FORBIDDEN             | 403        |
| NOT_FOUND             | 404        |
| INTERNAL\_SERVER\_ERROR | 500        |
