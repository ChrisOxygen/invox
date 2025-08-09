import {
  ZCreateClientInput,
  ZUpdateClientInput,
} from "@/features/clients/validation/clientSchemas";

export interface CreateClientRequest extends ZCreateClientInput {}
export interface UpdateClientRequest extends ZUpdateClientInput {
  clientId: string;
}

export interface DeleteClientRequest {
  clientId: string;
}
