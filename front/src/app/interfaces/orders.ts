export class Order {
  public id: number;
  public number: string;
  public pickup_info: {
    lat: number,
    lon: number,
    name: string,
    phone: string,
    address: string,
    address_info: string,
    zip: string,
    city: string
  };
  public delivery_info: {
    lat: number,
    lon: number,
    name: string,
    phone: string,
    address: string,
    address_info: string,
    zip: string,
    city: string
  };
  public date: Date;
  public comments: string;
  public user_id: number | null;
  public status_id: number;
  public company_id: number;
  public created_at: Date;
  public updated_at: Date;
  public deleted_at: Date | null;
  public history: OrderHistory[];
  public pickup_at: Date | string;
  public deliver_at: Date | string;
  public customer_id: number | null;
  public total: number;
  public payment_type_id: number | null;
  public is_already_paid: number | null;
  public money_change: number;
  public riderName?: string;
  public isCanceled?: boolean;
  public showStatuses?: boolean;

  constructor(order?: any) {
    if (order) Object.assign(this, order);
    else {
      this.id = 0
      this.number = '0';
      this.pickup_info = {
        lat: 0,
        lon: 0,
        name: '',
        phone: '',
        address: '',
        address_info: '',
        zip: '',
        city: ''
      };
      this.delivery_info = {
        lat: 0,
        lon: 0,
        name: '',
        phone: '',
        address: '',
        address_info: '',
        zip: '',
        city: ''
      };
      this.date = new Date();
      this.comments = '';
      this.user_id = 0;
      this.status_id = 0;
      this.company_id = 0
      this.created_at = new Date()
      this.updated_at = new Date();
      this.deleted_at = new Date();
      this.history = [{
        order_id: 0,
        status_id: 0,
        comments: '',
        created_at: new Date(),
        updated_at: new Date()
      }];
      this.pickup_at = new Date();
      this.deliver_at = new Date();
      this.customer_id = 0;
      this.total = 0;
      this.payment_type_id = 0;
      this.is_already_paid = 0;
      this.money_change = 0;
      this.riderName = '';
    }
  }
}

export class OrderStatus {
  constructor(
    public id: number = 0,
    public name: string = "",
    public sort: number = 0,
    public dropdownName?: string
  ) { }
}

export class OrderHistory {
  constructor(
    public order_id: number,
    public status_id: number | null,
    public comments?: string,
    public created_at?: Date,
    public updated_at?: Date
  ) { }
}

export interface OrderFromCustomer {
  pickup_at: Date | string | null,
  deliver_at: Date | string | null,
  delivery_info: {
    name: string,
    phone: string,
    address: string,
    address_info?: string,
    zip: number,
    city: string,
    lat: number,
    lon: number
  },
  comments: string,
  customer_id: number,
  customer_external_id: string,
  total: number,
  payment_type_id: number | null,
  is_already_paid: number | null,
  money_change?: number,
}

export interface PaymentType {
  id: number,
  name: string
}
