import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedReq = req;
  if (req.method === 'POST') {
    modifiedReq = req.clone({
      headers: req.headers.append('lang', 'en'),
    });
  }
  return next(modifiedReq);
};
