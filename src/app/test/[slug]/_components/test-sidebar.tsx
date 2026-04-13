import QuestionButton from "@/components/question-button";
import { QuestionStatus } from "@/lib/enums/question-status";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { InfoIcon } from "@phosphor-icons/react";
import React, { useContext, useEffect } from "react";
import {
  ActiveTestContext,
  TimeSpentContext,
  UnifiedTestContext,
  UnifiedTestResponse,
} from "../page";
import { modifyTestState } from "@/lib/modify-test-state";
import { useFormContext } from "react-hook-form";
import { TestActions } from "@/lib/enums/test-actions";
import { Response } from "@/db/schema/responses";

const getQuestionButtonStatus = (response: Response) => {
  if (!response.attemptedAt) return QuestionStatus.NotVisited;
  if (!response.marked) {
    if (response.responseValue === null) return QuestionStatus.NotAnswered;
    else return QuestionStatus.Answered;
  } else {
    if (response.responseValue === null) return QuestionStatus.Marked;
    else return QuestionStatus.AnsweredMarked;
  }
};

const TestSidebarLegend = ({ legendData }: { legendData: number[] }) => {
  const notVisitedCount = legendData.reduce(
    (acc, data) => (data === QuestionStatus.NotVisited ? acc + 1 : acc),
    0,
  );
  const notAnsweredCount = legendData.reduce(
    (acc, data) => (data === QuestionStatus.NotAnswered ? acc + 1 : acc),
    0,
  );
  const answeredCount = legendData.reduce(
    (acc, data) => (data === QuestionStatus.Answered ? acc + 1 : acc),
    0,
  );
  const markedCount = legendData.reduce(
    (acc, data) => (data === QuestionStatus.Marked ? acc + 1 : acc),
    0,
  );
  const answeredMarkedCount = legendData.reduce(
    (acc, data) => (data === QuestionStatus.AnsweredMarked ? acc + 1 : acc),
    0,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <QuestionButton
          label={notVisitedCount}
          questionStatus={QuestionStatus.NotVisited}
        />
        <p className="text-sm">Not Visited</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton
          label={notAnsweredCount}
          questionStatus={QuestionStatus.NotAnswered}
        />
        <p className="text-sm">Not Answered</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton
          label={answeredCount}
          questionStatus={QuestionStatus.Answered}
        />
        <p className="text-sm">Answered</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton
          label={markedCount}
          questionStatus={QuestionStatus.Marked}
        />
        <p className="text-sm">Marked for Review</p>
      </div>
      <div className="flex gap-2 items-center">
        <QuestionButton
          label={answeredMarkedCount}
          questionStatus={QuestionStatus.AnsweredMarked}
        />
        <p className="text-sm">Answered & Marked for Review</p>
      </div>
    </div>
  );
};

const TestSidebar = () => {
  const unifiedTestElement = useContext(UnifiedTestContext);
  const questions = unifiedTestElement?.questionList;
  const responses = unifiedTestElement?.responsesList;

  const methods = useFormContext<UnifiedTestResponse>();

  const timeSpentState = useContext(TimeSpentContext);
  const activeElementState = useContext(ActiveTestContext);
  const [activeElement, setActiveElement] = activeElementState;

  const legendData = responses.map((response) =>
    getQuestionButtonStatus(response),
  );

  useEffect(() => {
    console.log("Sidebar refreshed");
  }, [unifiedTestElement, activeElementState]);

  return (
    <div className="bg-foreground-100 p-2 flex md:flex-col gap-4 md:w-md">
      <div className="flex gap-1 flex-nowrap md:flex-wrap overflow-x-auto">
        {questions.map((key, index) => (
          <QuestionButton
            key={key.id}
            isActive={key.order === activeElement}
            label={key.order + 1}
            questionStatus={getQuestionButtonStatus(responses[index])}
            onPress={() => {
              if (key.order !== activeElement) {
                modifyTestState(
                  methods,
                  activeElementState,
                  timeSpentState,
                  unifiedTestElement,
                  TestActions.SelectQuestion,
                );
                setActiveElement(index);
              }
            }}
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
              <TestSidebarLegend legendData={legendData} />
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block">
          <TestSidebarLegend legendData={legendData} />
        </div>
      </div>
    </div>
  );
};

export default TestSidebar;
