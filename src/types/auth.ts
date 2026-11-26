export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface StudioHighlight {
  id: string;
  label: string;
  value: string;
  accentClass: string;
}

export interface PaintSwatch {
  name: string;
  colorClass: string;
}
