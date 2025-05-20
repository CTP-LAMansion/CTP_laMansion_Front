
export enum RequestStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
  }
  
  export interface Product {

    id_Product?: number;
  
    name: string;
  
  }

  export interface NewOrder {
    orderDate: string;
    userId: number;
    requesterArea: string;
    orderDetails: OrderDetail[];
    receiver: string;
    comments: string;
  }
  
export interface OrderDetail {
  product: Product;
  quantity: number;
  unitOfMeasureId: number; // Changed from unitOfMeasure: string
  received: boolean;
}
  
  export interface Order {
    orderId: number;
    orderDate: string;
    userId: number;
    requesterArea: string;
    receiver: string;
    comments: string | null;
    status: RequestStatus;
    orderDetails: OrderDetail[];
  }

export interface UnitOfMeasure {
  unitOfMeasureId: number;
  name: string;
}
  