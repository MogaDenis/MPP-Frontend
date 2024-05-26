import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { configuration } from '../../../main';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  public isClientOffline!: boolean;
  public clientOfflineSubject = new Subject<boolean>();
  public clientOffline$ = this.clientOfflineSubject.asObservable();

  private pendingRequests: HttpRequest<any>[] = [];

  constructor(private httpClient: HttpClient) {
    this.clientOffline$.subscribe({
      next: (status) => {
        this.isClientOffline = status;
      }
    })
  }

  checkIfSessionExpired(): Observable<any> {
    return this.httpClient.get(configuration.apiBaseUrl + configuration.routes.checkIfTokenExpired);
  }

  checkServerConnection(): Observable<any> {
    return this.httpClient.get(configuration.apiBaseUrl + configuration.routes.ping);
  }

  storeRequest(request: HttpRequest<any>): void {
    this.pendingRequests.push(request);

    console.log(this.pendingRequests);
  }

  retryPendingRequests(): void {
    while (this.pendingRequests.length > 0) {
      const request = this.pendingRequests.shift();
      console.log("Retry: " + request);
      if (!request) {
        continue;
      }

      this.httpClient.request(request).subscribe({
        error: () => {
          this.storeRequest(request);
        }
      });
    }
  }
}
