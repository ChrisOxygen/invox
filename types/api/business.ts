import {
  CreateBusinessApiInput,
  UpdateBusinessApiInput,
} from "@/types/schemas/business";

// Business operations use ApiResponse<Business> from api/index.ts

export interface CreateBusinessRequest extends CreateBusinessApiInput {}

export interface UpdateBusinessRequest extends UpdateBusinessApiInput {
  businessId: string;
}

export interface DeleteBusinessRequest {
  businessId: string;
}
