import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private subject!: Subject<any>;

 connect(url: string): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket = new WebSocket(url);

      this.socket.onmessage = (event) => {
        observer.next(event.data);
      };

      this.socket.onerror = (error) => {
        observer.error(error);
      };

      this.socket.onclose = () => {
        observer.complete();
      };
    });
  }

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
