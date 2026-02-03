import type { Address } from './address';
import type { Product } from './index';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'razorpay' | 'cod';

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtOrder: number;
  selectedOption?: {
    color?: string;
    size?: string;
  };
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: string;
  statusHistory?: OrderStatusHistory[];
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    order: Order;
    razorpay?: {
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
    };
  };
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CancelOrderRequest {
  reason: string;
}
