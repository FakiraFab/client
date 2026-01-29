export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}
