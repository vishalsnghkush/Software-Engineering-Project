import {
  Checkbox,
  CheckboxGroup,
  NumberInput,
  Radio,
  RadioGroup,
} from "@heroui/react";
import React from "react";

const TestContent = () => {
  return (
    <div className="bg-red-200 overflow-auto h-full w-full p-2 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Question 1</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>

      <h3 className="text-sm font-semibold">Enter your response below:</h3>

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

      <NumberInput placeholder="Enter a numeric value" />
    </div>
  );
};

export default TestContent;
