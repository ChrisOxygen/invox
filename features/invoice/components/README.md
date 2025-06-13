# Invoice Items Form Component

A comprehensive, controlled React Hook Form component for managing invoice line items with dynamic add/remove functionality, real-time calculations, and searchable item descriptions.

## Features

- **Dynamic Line Items**: Add/remove invoice items with useFieldArray
- **Searchable Descriptions**: Smart dropdown with common descriptions + custom input
- **Real-time Calculations**: Auto-calculate totals as you type
- **Form Validation**: Built-in validation with Zod schemas
- **Responsive Design**: Mobile-first responsive grid layout
- **Accessible UI**: Full keyboard navigation and screen reader support
- **Black/White Theme**: Clean monochrome design with custom fonts

## Components

### 1. InvoiceItemsForm

The main component that handles the dynamic array of invoice items.

```tsx
import { InvoiceItemsForm } from "@/features/invoice/components";

// Must be used within a FormProvider context
<FormProvider {...form}>
  <InvoiceItemsForm />
</FormProvider>;
```

### 2. ItemDescriptionSelect

A searchable dropdown for selecting item descriptions.

```tsx
<ItemDescriptionSelect
  value={description}
  onChange={setDescription}
  placeholder="Select or type description..."
  disabled={false}
/>
```

### 3. ItemDescriptionForm

Modal form for adding custom item descriptions.

```tsx
<ItemDescriptionForm
  open={isOpen}
  onOpenChange={setIsOpen}
  onSuccess={(description) => console.log(description)}
  mode="create"
/>
```

## Usage Examples

### Basic Usage with React Hook Form

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceItemsForm } from "@/features/invoice/components";
import { invoiceItemsFormSchema } from "@/dataSchemas/invoice";

function MyInvoiceForm() {
  const form = useForm({
    resolver: zodResolver(invoiceItemsFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = (data) => {
    console.log("Invoice items:", data.items);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InvoiceItemsForm />
        <button type="submit">Save Invoice</button>
      </form>
    </FormProvider>
  );
}
```

### Complete Invoice Form

```tsx
import { CompleteInvoiceForm } from "@/features/invoice/components";

// Full invoice form with client, dates, and items
function CreateInvoicePage() {
  return <CompleteInvoiceForm />;
}
```

## Data Structure

### Invoice Item Schema

```typescript
{
  id?: string;              // Optional for new items
  description: string;      // Required, 1-200 characters
  quantity: number;         // Required, 1-9999
  unitPrice: number;        // Required, 0.01-999999.99
  totalAmount: number;      // Auto-calculated, read-only
}
```

### Form Data

```typescript
{
  items: InvoiceItemFormData[];  // Array of 1-50 items
}
```

## Features Detail

### 1. Dynamic Field Management

- Uses React Hook Form's `useFieldArray` for optimal performance
- Add/remove items with validation
- Minimum 1 item, maximum 50 items per invoice
- Auto-adds first item when form is empty

### 2. Real-time Calculations

- Automatically calculates `totalAmount = quantity × unitPrice`
- Updates grand total as items change
- Uses `watch` for efficient reactivity
- Rounds to 2 decimal places for currency

### 3. Smart Item Selection

- **Common Descriptions**: Pre-populated dropdown with 20+ common service descriptions
- **Search & Filter**: Real-time search with 300ms debounce
- **Direct Input**: Type custom descriptions directly
- **Custom Form**: Modal form for adding detailed custom descriptions
- **Keyboard Navigation**: Full keyboard support with Enter/Escape

### 4. Responsive Design

```scss
// Mobile: Stack vertically
.grid-cols-1

// Desktop: 12-column grid
.md:grid-cols-12 {
  description: 5 columns
  quantity: 2 columns
  price: 2 columns
  total: 2 columns
  remove: 1 column
}
```

### 5. Form Validation

- **Required Fields**: Description, quantity, unit price
- **Number Validation**: Positive numbers only
- **Range Limits**: Quantity (1-9999), Price (0.01-999999.99)
- **Array Limits**: 1-50 items per invoice
- **Real-time Feedback**: Inline error messages

## Integration Notes

### Required Dependencies

- `react-hook-form` ^7.57.0
- `@hookform/resolvers` ^5.0.1
- `zod` ^3.25.48
- `lucide-react` ^0.511.0
- Shadcn UI components

### Form Context Required

The `InvoiceItemsForm` must be used within a `FormProvider` context from React Hook Form.

### Schema Integration

Import and use the provided Zod schemas for type safety:

```typescript
import {
  invoiceItemSchema,
  invoiceItemsFormSchema,
  InvoiceItemInput,
  InvoiceItemsFormInput,
} from "@/dataSchemas/invoice";
```

## Styling

Uses Tailwind CSS with a black/white/gray color palette:

- `bg-gray-50` - Read-only field backgrounds
- `text-gray-700` - Muted text
- `border-gray-200` - Subtle borders
- `hover:bg-gray-100` - Interactive states

## Accessibility

- **Keyboard Navigation**: Tab through all fields, Enter to select
- **Screen Readers**: Proper labels and ARIA attributes
- **Focus Management**: Logical tab order and focus indicators
- **Error States**: Clear error messages linked to fields

## Demo Components

Two demo components are included:

1. **InvoiceItemsFormDemo**: Simple items-only form
2. **CompleteInvoiceForm**: Full invoice with client, dates, and items

Run these to see the components in action and understand integration patterns.
