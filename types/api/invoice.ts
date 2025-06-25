import { ApiResponse } from "../api";
import {
  InvoiceWithRelations,
  InvoiceListResponse,
  InvoiceStats,
} from "../invoice";

// Invoice API response types
export interface InvoiceResponse extends ApiResponse<InvoiceWithRelations> {}

export interface InvoiceListApiResponse
  extends ApiResponse<InvoiceListResponse> {}

export interface InvoiceStatsResponse extends ApiResponse<InvoiceStats> {}

export interface InvoiceDeleteResponse
  extends ApiResponse<{ deletedId: string }> {}
