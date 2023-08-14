export interface SystemParamaterPayload {
  rows_count: number;
  region: boolean;
  region_code_length: number;

  territory: boolean;
  territory_code_length: number;

  inspection_type: boolean;
  inspection_type_code_length: number;

  customer: boolean;
  customer_code_length: number;

  quotation: boolean;
  quotation_prefix: string;
  quotation_start_with: number;
  quotation_code_length: number;

  booking: boolean;
  booking_prefix: string;
  booking_start_with: number;
  booking_code_length: number;

  invoice: boolean;
  invoice_prefix: string;
  invoice_start_with: number;
  invoice_code_length: number;

  activity: boolean;
  activity_prefix: string;
  activity_start_with: number;
  activity_code_length: number;

  tariff: boolean;
  tariff_prefix: string;
  tariff_start_with: number;
  tariff_code_length: number;
}
