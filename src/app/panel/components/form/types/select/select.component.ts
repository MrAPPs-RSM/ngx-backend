import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService, ErrorResponse } from '../../../../../api/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormFieldSelect } from '../../interfaces/form-field-select';
import { BaseInputComponent } from '../base-input/base-input.component';
import { Subject, Subscription } from 'rxjs';
import { Language, LanguageService } from '../../../../services/language.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldSelect;
    @Input() isEdit: boolean;
    @Input() unique?: Function;

    private endpoint: string;
    private params = {
        where: {
            and: []
        }
    };
    private observable: Subject<any>;
    public options: SelectData[] = [];
    public typeAhead: EventEmitter<string> = new EventEmitter<string>();
    public selected: any;

    private _subscription = Subscription.EMPTY;
    private _dependsSubscription = Subscription.EMPTY;
    private _subFieldSubscription = Subscription.EMPTY;

    private _valueChangesSubscription = Subscription.EMPTY;

    constructor(private _apiService: ApiService,
        private _cd: ChangeDetectorRef,
        private _languageService: LanguageService,
        private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
      if (this.field.search && this.field.search.endpoint) {
        this.typeListener();

        this._valueChangesSubscription = this.getControl().valueChanges.subscribe(() => {
          const value = this.getControl().value;
          if (value) {
            this.options = [value];
            this.selected = value;
          }
          this._valueChangesSubscription.unsubscribe();
        });
      }

      this.selected = this.field.multiple === true ? [] : null;
      this.addQueryParams();

      setTimeout(() => {
        // For some reason, sometimes this.field.dependsOn was of type Subject, causing errors
        if (this.field.dependsOn && typeof this.field.dependsOn !== 'object') {
          const key = Array.isArray(this.field.dependsOn) ? this.field.dependsOn[0] : this.field.dependsOn;
          if (this.getControl(key)) {
            this._dependsSubscription = this.getControl(key).valueChanges.subscribe((value) => {
              let keyNotSet = true;
              const indexesToDelete: number[] = [];

              this.params.where.and.forEach((cond, index) => {
                if (Object.keys(cond)[0] === key) { // update if already set
                  if (value && value !== '') {
                    cond[key] = value;
                  } else {
                    indexesToDelete.push(index);
                  }
                  keyNotSet = keyNotSet && false;
                }
              });
              if (keyNotSet) {
                if (value && value !== '') {
                  const condition = {};
                  condition[key] = value;
                  this.params.where.and.push(condition);
                }
              }
              if (indexesToDelete.length > 0) {
                indexesToDelete.forEach((index) => {
                  this.params.where.and.splice(index, 1);
                });
              }

              this.loadOptions(true)
                .then(() => {
                  this.checkSelection();
                  this.updateSelectedOptions(this.getControl().value);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        } else {
          this.loadOptions().then(() => {
            if (!this.isEdit || !this.isSubField) {
              this.listenValueChange();
            } else if (this.isSubField) {
              this.getControl().updateValueAndValidity();
              if (this.getControl().value !== null && typeof this.getControl().value !== 'undefined') {
                this.updateSelectedOptions(this.getControl().value);
              } else {
                this._subFieldSubscription = this.getControl().parent.valueChanges.subscribe((value) => {
                  if (value && value[this.field.key]) {
                    this.updateSelectedOptions(value[this.field.key]);
                    this._subFieldSubscription.unsubscribe();
                  }
                });
              }
            }
          }).catch((err) => console.log(err));
        }
      }, 500);
    }

    /* When type in select */
    private typeListener(): void {
        this.typeAhead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(tag => this._apiService.get(this.field.search.endpoint, { search: tag }))
        ).subscribe(data => {
            this._cd.markForCheck();
            this.options = data;
        }, (err) => {
            console.log(err);
            this.options = [];
        });
    }

    /** Used in edit mode, but also in create if value is pre-set from table or query params */
    listenValueChange(): void {
        /** If value already set, update select options */
        if (this.getControl().value !== null && typeof this.getControl().value !== 'undefined') {
            this.updateSelectedOptions(this.getControl().value);
        }

        this._subscription = this.getControl().valueChanges.subscribe(value => {
            this.updateSelectedOptions(value);
            if (value !== this.getControl().value) {
                this.refreshFormValue(value, { emitEvent: false });
            }
        });
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }

    isValid() {
        if (this.getControl().touched) {
            if (this.isRequired()) {
                if (this.field.multiple === true) {
                    if (this.getControl().value instanceof Array) {
                        return this.getControl().value.length > 0;
                    } else {
                        return this.getControl().value !== null;
                    }
                } else {
                    return this.getControl().value !== null;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    onChange($event: any): void {
        this.refreshFormValue($event);
        if (this.observable) {
            this.observable.next();
        }
    }

    private loadOptions(forceReload?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.field.search) {
                return resolve();
            }
            if (this.endpoint) {
                if (this.options.length === 0 || forceReload === true) {
                    const queryParams = {
                        where: JSON.stringify(this.params.where)
                    };

                    if (this.isEdit || this.field.useContextId) {
                        if (this.endpoint.indexOf(':id') !== -1) {
                            this.endpoint = this.endpoint.replace(':id', this._route.params['value'].id);
                        }

                        if (queryParams.where.indexOf(':id') !== -1) {
                            queryParams.where = queryParams.where.replace(':id', this._route.params['value'].id);
                        }
                    }

                    const paramsRegex = new RegExp(':[a-zA-Z0-9]+', 'g');
                    const params = this.endpoint.match(paramsRegex);

                    if (params) {
                      for (const param of params ?? []) {
                        const formControl = this.getControl(param.substring(1));
                        if (formControl) {
                            this.endpoint = this.endpoint.replace(param, formControl.value);
                        }
                    }
                    }

                    /** Add lang if not set by setup.json but defined in select*/
                    if (this.field.lang) {
                        let lang: Language = null;
                        if (this.endpoint.indexOf('lang=') === -1) {
                            lang = this._languageService.getCurrentLang();
                        }

                        if (lang) {
                            queryParams['lang'] = lang.isoCode;
                        }
                    }

                    this._apiService.get(this.endpoint, queryParams)
                        .then((response) => {
                            this.options = this.filterOptionsIfNeeded(response);
                            this.setValueIfSingleOptionAndRequired();
                            resolve();
                        })
                        .catch((response: ErrorResponse) => {
                            // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                            console.log(response);
                        });
                } else {
                    resolve();
                }
            } else {
                if (this.field.options instanceof Array) {
                    if (this.options.length === 0 || forceReload === true) {
                        this.options = this.filterOptionsIfNeeded(this.field.options);
                    }
                    this.setValueIfSingleOptionAndRequired();
                    resolve();
                }
            }
        });
    }

    private addQueryParams(): void {
        if (this.field.search) {
            return null;
        }

        if (this.field.options instanceof Array) {
            this.endpoint = null;
            return null;
        } else {
            const endpoint = this.field.options;
            let filter;
            if (endpoint.indexOf('?') !== -1) {
                const queryParams = endpoint.split('?')[1];
                if (queryParams.indexOf('where') !== -1) {
                    filter = JSON.parse(queryParams.split('where=')[1]);
                }
                if (filter) {
                    if ('and' in filter) {
                        filter['and'].forEach((condition) => {
                            this.params.where.and.push(condition);
                        });
                    } else {
                        Object.keys(filter).forEach((key) => {
                            const obj = {};
                            obj[key] = filter[key];
                            this.params.where.and.push(obj);
                        });

                    }
                }
                this.endpoint = endpoint.split('?')[0];
            } else {
                this.endpoint = endpoint;

                if (this.field.useContextId) {
                    const endpointArray = endpoint.split('?');
                    this.endpoint = endpointArray[0] + '/:id' + (endpointArray.length > 1 ? endpointArray[1] : '');
                }
            }
        }
    }

    private checkSelection() {
        if (this.selected || (this.selected && this.selected.length > 0)) {
            let keepValue = false;
            this.options.forEach((option) => {
                if (this.field.multiple === true) {
                    (this.selected as SelectData[]).forEach((selection) => {
                        if (option.id === selection.id) {
                            keepValue = true;
                        }
                    });
                } else {
                    if (this.selected && option.id === this.selected.id) {
                        keepValue = true;
                    }
                }
            });

            if (!keepValue) {
                this.updateSelectedOptions(null);
                this.refreshFormValue(null);
            }
        }
    }

    private updateSelectedOptions(value: any | any[]) {
        if (typeof value !== 'undefined' && value !== null) {
            if (this.field.multiple === true) {
                const selected = [];
                let valuesToBeChecked = [];

                // Adjust values
                if (Array.isArray(value)) {
                    valuesToBeChecked = [...value];
                } else {
                    valuesToBeChecked.push(value);
                }

                valuesToBeChecked.forEach((itemId) => {
                    if (typeof itemId === 'object') {
                        itemId = itemId.id;
                    }

                    this.options.forEach((option) => {
                        if (option.id === itemId) {
                            selected.push({
                                id: itemId,
                                text: option.text
                            });
                        }
                    });
                });
                this.selected = [...selected];
            } else {
                this.options.forEach((option) => {
                    if (typeof value === 'object') {
                        if (option.id === value.id) {
                            this.selected = {
                                id: value.id,
                                text: option.text
                            };
                        }
                    } else {
                        if (option.id === value) {
                            this.selected = {
                                id: value,
                                text: option.text
                            };
                        }
                    }
                });
            }
        } else {
            this.selected = this.field.multiple === true ? [] : null;
        }
    }

    private filterOptionsIfNeeded(options: SelectData[]): SelectData[] {
        // if (this.unique) {
        //     options = this.unique(this, options);
        // }

        return options;
    }

    private setValueIfSingleOptionAndRequired() {
        if (this.options.length === 1
            && this.isRequired()
            && this.getControl().value === null) {
            this.refreshFormValue(this.options);
        }
    }

    private refreshFormValue(value: any, options?: { emitEvent: boolean }): void {
        if (value !== null) {
            if (value instanceof Array) {
                const ids = value.map(item => item instanceof Object ? item.id : item);

                const newVal = true === this.field.multiple
                    ? ids
                    : ids.length > 0 ? ids[0] : null;

                this.getControl().setValue(newVal, options);
            } else {
                if (typeof value === 'object' && !this.field.search) {
                    this.getControl().setValue(value.id, options);
                } else {
                    this.getControl().setValue(value, options);
                }
            }
        } else {
            this.getControl().setValue(this.field.multiple === true ? [] : null);
        }
    }
}

export interface SelectData {
    id: string | number | null;
    text: string;
}
