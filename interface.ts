import { Dayjs } from "dayjs"
export interface MassageItem {
  _id: string,
  name: string,
  address: string,
  tel:string,
  openTime:string,
  closeTime:string,
  averageRating: number,
  reviewerCount: number
}

export interface MassageJson {
  success: boolean,
  count: number,
  pagination: Object,
  data: MassageItem[]
}

export interface User{
  _id: string,
  name:string,
  username:string,
  email:string,
  role:string,
  password:string,
  tel:string
}

export interface ReserveItem {
  _id: string,
  reserveDate: string,
  user: string,
  massageShop: MassageItem,
  createdAt: Dayjs
}

export interface Review {
  _id: string;
  title: string;
  text: string;
  rating: number;
  user: string;
  massageShop: string;
  createdAt: string;
}

export interface ReviewJson {
  success: boolean;
  data: Review | Review[];
}

