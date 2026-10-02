import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError, ProblemDetails } from '../models/api-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let clientMessage = 'An unexpected error occurred. Please try again.';
      let detail: string | undefined;
      let validationErrors: Record<string, string[]> | undefined;

      if (error.error && typeof error.error === 'object') {
        const problem = error.error as ProblemDetails;
        if (problem.title) {
          clientMessage = problem.title;
        }
        if (problem.detail) {
          detail = problem.detail;
        }
        if (problem.errors) {
          validationErrors = problem.errors;
        }
      }

      switch (error.status) {
        case 400:
          if (!clientMessage || clientMessage === 'An unexpected error occurred. Please try again.') {
            clientMessage = 'The request was invalid. Please check your input.';
          }
          if (validationErrors && Object.keys(validationErrors).length > 0 && !detail) {
            const firstKey = Object.keys(validationErrors)[0];
            const firstMsg = validationErrors[firstKey]?.[0];
            if (firstMsg) {
              detail = firstMsg;
            }
          }
          break;
        case 401:
          clientMessage = 'Authentication required. Please sign in to proceed.';
          break;
        case 403:
          clientMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          clientMessage = detail || 'The requested resource was not found.';
          break;
        case 413:
          clientMessage = detail || 'The uploaded payload exceeds the maximum allowed size (10 MiB).';
          break;
        case 429:
          clientMessage = 'Too many requests. Please try again shortly.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          clientMessage = 'The JobPulse service is temporarily unavailable. Please try again later.';
          detail = undefined;
          break;
        case 0:
          clientMessage = 'Unable to reach the JobPulse service. Please verify your network connection.';
          break;
      }

      const appError: AppError = {
        status: error.status,
        message: clientMessage,
        detail,
        validationErrors
      };

      return throwError(() => appError);
    })
  );
};
