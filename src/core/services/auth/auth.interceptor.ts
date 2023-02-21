import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the authentication token from the session storage
    const authToken = localStorage.getItem('authToken');

    // Clone the request and add the token to the headers
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Pass the modified request on to the next handler
    return next.handle(authReq);
  }
}





