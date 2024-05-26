import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConnectionService } from '../../services/connection-service/connection.service';
import { configuration } from '../../../main';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const connectionService = inject(ConnectionService);

  if (connectionService.isClientOffline && !req.url.includes(configuration.routes.ping)) {
    connectionService.storeRequest(req);
  }

  return next(req);
};
