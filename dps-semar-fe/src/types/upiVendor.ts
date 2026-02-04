export interface UpiVendorUpiId {
  id?: number;
  title?: string;
  upiId: string;
  mobile?: string | null;
  email?: string | null;
  beneficiaryName?: string | null;
  isBusinessUpi?: boolean;
  channelIndex?: number;
  enabled?: boolean;
  settlementAmount?: number;
  hasReceivedPayin?: boolean;
  isPreserved?: boolean;
}

export interface UpiVendor {
  id: number;
  name?: string; // Legacy field, may not be present
  firstName?: string;
  lastName?: string;
  upiId?: string; // Legacy field for backward compatibility
  upiIds?: UpiVendorUpiId[]; // New field for multiple UPI IDs
  mobile?: string; // Legacy field
  phone?: string | null; // API field
  email: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED"; // Legacy field
  enabled?: boolean; // API field for status
  commissionRate?: number; // New field for vendor commission
  settlementUpiId?: string; // Settlement UPI ID for vendor
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface UpiVendorRequestDto {
  name: string;
  upiId: string;
  mobile: string;
  email: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface UpiVendorResponseDto extends UpiVendor {
  // Additional response fields if needed
}

export type UpiVendors = UpiVendor[];

export interface UpiVendorFormState {
  name: string;
  upiId: string;
  mobile: string;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface UpiVendorFormErrors {
  name?: string;
  upiId?: string;
  mobile?: string;
  email?: string;
  status?: string;
}
