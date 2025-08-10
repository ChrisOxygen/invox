# React Query Mutation Hooks Convention

## Applies To

- Files matching pattern: `**/hooks/use*.ts` or `**/hooks/use*.tsx`
- Any file creating custom React Query mutation hooks for server actions
- Files in feature directories under `features/{feature}/hooks/`

## Standard Convention

When creating custom React Query mutation hooks, follow this exact pattern:

### File Structure

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { [ReturnType] } from "@prisma/client"; // Import actual return type from Prisma
import { [InputType] } from "@/shared/validators/[feature]"; // Or feature-specific validation

import { [serverAction] } from "../actions"; // Relative import for same feature
import { ApiResponse } from "@/types";

interface Use[HookName]Options {
  onSuccess?: (response: ApiResponse<[ReturnType]>) => void;
  onError?: (error: string) => void;
}

// Hook to [description of what the hook does]
export function use[HookName](options?: Use[HookName]Options) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      data: [InputType]
    ): Promise<ApiResponse<[ReturnType]>> => {
      const result = await [serverAction](data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["relevant-query-key"] });

      // Add additional query invalidations as needed
      // queryClient.invalidateQueries({ queryKey: ["other-related-key"] });

      // Call the success callback with the API response
      if (result) {
        options?.onSuccess?.(result);
      }
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    isSuccess: mutation.isSuccess,
    data: mutation.data?.data || null, // Extract the actual data from the response
    reset: mutation.reset,
  };
}
```

## Key Requirements

### 1. Function Export Pattern

- ✅ Use named function exports: `export function useHookName()`
- ❌ Avoid arrow function exports: `export const useHookName = () =>`

### 2. Options Interface

- Always create an options interface with optional `onSuccess` and `onError` callbacks
- Use proper TypeScript generics matching the server action return type
- Name pattern: `Use[HookName]Options`

### 3. Import Structure

```typescript
// React Query imports
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Type imports (Prisma models, validation types)
import { ModelType } from "@prisma/client";
import { ValidationInputType } from "@/shared/validators/feature";

// Action imports (relative for same feature)
import { _actionName } from "../actions";

// Common type imports
import { ApiResponse } from "@/types";
```

### 4. Error Handling

- Always throw errors in `mutationFn` when `result.success` is false
- Pass error messages to `onError` callback
- Don't handle toast notifications in the hook (let components handle this)

### 5. Query Invalidation

- Invalidate relevant query keys on success
- Use descriptive, consistent query key patterns
- Add comments for multiple invalidations

### 6. Return Object

Must return all these properties:

```typescript
return {
  mutate: mutation.mutate,
  mutateAsync: mutation.mutateAsync,
  isPending: mutation.isPending,
  isError: mutation.isError,
  error: mutation.error?.message || null,
  isSuccess: mutation.isSuccess,
  data: mutation.data?.data || null,
  reset: mutation.reset,
};
```

## Examples

### ✅ Good Example (Payment Account Creation)

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentAccount } from "@prisma/client";
import { ZCreatePaymentAccountInput } from "@/shared/validators/payment";

import { _createPaymentAccount } from "../actions";
import { ApiResponse } from "@/types";

interface UseCreatePaymentAccountOptions {
  onSuccess?: (response: ApiResponse<PaymentAccount>) => void;
  onError?: (error: string) => void;
}

export function useCreatePaymentAccount(
  options?: UseCreatePaymentAccountOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      data: ZCreatePaymentAccountInput
    ): Promise<ApiResponse<PaymentAccount>> => {
      const result = await _createPaymentAccount(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });

      if (result) {
        options?.onSuccess?.(result);
      }
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    isSuccess: mutation.isSuccess,
    data: mutation.data?.data || null,
    reset: mutation.reset,
  };
}
```

### ❌ Bad Example (Old Pattern)

```typescript
// Don't do this
export const useCreatePaymentAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => _createPaymentAccount(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      toast.error("An error occurred");
    },
  });
};
```

## Naming Conventions

- Hook names: `use[Action][Entity]` (e.g., `useCreatePaymentAccount`, `useUpdateInvoice`)
- Options interface: `Use[HookName]Options`
- Server actions: `_[action][Entity]` (e.g., `_createPaymentAccount`)
- Query keys: Use kebab-case arrays (e.g., `["payment-accounts"]`, `["invoice-stats"]`)

## File Organization

Place mutation hooks in feature-specific directories:

```
features/
  payments/
    hooks/
      useCreatePaymentAccount.ts
      useUpdatePaymentAccount.ts
      index.ts
  invoice/
    hooks/
      useCreateInvoice.ts
      useUpdateInvoice.ts
      index.ts
```

Always export from feature `index.ts` files for clean imports.
