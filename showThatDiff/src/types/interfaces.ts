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

export interface ShareSettings {
  url: string;
  text: string;
  userId: string;
  hashTags: string;
  title: string;
  image: string;
  desc: string;
  redirecturl: string;
  via: string;
  hashtags: string;
  userid: string;
  category: string;
  emailaddress: string;
  cemailaddress: string;
  bccemailaddress: string;
}

export interface PopUpSettings {
  popup: string | undefined;
  newwindow: string | undefined;
  width: string | undefined;
}
