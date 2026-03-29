import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { InfoIcon } from "@phosphor-icons/react";
import React from "react";

const TestSidebarLegend = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Button isIconOnly>1</Button>
        <p className="text-sm">Not Visited</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button isIconOnly>1</Button>
        <p className="text-sm">Answered</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button isIconOnly>1</Button>
        <p className="text-sm">Not Answered</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button isIconOnly>1</Button>
        <p className="text-sm">Marked for Review</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button isIconOnly>1</Button>
        <p className="text-sm">Answered & Marked for Review</p>
      </div>
    </div>
  );
};

const TestSidebar = () => {
  return (
    <div className="bg-yellow-200 p-2 flex md:flex-col gap-4 md:w-md">
      <div className="flex gap-1 flex-nowrap md:flex-wrap overflow-x-auto">
        {Array.from(Array(10).keys()).map((key) => (
          <Button isIconOnly key={key}>
            {key + 1}
          </Button>
        ))}
      </div>
      <div className="ml-auto md:ml-0">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button isIconOnly className="md:hidden">
              <InfoIcon size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2">
              <TestSidebarLegend />
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block">
          <TestSidebarLegend />
        </div>
      </div>
    </div>
  );
};

export default TestSidebar;
