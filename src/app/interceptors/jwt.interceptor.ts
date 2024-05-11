import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const jwtToken = localStorage.getItem("jwtToken");

  const requestWithAuthorization = request.clone({
    setHeaders: {
      Authorization: "Bearer " + jwtToken
    }
  });

  return next(requestWithAuthorization);
};
