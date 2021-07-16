import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../api/api.service';

@Component({
  selector: 'app-base-long-polling',
  templateUrl: './base-long-polling.component.html',
  styleUrls: ['./base-long-polling.component.css']
})
export class BaseLongPollingComponent {

  public isLoading = false;

  constructor(protected _apiService: ApiService) {
  }

  async timeout(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async checkProgressStatus(response: any): Promise<any> {
    if ('progress_status' in response && response['progress_status'] === 'failed') {
      throw Error('message' in response ? response['message'] : 'Operation failed');
    } else if ('progress_url' in response) {
      await this.timeout(5000);
      const progressResponse = await this._apiService.get(response['progress_url']);
      return await this.checkProgressStatus(progressResponse);
    } else {
      return response;
    }
  }
}
