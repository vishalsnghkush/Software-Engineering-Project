import { Chip, Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import { TimerIcon } from "@phosphor-icons/react";
import React, { useContext, useEffect, useState } from "react";
import {
  ActiveTestContext,
  TimeSpentContext,
  UnifiedTestContext,
  UnifiedTestResponse,
} from "../page";
import { getCurrentTime } from "@/actions/get-current-time";
import { modifyTestState } from "@/lib/modify-test-state";
import { useFormContext } from "react-hook-form";
import { TestActions } from "@/lib/enums/test-actions";

const TestHeader = () => {
  const unifiedTestElement = useContext(UnifiedTestContext);
  const methods = useFormContext<UnifiedTestResponse>();

  const activeElementState = useContext(ActiveTestContext);
  const title = unifiedTestElement?.questionPaper.subject;

  const [timeLeft, setTimeLeft] = useState(999999);

  const timeSpentState = useContext(TimeSpentContext);
  const [timeSpent, setTimeSpent] = timeSpentState;

  useEffect(() => {
    getCurrentTime().then((e) =>
      setTimeLeft(
        Math.floor(
          (new Date(unifiedTestElement.questionPaper.createdAt).getTime() +
            unifiedTestElement.questionPaper.timeLimit * 1000 -
            e) /
            1000,
        ),
      ),
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft >= 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        modifyTestState(
          methods,
          activeElementState,
          timeSpentState,
          unifiedTestElement,
          TestActions.SubmitTest,
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarItem>
          <h1>{title}</h1>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Chip
          startContent={<TimerIcon size={20} />}
          className="pl-2"
          color="warning"
          variant="bordered"
        >
          {Math.floor(timeLeft / 60) < 10 && "0"}
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 && "0"}
          {timeLeft % 60}
        </Chip>
      </NavbarContent>
    </Navbar>
  );
};

export default TestHeader;
