"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CalendarIcon, Plus, Trash2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useInvoiceForm } from "../../context/InvoiceFormProvider";

function InvoiceForm() {
  const {
    state,
    updateInvoiceData,
    updateClientData,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    resetForm,
  } = useInvoiceForm();

  const [openSections, setOpenSections] = useState({
    invoiceDetails: true,
    clientInfo: true,
    invoiceItems: true,
    totals: true,
    additionalDetails: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Invoice Data:", state);
    // Handle form submission
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "invoiceDate" | "paymentDueDate"
  ) => {
    if (date) {
      updateInvoiceData({ [field]: date });
    }
  };

  return (
    <div className="flex flex-col p-3 sm:p-5 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold">
          {state.formMode === "create" ? "Create Invoice" : "Edit Invoice"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to {state.formMode} your invoice
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Invoice Details Section */}
        <Collapsible
          open={openSections.invoiceDetails}
          onOpenChange={() => toggleSection("invoiceDetails")}
        >
          <Card className="border-gray-200 shadow-none rounded-md py-0">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer border-b !pb-0 transition-colors">
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
                <div>
                  <label className="text-sm font-medium">Invoice Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal h-9 rounded-md mt-2",
                          !state.invoiceData.invoiceDate &&
                            "text-muted-foreground"
                        )}
                      >
                        {state.invoiceData.invoiceDate ? (
                          format(state.invoiceData.invoiceDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={state.invoiceData.invoiceDate}
                        onSelect={(date) =>
                          handleDateChange(date, "invoiceDate")
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Payment Due Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal h-9 rounded-md mt-2",
                          !state.invoiceData.paymentDueDate &&
                            "text-muted-foreground"
                        )}
                      >
                        {state.invoiceData.paymentDueDate ? (
                          format(state.invoiceData.paymentDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={state.invoiceData.paymentDueDate}
                        onSelect={(date) =>
                          handleDateChange(date, "paymentDueDate")
                        }
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Terms</label>
                  <Input
                    placeholder="Net 30"
                    value={state.invoiceData.paymentTerms}
                    onChange={(e) =>
                      updateInvoiceData({ paymentTerms: e.target.value })
                    }
                    className="h-9 rounded-md mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Accepted Payment Methods
                  </label>
                  <Input
                    placeholder="Bank Transfer, Credit Card"
                    value={state.invoiceData.acceptedPaymentMethods}
                    onChange={(e) =>
                      updateInvoiceData({
                        acceptedPaymentMethods: e.target.value,
                      })
                    }
                    className="h-9 rounded-md mt-2"
                  />
                </div>
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
                <div>
                  <label className="text-sm font-medium">Client Name</label>
                  <Input
                    placeholder="Client Name"
                    value={state.clientData.name}
                    onChange={(e) => updateClientData({ name: e.target.value })}
                    className="h-9 rounded-md mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Client Email</label>
                  <Input
                    placeholder="client@example.com"
                    type="email"
                    value={state.clientData.email}
                    onChange={(e) =>
                      updateClientData({ email: e.target.value })
                    }
                    className="h-9 rounded-md mt-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Client Address</label>
                  <Textarea
                    placeholder="Client address"
                    value={state.clientData.address}
                    onChange={(e) =>
                      updateClientData({ address: e.target.value })
                    }
                    className="min-h-[80px] mt-2"
                  />
                </div>
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
                        addInvoiceItem();
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
                {state.invoiceItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          updateInvoiceItem(index, {
                            description: e.target.value,
                          })
                        }
                        className="h-9 rounded-md mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateInvoiceItem(index, {
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-9 rounded-md mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Unit Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateInvoiceItem(index, {
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-9 rounded-md mt-2"
                      />
                    </div>

                    <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                      <div className="flex-1">
                        <label className="text-sm font-medium">
                          Total Amount
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.totalAmount}
                          readOnly
                          className="bg-muted h-9 rounded-md mt-2"
                        />
                      </div>

                      {state.invoiceItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeInvoiceItem(index)}
                          className="h-9 rounded-md w-9 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {state.invoiceItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items added yet.</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addInvoiceItem}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                )}
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
                  <CardTitle className="text-base sm:text-lg">Totals</CardTitle>
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
                <div>
                  <label className="text-sm font-medium">Subtotal</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={state.invoiceData.subtotal}
                    readOnly
                    className="bg-muted h-9 rounded-md mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Taxes</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={state.invoiceData.taxes}
                    onChange={(e) =>
                      updateInvoiceData({
                        taxes: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="h-9 rounded-md mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Final Total</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={state.invoiceData.finalTotal}
                    readOnly
                    className="bg-muted font-bold h-9 rounded-md mt-2"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="w-full sm:w-auto"
          >
            Reset Form
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            {state.formMode === "create" ? "Create Invoice" : "Update Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;
