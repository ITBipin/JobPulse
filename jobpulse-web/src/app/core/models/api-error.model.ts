export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  instance?: string;
  type?: string;
  errors?: Record<string, string[]>;
}

export interface AppError {
  status: number;
  message: string;
  detail?: string;
  validationErrors?: Record<string, string[]>;
}
