import MarkdownRenderer from "@/components/markdown-renderer";
import {
  Checkbox,
  CheckboxGroup,
  NumberInput,
  Radio,
  RadioGroup,
} from "@heroui/react";
import React, { useContext } from "react";
import {
  ActiveTestContext,
  UnifiedTestContext,
  UnifiedTestResponse,
} from "../page";
import { QuestionType } from "@/lib/enums/question-type";
import { Controller, useFormContext } from "react-hook-form";
import { singleCorrectOptionQuestionArgumentSchema } from "@/lib/zod/questions";
import z from "zod";

const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.

$\\dfrac{8}{4} = 2$
`;

const TestContent = () => {
  const unifiedTestElement = useContext(UnifiedTestContext);
  const questions = unifiedTestElement?.questionList;

  const [activeElement, setActiveElement] = useContext(ActiveTestContext);

  const activeQuestion = questions[activeElement];
  const currentResponse = unifiedTestElement.responsesList[activeElement];

  const { control, getValues, watch } = useFormContext<UnifiedTestResponse>();

  const formValue = watch();

  return (
    <div className="overflow-auto h-full w-full p-2 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Question {activeElement + 1}</h2>
      <MarkdownRenderer content={activeQuestion.questionText} />

      <h3 className="text-sm font-semibold">Enter your response below:</h3>
      {activeQuestion.questionType === QuestionType.SingleCorrectOption && (
        <Controller
          control={control}
          name="answer.selectedOption"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <RadioGroup
              ref={ref}
              value={`${value}`}
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              onBlur={onBlur}
              onChange={(e) => onChange(+e.target.value)}
            >
              {(
                activeQuestion.questionArguments as z.infer<
                  typeof singleCorrectOptionQuestionArgumentSchema
                >
              ).options.map((option, index) => (
                <Radio key={option} value={`${index}`}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          )}
        />
      )}
      {/* 
      <RadioGroup>
        <Radio value={"0"}>Radio 1</Radio>
        <Radio value={"1"}>Radio 2</Radio>
        <Radio value={"2"}>Radio 3</Radio>
        <Radio value={"3"}>Radio 4</Radio>
      </RadioGroup>

      <CheckboxGroup>
        <Checkbox value={"0"}>Checkbox 1</Checkbox>
        <Checkbox value={"1"}>Checkbox 2</Checkbox>
        <Checkbox value={"2"}>Checkbox 3</Checkbox>
        <Checkbox value={"3"}>Checkbox 4</Checkbox>
      </CheckboxGroup>

      <NumberInput placeholder="Enter a numeric value" /> */}
    </div>
  );
};

export default TestContent;
