export class Driver {
  public id: number;
  public email: string;
  public first_name: string;
  public last_name: string;
  public online: boolean;
  public location: {
    lat: number,
    lon: number,
    updated_at: number
  };
  public phone?: string;
  public company_id?: number;
  public role?: Object;
  public password?: string;
  public password_confirmation?: string;
  public distance?: number;
  public timeFromLastConnection?: number;
  constructor(

  ) { }
}

export class DriverSelect {
  constructor(
    public value: number,
    public label: string
  ) { }
}

export class Role {
  constructor(
    public id: number,
    public name: string) {

  }
}

export interface Invitation {
  id: number,
  email: string,
  token: string,
  company_id: number,
  role_id: number,
  created_at: Date,
  updated_at: Date
}

export class OrderStatusFromDriver {
  // 0 => in queue
  // 1 => pending
  // 2 => Picking up
  // 3 => Delivering
  constructor(
    public id: number,
    sort: number,
    public name: string,
    pivot: {
      order_id: number,
      status_id: number,
      comments: string | null,
      created_at: Date,
      updated_at: Date,
      pivot?: {
        order_id: number,
        status_id: number,
        comments: string | null,
        created_at: Date,
        updated_at: Date
      }
    }
  ) { }
}