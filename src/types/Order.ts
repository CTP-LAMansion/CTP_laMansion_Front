



export interface Product {

  id_Product?: number;

  name: string;

}

export interface OrderDetail {
  product: Product;
  quantity: number;
  unitOfMeasure: number;
  received: boolean;
}



export interface Order {

  orderId: number;

  status: number;

  orderDate: string;

  userId: number;

  requesterArea: string;

  orderDetails: OrderDetail[];

  receiver: string;

  comments: string;

}


export interface ApprovedOrder extends Order {
  approvedDate: string;
}

export interface OrderStatus {
  status: number;
  orderId: number;
}
