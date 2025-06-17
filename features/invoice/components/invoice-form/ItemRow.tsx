import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";

import { Input } from "@/components/ui/input";
import { useInvoiceForm } from "../../context/InvoiceFormProvider";
import { toDollar } from "@/utils";

import { useGetItems } from "@/hooks/items";
import InBoxLoader from "@/components/InBoxLoader";
import { Item } from "@prisma/client";
import ItemsDropdownList from "./ItemsDropdownList";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ItemForm from "../ItemForm";

type ItemRowProps = {
  item: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  };
  index: number;
};

function ItemRow({ item, index }: ItemRowProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasSelectedItem, setHasSelectedItem] = useState(false);
  const { removeInvoiceItem, updateInvoiceItem } = useInvoiceForm();
  const { items, isPending: isGettingItems } = useGetItems();

  const descInputRef = useRef<HTMLInputElement | null>(null);
  const itemsPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the popover element
      if (
        itemsPopoverRef.current &&
        !itemsPopoverRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };

    // Add event listener when popover is open
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  const clearSelectedItem = () => {
    updateInvoiceItem(index, {
      description: "",
      unitPrice: 0,
    });
    setHasSelectedItem(false);
    setTimeout(() => {
      descInputRef.current?.focus();
    }, 0);
  };

  const itemsExist = items && items.length > 0;

  const onSelectItem = (item: Item) => {
    updateInvoiceItem(index, {
      description: item.name,
      unitPrice: item.unitPrice || 0,
    });
    setPopoverOpen(false);
    setHasSelectedItem(true);
  };

  const handleFormSuccess = (item: Item) => {
    onSelectItem(item);
  };

  return (
    <div className=" py-1 w-full items-center grid grid-cols-[minmax(200px,1fr)_minmax(20px,60px)_minmax(50px,90px)_minmax(50px,90px)_30px] gap-4">
      <div className=" relative">
        <div className="relative">
          <Input
            ref={descInputRef}
            disabled={hasSelectedItem}
            onFocus={() => {
              setPopoverOpen(true);
            }}
            className="w-full"
            value={item.description}
            onChange={(e) => {
              updateInvoiceItem(index, { description: e.target.value });
            }}
            placeholder="Item description"
          />
          {hasSelectedItem && (
            <button
              className="absolute top-1/2 right-2 cursor-pointer -translate-y-1/2 text-xl text-gray-500 hover:text-red-700"
              onClick={clearSelectedItem}
            >
              <IoIosCloseCircleOutline />
            </button>
          )}
        </div>
        {popoverOpen && (
          <div
            ref={itemsPopoverRef}
            className="w-full absolute top-[calc(100%+8px)] z-20 bg-white rounded-lg border shadow p-2 h-50"
          >
            <div className=" flex flex-col h-full">
              {isGettingItems ? (
                <InBoxLoader />
              ) : itemsExist ? (
                <div className="flex flex-col h-full justify-between gap-4">
                  <ItemsDropdownList
                    items={items}
                    onSelectItem={onSelectItem}
                  />
                  <div className=" border-t mt-auto pt-2">
                    <Button
                      variant="ghost"
                      className=""
                      onClick={() => {
                        setIsFormOpen(true);
                      }}
                    >
                      <span className="">
                        <MdAddCircleOutline />
                      </span>
                      Add New Item
                    </Button>
                  </div>
                </div>
              ) : (
                <div className=" flex flex-col items-center p-4 gap-5">
                  <span className="text-gray-500">
                    You haven&apos;t added any items
                  </span>
                  <Button
                    variant="outline"
                    className=""
                    onClick={() => {
                      setIsFormOpen(true);
                    }}
                  >
                    Add Item
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Input
        type="number"
        className="w-full text-center"
        value={item.quantity}
        onChange={(e) =>
          updateInvoiceItem(index, {
            quantity: parseFloat(e.target.value),
          })
        }
        placeholder="Quantity"
      />
      <Input
        type="number"
        className="w-full"
        value={item.unitPrice}
        onChange={(e) =>
          updateInvoiceItem(index, {
            unitPrice: parseFloat(e.target.value),
          })
        }
        placeholder="Unit Price"
      />
      <span className="capitalize  font-bold text-gray-400">
        {toDollar(
          item.quantity && item.unitPrice ? item.quantity * item.unitPrice : 0
        )}
      </span>

      <span className="flex justify-self-center transition-all  items-center">
        {index >= 1 && (
          <button
            className="text-black hover:text-red-700"
            onClick={() => removeInvoiceItem(index)}
          >
            <FaRegTrashCan />
          </button>
        )}
      </span>

      {/* Client Form Dialog */}
      <ItemForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        mode="create"
      />
    </div>
  );
}

export default ItemRow;
