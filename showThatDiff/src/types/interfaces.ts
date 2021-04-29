export interface Address {
  value: string;
  longitude: number;
  latitude: number;
}

export interface Information {
  info: string;
  email: string;
}

export interface User {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

export interface PopUpSettings {
  popup: string | undefined;
  newwindow: string | undefined;
  width: string | undefined;
}
