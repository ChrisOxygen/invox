import { CreateClientInput, UpdateClientInput } from "../schemas/client";

export interface CreateClientRequest extends CreateClientInput {}
export interface UpdateClientRequest extends UpdateClientInput {
  clientId: string;
}

export interface DeleteClientRequest {
  clientId: string;
}
