# Custom Toast Templates Convention

## Applies To

- All components and hooks that need to display notifications
- Any file using toast notifications (success, error, info, warning, loading)
- Files in feature directories, components, hooks, and actions

## Standard Convention

Always use the custom toast templates from `@/components/toast-templates` instead of plain `sonner` toast methods.

### Import Pattern

```typescript
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showLoadingToast,
  // For advanced usage with actions/options
  showCustomSuccessToast,
  showCustomErrorToast,
  showCustomInfoToast,
  showCustomWarningToast,
  showCustomLoadingToast,
} from "@/components/toast-templates";
```

### Basic Usage

#### Success Toast

```typescript
// Simple success message
showSuccessToast("Payment Account Created");

// With description
showSuccessToast(
  "Payment Account Created",
  "PayPal account has been successfully connected"
);
```

#### Error Toast

```typescript
// Simple error message
showErrorToast("Creation Failed");

// With description
showErrorToast(
  "Payment Account Creation Failed",
  "Unable to connect to PayPal. Please check your credentials and try again."
);
```

#### Info Toast

```typescript
// Information message
showInfoToast(
  "Feature Coming Soon",
  "Payment editing functionality will be available soon"
);
```

#### Warning Toast

```typescript
// Warning message
showWarningToast(
  "Account Limit Reached",
  "You have reached your plan limit for payment accounts"
);
```

#### Loading Toast

```typescript
// For long-running operations
const loadingToastId = showLoadingToast(
  "Creating Account",
  "Connecting to PayPal..."
);

// Later dismiss the loading toast
toast.dismiss(loadingToastId);
```

### Advanced Usage with Actions

Use the custom toast variants when you need action buttons or custom behavior:

```typescript
showCustomSuccessToast(
  "Account Created Successfully",
  "Your PayPal account has been connected",
  {
    duration: 7000,
    action: {
      label: "View Details",
      onClick: () => {
        // Navigate to account details
        router.push("/account/payments");
      },
    },
    onDismiss: () => {
      // Optional cleanup when toast is dismissed
      console.log("Toast dismissed");
    },
  }
);

showCustomErrorToast(
  "Connection Failed",
  "Unable to connect to payment gateway",
  {
    action: {
      label: "Retry",
      onClick: () => {
        // Retry the operation
        retryConnection();
      },
    },
  }
);
```

## Mutation Hook Integration

### ✅ Good Example

```typescript
const { mutateAsync: createPaymentAccount } = useCreatePaymentAccount({
  onSuccess: (response) => {
    showSuccessToast("Payment Account Created", response.message);
    onSuccess?.();
    onClose();
  },
  onError: (error) => {
    showErrorToast("Creation Failed", error);
  },
});
```

### ❌ Bad Example (Don't use plain sonner)

```typescript
// Don't do this
const { mutateAsync: createPaymentAccount } = useCreatePaymentAccount({
  onSuccess: (response) => {
    toast.success(response.message); // ❌ Plain sonner toast
  },
  onError: (error) => {
    toast.error(error); // ❌ Plain sonner toast
  },
});
```

## Component Usage Patterns

### Form Submission

```typescript
const onSubmit = async (data: FormData) => {
  // Show loading toast for long operations
  const loadingId = showLoadingToast("Processing", "Creating your account...");

  try {
    await submitForm(data);

    // Dismiss loading and show success
    toast.dismiss(loadingId);
    showSuccessToast(
      "Account Created",
      "Your account has been set up successfully"
    );
  } catch (error) {
    // Dismiss loading and show error
    toast.dismiss(loadingId);
    showErrorToast("Creation Failed", error.message);
  }
};
```

### Validation Errors

```typescript
const validateForm = (data: FormData) => {
  if (!data.email) {
    showWarningToast("Missing Information", "Email is required to continue");
    return false;
  }

  if (!data.gatewayType) {
    showWarningToast("Gateway Required", "Please select a payment gateway");
    return false;
  }

  return true;
};
```

### API Response Handling

```typescript
const handleApiResponse = (response: ApiResponse) => {
  if (response.success) {
    showSuccessToast("Operation Successful", response.message);
  } else {
    showErrorToast("Operation Failed", response.message);
  }
};
```

## Toast Types and Use Cases

### Success Toast

- ✅ Account creation
- ✅ Data updates
- ✅ File uploads
- ✅ Form submissions
- ✅ Successful API calls

### Error Toast

- ❌ API failures
- ❌ Validation failures
- ❌ Network errors
- ❌ Permission denied
- ❌ Unexpected errors

### Info Toast

- ℹ️ Feature announcements
- ℹ️ Coming soon messages
- ℹ️ General information
- ℹ️ Tips and hints
- ℹ️ Status updates

### Warning Toast

- ⚠️ Plan limits reached
- ⚠️ Missing required fields
- ⚠️ Potential issues
- ⚠️ Confirmation needed
- ⚠️ Resource limitations

### Loading Toast

- 🔄 File uploads
- 🔄 Account creation
- 🔄 Data processing
- 🔄 API calls (long-running)
- 🔄 Background operations

## Best Practices

### 1. Message Content

- **Title**: Short, descriptive (2-4 words)
- **Description**: Clear explanation of what happened and next steps
- Use action-oriented language
- Avoid technical jargon

### 2. Duration Guidelines

- **Success**: 5 seconds (default)
- **Error**: 6 seconds (longer for reading)
- **Info**: 4 seconds
- **Warning**: 5 seconds
- **Loading**: Infinity (dismiss manually)

### 3. Action Buttons

- Use for recoverable errors (Retry button)
- Use for navigation (View Details button)
- Keep labels short and clear
- Always dismiss toast when action is clicked

### 4. Consistency

- Use same toast type for similar operations
- Maintain consistent messaging patterns
- Follow the same language style across the app

## Examples by Feature

### Authentication

```typescript
// Login success
showSuccessToast("Welcome Back", `Hello ${user.name}!`);

// Login failure
showErrorToast("Login Failed", "Invalid email or password");

// Email verification needed
showWarningToast(
  "Verification Required",
  "Please check your email to verify your account"
);
```

### Payment Operations

```typescript
// Payment account created
showSuccessToast("Account Connected", "PayPal account is now active");

// Payment failed
showErrorToast("Payment Failed", "Unable to process payment. Please try again");

// Loading payment
const loadingId = showLoadingToast("Processing Payment", "Please wait...");
```

### File Operations

```typescript
// Upload success
showSuccessToast("Upload Complete", "Your logo has been updated");

// Upload with progress action
showCustomSuccessToast("Upload Complete", "File uploaded successfully", {
  action: {
    label: "View File",
    onClick: () => openFile(fileId),
  },
});
```

## Accessibility

The custom toast templates include:

- ✅ Proper ARIA attributes
- ✅ Screen reader support
- ✅ Keyboard navigation
- ✅ High contrast colors
- ✅ Focus management

## Migration from Plain Sonner

### Find and Replace Patterns

1. **Basic replacements:**

   - `toast.success()` → `showSuccessToast()`
   - `toast.error()` → `showErrorToast()`
   - `toast.info()` → `showInfoToast()`
   - `toast.warning()` → `showWarningToast()`

2. **With descriptions:**

   - `toast.success(message)` → `showSuccessToast("Success", message)`
   - `toast.error(error)` → `showErrorToast("Error", error)`

3. **Add imports:**

   ```typescript
   // Remove
   import { toast } from "sonner";

   // Add
   import {
     showSuccessToast,
     showErrorToast,
   } from "@/components/toast-templates";
   ```

Remember: Always use the custom toast templates to maintain consistent design and user experience across the application.
