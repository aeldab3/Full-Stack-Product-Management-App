import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: string[];
  constructor() {
    this.notifications = [
      'Your order has been placed successfully',
      'Your order has been cancelled',
      'Your order has been completed',
      'Your order has been shipped',
      '',
      'Your order has been delivered',
    ];
  }

  getNotifications(): Observable<string> {
    return new Observable<string>((observer) => {
      let counter = 0;
      let notificationInterval = setInterval(() => {
        if (counter >= this.notifications.length) {
          observer.complete();
        }
        if (this.notifications[counter] === '') {
          observer.error('Empty notifications');
        }
        observer.next(this.notifications[counter]);
        counter++;
      }, 2000);
      return {
        unsubscribe: () => {
          clearInterval(notificationInterval);
        },
      };
    });
  }
}
