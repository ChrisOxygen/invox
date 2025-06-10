"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CalendarIcon, Plus, Trash2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Invoice schema
const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
  amount: z.number().min(0, "Amount must be positive"),
});

const invoiceSchema = z.object({
  // Invoice Details
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  status: z.enum(["draft", "sent", "paid", "overdue"]),

  // Client Information
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientPhone: z.string().optional(),

  // Company Information
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Valid company email is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyPhone: z.string().optional(),

  // Invoice Items
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),

  // Additional Details
  notes: z.string().optional(),
  terms: z.string().optional(),

  // Totals
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

function InvoiceForm() {
  const [openSections, setOpenSections] = useState({
    invoiceDetails: true,
    companyInfo: true,
    clientInfo: true,
    invoiceItems: true,
    totals: true,
    additionalDetails: false,
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: "draft",
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      tax: 0,
      total: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      return sum + amount;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    form.setValue("subtotal", subtotal);
    form.setValue("tax", tax);
    form.setValue("total", total);

    // Update individual item amounts
    watchedItems.forEach((item, index) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      form.setValue(`items.${index}.amount`, amount);
    });
  }, [watchedItems, form]);

  const onSubmit = (data: InvoiceFormData) => {
    console.log(data);
    // Handle form submission
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col p-3 sm:p-5 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold">Create Invoice</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to create your invoice
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          {/* Invoice Details Section */}
          <Collapsible
            open={openSections.invoiceDetails}
            onOpenChange={() => toggleSection("invoiceDetails")}
          >
            <Card className="border-gray-200 shadow-none rounded-md  py-0">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer border-b !pb-0  transition-colors">
                  <div className="flex items-center py-2 justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Invoice Details
                    </CardTitle>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections.invoiceDetails && "transform rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-0 pb-6">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Invoice Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="INV-001"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 rounded-md">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm">Issue Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-9 rounded-md",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm">Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-9 rounded-md",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Company Information Section */}
          <Collapsible
            open={openSections.companyInfo}
            onOpenChange={() => toggleSection("companyInfo")}
          >
            <Card className="border-gray-200 shadow-none rounded-md py-0">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer border-b !pb-0 transition-colors">
                  <div className="flex items-center py-2 justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Company Information
                    </CardTitle>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections.companyInfo && "transform rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-0 pb-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company Name"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Company Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="company@example.com"
                            type="email"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm">
                          Company Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Company address"
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Company Phone (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Client Information Section */}
          <Collapsible
            open={openSections.clientInfo}
            onOpenChange={() => toggleSection("clientInfo")}
          >
            <Card className="border-gray-200 shadow-none rounded-md py-0">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer border-b !pb-0 transition-colors">
                  <div className="flex items-center py-2 justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Client Information
                    </CardTitle>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections.clientInfo && "transform rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-0 pb-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Client Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Client Name"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Client Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="client@example.com"
                            type="email"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientAddress"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm">
                          Client Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Client address"
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Client Phone (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            {...field}
                            className="h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Invoice Items Section */}
          <Collapsible
            open={openSections.invoiceItems}
            onOpenChange={() => toggleSection("invoiceItems")}
          >
            <Card className="border-gray-200 shadow-none rounded-md py-0">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer border-b !pb-0 transition-colors">
                  <div className="flex items-center py-2 justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Invoice Items
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          append({
                            description: "",
                            quantity: 1,
                            rate: 0,
                            amount: 0,
                          });
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openSections.invoiceItems && "transform rotate-180"
                        )}
                      />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 sm:space-y-4 pt-0 pb-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2 lg:col-span-2">
                            <FormLabel className="text-sm">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Item description"
                                {...field}
                                className="h-9 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-9 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.rate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Rate</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-9 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.amount`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-sm">Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  readOnly
                                  className="bg-muted h-9 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            className="h-9 rounded-md w-9 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Totals Section */}
          <Collapsible
            open={openSections.totals}
            onOpenChange={() => toggleSection("totals")}
          >
            <Card className="border-gray-200 shadow-none rounded-md py-0">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer border-b !pb-0 transition-colors">
                  <div className="flex items-center py-2 justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Totals
                    </CardTitle>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections.totals && "transform rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-0 pb-6">
                  <FormField
                    control={form.control}
                    name="subtotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Subtotal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            readOnly
                            className="bg-muted h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Tax (10%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            readOnly
                            className="bg-muted h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Total</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            readOnly
                            className="bg-muted font-bold h-9 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Additional Details Section */}
          <Collapsible
            open={openSections.additionalDetails}
            onOpenChange={() => toggleSection("additionalDetails")}
          >
            <Card className="border-gray-200 shadow-none rounded-md py-0">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer border-b !pb-0 transition-colors">
                  <div className="flex items-center py-2 justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Additional Details
                    </CardTitle>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections.additionalDetails && "transform rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 sm:space-y-4 pt-0 pb-6">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes..."
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Terms & Conditions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Payment terms and conditions..."
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Save as Draft
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Create Invoice
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default InvoiceForm;
