import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private _http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    return this._http.post(environment.massage.send, {
      message,
      id: Date.now()
    });
  }

  messageListen(): Observable<string> {
    const eventSource = new EventSource(environment.massage.connect);
    return new Observable((o: Subscriber<string>) => {
      eventSource.onmessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        o.next(String(message.message));
      }

      eventSource.onerror = (e) => {
        o.error(e);
      }

      return () => {
        eventSource.close(); // закрыть соединение при отписке от Observable
      };
    });
  }
}
