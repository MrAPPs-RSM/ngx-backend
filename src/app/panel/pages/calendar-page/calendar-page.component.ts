import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {FormSettings} from '../../components/form/interfaces/form-settings';
import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../../services/form-generator.service';
import {ApiService} from '../../../api/api.service';
import {CalendarActivity} from '../../../interfaces/CalendarActivity';
import ErrorBag from '../../../strategies/form/ErrorBag';
import {Language, LanguageService} from '../../services/language.service';
import ResponseProcessor from '../../../strategies/form/ResponseProcessor';
import {ToastsService} from '../../../services/toasts.service';
import {WeekDay} from 'calendar-utils';
import RequestProcessor from '../../../strategies/form/RequestProcessor';
import CalendarRequestProcessor from '../../../strategies/form/CalendarRequestProcessor';

declare const $: any;
// calendar random colors
const colors = [
  {
    primary: '#E91E63',
    secondary: '#F06292'
  },
  {
    primary: '#03A9F4',
    secondary: '#4FC3F7'
  },
  {
    primary: '#009688',
    secondary: '#4DB6AC'
  },
  {
    primary: '#CDDC39',
    secondary: '#DCE775'
  },
  {
    primary: '#FFC107',
    secondary: '#FFD54F'
  }
];


@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit, OnDestroy {

  viewDate = new Date();
  currentLang: string = null;
  formDescriptor: FormSettings;
  form: FormGroup;
  private calendarId: number;

  private _subscription = Subscription.EMPTY;
  private listEndpoit: string;
  private ajaxFormEndpoint: string;
  private ev: CalendarActivity[] = [];
  viewType: CalendarView = CalendarView.Month;
  private editingEventId: number|undefined = undefined;
  errorBag: ErrorBag;
  processor: ResponseProcessor;
  requestProcessor: CalendarRequestProcessor;

  isEdit = false;

  isFormLoading = false;
  isLoading = false;
  CalendarView = CalendarView;

  constructor(
    private _route: ActivatedRoute,
    private _formGenerator: FormGeneratorService,
    private _apiService: ApiService,
    private _languageService: LanguageService,
    private _toast: ToastsService
  ) {

  }

  ngOnInit(): void {
    this._subscription = this._route.queryParams.subscribe(params => {
      this.formDescriptor = this._route.snapshot.data.forms[0];
      this.calendarId = +this._route.snapshot.params.id;
      this.listEndpoit = `${this.formDescriptor.api.listEndpoint}/${this.calendarId}`;
      this.ajaxFormEndpoint = `${this.formDescriptor.api.ajaxFormEndpoint}/${this.calendarId}`;
      this.form = this._formGenerator.generate(this.formDescriptor.fields);
      this.errorBag = this._languageService.createErrorBagFor(this.form, this.formDescriptor);
      this.processor = this._formGenerator.generateResponseProcessorFor(this.form, this.formDescriptor);
      this.requestProcessor = new CalendarRequestProcessor(this.formDescriptor, this._languageService);
      this.currentLang = this._languageService.getCurrentLangIsCode();
      this.initData();
    });
  }

  /**
   * returns the calendar available view types to be displayed in the view selector
   */
  get availableViews(): {label: string; value: CalendarView}[] {
    return [CalendarView.Week, CalendarView.Month].map((value: string) => (
      {
        value: value as CalendarView,
        label: `calendar.${value}`
      }
    ));
  }

  /**
   * Returns the filed groups keys different from the base one
   */
  notBaseKeys() {
    return Object.keys(this.formDescriptor.fields).filter(e => e !== 'base');
  }

  /**
   * Returns the field list in the corrispondent key
   * @param key
   */
  valueOfSettingsField(key: string) {
    return this.formDescriptor.fields[key];
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get selectedLang() {
    return this._languageService.getContentLanguages().find((e: Language) => e.isoCode == this.currentLang);
  }

  set selectedLang(lang: Language) {
    this.currentLang = lang.isoCode;
  }

  /**
   * Sets the day from calendar
   * @param day
   */
  setDay(day: WeekDay) {
    this.setViewDate(day.date as Date);
  }

  /**
   * Sets the calendar view type
   * @param type
   */
  setViewType(type: CalendarView) {
    if (type !== this.viewType) {
      this.viewType = type;
      this.initData();
    }
  }

  /**
   * Returns the selected date
   */
  get centerDate(): Date {
    return this.viewDate;
  }

  /**
   * Sets the selected date
   * @param value
   */
  set centerDate(value: Date) {
    this.setViewDate(value);
  }

  /**
   * Returns the calendar title
   */
  get title() {
    return moment(this.centerDate).format('MMMM YYYY');
  }

  /**
   * Checks if the selected date has events in the list
   */
  get currentHasEvents() {
    const start = moment(this.viewDate.getTime()).startOf('day').valueOf();
    const end   = start + 24 * 60 * 60 * 1000;
    const r = this.events.some((e: CalendarEvent) => {
      const eStart = e.start.getTime();
      const eEnd   = e.end.getTime();

      if (eStart <= start && eEnd >= end) {
        return true;
      }

      if (eStart >= start && eStart <= end) {
        return true;
      }

      if (eEnd >= start && eEnd <= end) {
        return true;
      }

      return false;
    });

    return r;
  }

  /**
   * Opens the modal containing the edit/create modal
   */
  openFormModal() {
    $('#myModal').modal('show');
  }

  /**
   * Saves the form data managing both creation and update
   * @private
   */
  private saveForm(): Promise<any> {
    const p = this.requestProcessor.createFormRequestBody({...this.form.getRawValue()});
    const endpoint = this.getDetailUrl();
    return this.editingEventId
      ? this._apiService.patch(endpoint, p)
      : this._apiService.put(endpoint, p);
  }

  /**
   * Manages the form submition validating form
   * @param event
   */
  async onSubmit(event) {
    this.closeErrors();

    if (!this.form.valid) {
      this.errorBag.computeErrors();
      return;
    }
    this.isFormLoading = true;
    try {
      await this.saveForm();
      await this.loadData();
      this._toast.success();
      $('#myModal').modal('hide');
    } catch (e) {
      if (e.error && e.error.statusCode === 400) {
        this.formDescriptor.errors.push(e.error.message);
      } else {
        this._toast.error();
      }
    }
    this.isFormLoading = false;
  }

  /**
   * Shows the edit form for the passed eventId
   * @param id
   */
  showEditById(id: number) {
    this.isFormLoading = true;
    this.closeErrors();
    this.isEdit = true;
    this.editingEventId = id;
    const endpoint = this.getDetailUrl(id);

    this._apiService.get(endpoint, this.getViewDateBoundaries())
      .then((c: CalendarActivity) => {
        this.processor.syncResponse(c);
        this.form.patchValue(c);
      })
      .catch(e => this._toast.error())
      .finally(() => this.isFormLoading = false);

    this.openFormModal();
  }

  private getDetailUrl(id?: number): string {
    /**
     * Se passo un id uso quello
     * Se sto modificando un task la url deve finire con l'id del task
     * se sto creando un task la url deve finire con l'id del calendario
     */
    const _id = id || this.editingEventId || this.calendarId;

    return _id
      ? `${this.formDescriptor.api.endpoint}/${_id}`
      : `${this.formDescriptor.api.endpoint}`;
  }

  async deleteEvent() {
    const url = `${this.formDescriptor.api.endpoint}/${this.editingEventId}`;
    try {
      const text: string = this._languageService.translate('calendar.delete_confirmation');
      if (confirm(text)) {
        await this._apiService.delete(url);
        await this.loadData();
        this._toast.success();
        $('#myModal').modal('hide');
      }
    } catch (e) {
      this._toast.error();
    }
  }

  /**
   * Shows the creation form
   */
  async showCreate() {
    this.closeErrors();
    this.editingEventId = undefined;
    this.isEdit = false;
    this.form.reset();
    this.openFormModal();
  }

  async loadAjaxForm() {
    
  }

  /**
   * Dispose the form errors
   */
  closeErrors() {
    this.formDescriptor.errors = [];
    this.errorBag.reset();
  }

  /**
   * Gets the boundaries of the displayed calendar view
   * @private
   */
  private getViewDateBoundaries(): {start: string; end: string} {
    return this.getDateBoundaries(this.viewDate);
  }

  /**
   * Get the view boundaries for the date passed as parameter
   * @param date
   * @private
   */
  private getDateBoundaries(date: Date): {start: string; end: string} {
    const  mode = this.getMomentMode();
    const viewMoment = moment(date);

    return {
      start: encodeURIComponent(viewMoment.startOf(mode).format()),
      end: encodeURIComponent(viewMoment.endOf(mode).format())
    };
  }

  private getMomentMode() {
    switch (this.viewType) {
      case CalendarView.Week:
        return 'week';
        break;
      default:
        return 'month';
        break;
    }
  }

  nextInterval() {
    this.moveInterval(1);
  }

  previousInterval() {
    this.moveInterval(-1);
  }

  private moveInterval(steps: number) {
    const  mode = this.getMomentMode();
    const viewMoment = moment(this.viewDate);
    const action = steps < 0
      ? 'subtract'
      : 'add';
    const value = Math.abs(steps);

    const d = viewMoment[action](value, this.getMomentMode()).toDate();

    this.setViewDate(d);
  }

  /**
   * Sets the view central date and updates the viewed events if the calendar boundaries are different
   * @param date
   */
  setViewDate(date: Date) {
    const currentBoundaries = this.getViewDateBoundaries();
    this.viewDate = date;
    const newBoundaries     = this.getViewDateBoundaries();

    if (currentBoundaries.start !== newBoundaries.start || currentBoundaries.end !== newBoundaries.end) {
      this.initData();
    }
  }

  /**
   * Loads the data from the api, supposed to be used when the error is somewhere else managed
   * @private
   */
  private async loadData() {
    this.isLoading = true;
    const response = await this._apiService.get(this.listEndpoit, this.getViewDateBoundaries())
      .finally(() => this.isLoading = false);
    this.ev = response;
  }

  /**
   * Loads data and manages the errors
   * @private
   */
  private async initData() {
    try {
      await this.loadData();
    } catch (e) {
      this._toast.error();
    }
  }


  /**
   * Returns the adapted events for the calendar component
   */
  get events(): CalendarEvent[] {
    return this.ev.map(e => {
      const colorIndex = e.id % colors.length;
      const color = colors[colorIndex];
      return {
        id: e.id,
        start: new Date(e.start_at),
        end: new Date(e.end_at),
        title: e.reference,
        color,
        actions: [
          {
            label: '<i class="fa fa-pencil fa-2x"></i>',
            cssClass: 'text-white',
            onClick: ({event}: { event: CalendarEvent }): void => {
              this.showEditById(event.id as number);
            },
          },
        ]
      };
    });
  }

  get isMultiLangEnabled() {
    return 'en' in this.formDescriptor.fields && this._languageService.getContentLanguages().length > 0;
  }
}
