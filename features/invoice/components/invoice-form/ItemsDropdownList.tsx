import { ScrollArea } from "@/components/ui/scroll-area";
import { toDollar } from "@/utils";
import { Item } from "@prisma/client";

type ItemsDropdownListProps = {
  items: Item[];
  onSelectItem: (item: Item) => void;
};

const ItemsDropdownList = ({ items, onSelectItem }: ItemsDropdownListProps) => {
  return (
    <ul className=" flex flex-col">
      <ScrollArea className="h-[120px] pr-2">
        {items.map((item) => (
          <li
            key={item.id}
            className=" py-3 px-2 flex items-center justify-between rounded cursor-pointer hover:bg-gray-100 text-gray-700"
            onClick={() => onSelectItem(item)}
          >
            <span className=" font-bold capitalize">{item.name}</span>
            <span className="">
              {" "}
              - {item.unitPrice && toDollar(item.unitPrice)}
            </span>
          </li>
        ))}
      </ScrollArea>
    </ul>
  );
};

export default ItemsDropdownList;
