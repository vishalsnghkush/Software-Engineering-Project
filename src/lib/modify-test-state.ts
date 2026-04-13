import {
  UnifiedTestElement,
  UnifiedTestResponse,
} from "@/app/test/[slug]/page";
import { UseFormReturn } from "react-hook-form";
import { TestActions } from "./enums/test-actions";
import { updateTestResponse } from "@/actions/update-test-response";
import { mutate } from "swr";
import { submitTest } from "@/actions/submit-test";
import { redirect } from "next/navigation";
import { DEFAULT_LOGGEDUSER_REDIRECT } from "../../routes";

export const modifyTestState = (
  methods: UseFormReturn<UnifiedTestResponse>,
  activeElementState: [any, React.Dispatch<React.SetStateAction<any>>],
  timeSpentState: [number, React.Dispatch<React.SetStateAction<number>>],
  unifiedTestElement: UnifiedTestElement,
  action: TestActions,
  payload?: { newQuestionIndex: number },
) => {
  const [activeElement, setActiveElement] = activeElementState;
  const [timeSpent, setTimeSpent] = timeSpentState;

  const currentQuestion = unifiedTestElement.questionList[activeElement];
  const currentResponse = unifiedTestElement.responsesList[activeElement];
  const formResponse = methods.getValues("answer");

  console.log("Both are ", currentQuestion.id === currentResponse.questionId);

  console.log(currentQuestion);

  if ([TestActions.MarkAndNext, TestActions.SaveAndNext].includes(action)) {
    const marked =
      action === TestActions.MarkAndNext
        ? !currentResponse.marked
        : currentResponse.marked;

    const formResponse = methods.getValues("answer");
    updateTestResponse(currentResponse.id, timeSpent, formResponse, marked);

    const questionLength = unifiedTestElement.questionList.length;

    const newIndex =
      activeElement + 1 >= questionLength ? activeElement : activeElement + 1;
    mutate(`/api/test-init?slug=${unifiedTestElement.questionPaper.id}`).then(
      () => {
        console.log("mutated for save/mark");
      },
    );

    methods.reset();
    setActiveElement(newIndex);
    setTimeSpent(0);
  } else if (action === TestActions.SelectQuestion) {
    updateTestResponse(currentResponse.id, timeSpent, undefined, undefined);

    const newIndex = payload?.newQuestionIndex;
    console.log(unifiedTestElement.questionPaper.id);

    mutate(`/api/test-init?slug=${unifiedTestElement.questionPaper.id}`).then(
      () => {
        console.log("mutated for select q");
      },
    );
    methods.reset();

    setActiveElement(newIndex);
    setTimeSpent(0);
  } else if (action === TestActions.Clear) {
    updateTestResponse(currentResponse.id, timeSpent, null, false);
    mutate(`/api/test-init?slug=${unifiedTestElement.questionPaper.id}`).then(
      () => {
        console.log("mutated for clear");
      },
    );

    setTimeSpent(0);

    methods.setValue("answer", null);
  } else if (action === TestActions.SubmitTest) {
    submitTest(unifiedTestElement.questionPaper.id);
    methods.reset();
  }
};
