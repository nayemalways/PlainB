export interface CustomerAddress {
  cus_address: string;
  cus_city: string;
  cus_country: string;
  cus_fax?: string;
  cus_name: string;
  cus_phone: string;
  cus_postcode: string;
  cus_state: string;
}
export interface ShippingAddress {
  ship_address: string;
  ship_city: string;
  ship_country: string;
  ship_name: string;
  ship_phone: string;
  ship_postcode: string;
  ship_state: string;
}
export interface UserProfile {
  email?: string;
  cus_address: CustomerAddress;
  ship_address: ShippingAddress;
}
