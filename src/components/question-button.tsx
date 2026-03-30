import { QuestionStatus } from "@/lib/enums/question-status";
import { Button } from "@heroui/react";
import React from "react";
import { isDirty } from "zod/v3";

interface Props {
  label: number;
  questionStatus: QuestionStatus;
  onPress?: () => void;
  isActive?: boolean;
}

const questionStatusClasses = {
  [QuestionStatus.NotVisited]:
    "bg-neutral-300 border-3 border-neutral-400 text-neutral-700",
  [QuestionStatus.NotAnswered]:
    "bg-red-300 border-3 border-red-400 text-red-700",
  [QuestionStatus.Answered]:
    "bg-green-300 border-3 border-green-400 text-green-700",
  [QuestionStatus.Marked]:
    "bg-purple-300 border-3 border-purple-400 text-purple-700",
  [QuestionStatus.AnsweredMarked]:
    "bg-indigo-300 border-3 border-indigo-400 text-indigo-700",
};

const QuestionButton = ({
  label,
  questionStatus,
  onPress,
  isActive = false,
}: Props) => {
  return (
    <Button
      size="lg"
      onPress={onPress}
      isIconOnly
      className={
        questionStatusClasses[questionStatus] +
        " " +
        (isActive && "brightness-150")
      }
    >
      {label}
    </Button>
  );
};

export default QuestionButton;
