import { Button } from "@heroui/react";
import React, { useContext } from "react";
import {
  ActiveTestContext,
  TimeSpentContext,
  UnifiedTestContext,
  UnifiedTestResponse,
} from "../page";
import { useFormContext } from "react-hook-form";
import { modifyTestState } from "@/lib/modify-test-state";
import { TestActions } from "@/lib/enums/test-actions";

const TestFooter = () => {
  const unifiedTestElement = useContext(UnifiedTestContext);

  const methods = useFormContext<UnifiedTestResponse>();

  const activeElementState = useContext(ActiveTestContext);
  const timeSpentState = useContext(TimeSpentContext);

  return (
    <div className="bg-foreground-50 flex flex-col md:flex-row gap-2 p-2 w-full">
      <div className="flex gap-2 w-full">
        <Button
          className="flex-1 md:flex-0 bg-red-400 text-white"
          onPress={() =>
            modifyTestState(
              methods,
              activeElementState,
              timeSpentState,
              unifiedTestElement,
              TestActions.Clear,
            )
          }
        >
          Clear
        </Button>
        <Button
          className="flex-1 md:flex-initial md:w-28 bg-purple-400 text-white"
          onPress={() =>
            modifyTestState(
              methods,
              activeElementState,
              timeSpentState,
              unifiedTestElement,
              TestActions.MarkAndNext,
            )
          }
        >
          Mark & Next
        </Button>
        <Button
          className="flex-1 md:flex-initial md:w-28 md:ml-auto bg-green-400 text-white"
          onPress={() =>
            modifyTestState(
              methods,
              activeElementState,
              timeSpentState,
              unifiedTestElement,
              TestActions.SaveAndNext,
            )
          }
        >
          Save & Next
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-2 bg-cyan-400 text-white"
          onPress={() =>
            modifyTestState(
              methods,
              activeElementState,
              timeSpentState,

              unifiedTestElement,
              TestActions.SubmitTest,
            )
          }
        >
          Submit Test
        </Button>
      </div>
    </div>
  );
};

export default TestFooter;
