import QuestionButton from "@/components/question-button";
import { QuestionStatus } from "@/lib/enums/question-status";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { InfoIcon } from "@phosphor-icons/react";
import React from "react";

const TestSidebarLegend = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <QuestionButton label={1} questionStatus={QuestionStatus.NotVisited} />
        <p className="text-sm">Not Visited</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton label={2} questionStatus={QuestionStatus.NotAnswered} />
        <p className="text-sm">Answered</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton label={3} questionStatus={QuestionStatus.Answered} />
        <p className="text-sm">Not Answered</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton label={4} questionStatus={QuestionStatus.Marked} />
        <p className="text-sm">Marked for Review</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton
          label={5}
          questionStatus={QuestionStatus.AnsweredMarked}
        />
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
          <QuestionButton
            key={key}
            isActive={key == 0}
            label={key + 1}
            questionStatus={key % 5}
          />
        ))}
      </div>
      <div className="ml-auto md:ml-0">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button size="lg" isIconOnly className="md:hidden">
              <InfoIcon size={24} />
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
