import z, {
  array,
  discriminatedUnion,
  int,
  literal,
  number,
  object,
  string,
  union,
  uuid,
  xor,
} from "zod";
import { nativeEnum } from "zod/v3";
import { QuestionType } from "../enums/question-type";

const baseQuestionSchema = object({
  id: uuid().optional(),
  qpId: uuid().optional(),
  questionType: nativeEnum(QuestionType),
  questionText: string(),
  marksCorrect: int(),
  order: int().nonnegative(),
  marksIncorrect: int(),
  questionArguments: object(),
  answer: object(),
  solution: string().optional(),
});

export const singleCorrectOptionQuestionArgumentSchema = object({
  options: array(string()).min(2),
});
export const singleCorrectOptionQuestionAnswerSchema = object({
  correctOption: array(number()).min(1),
});
export const singleCorrectOptionQuestionSchema = baseQuestionSchema.extend({
  questionType: literal(QuestionType.SingleCorrectOption),
  questionArguments: singleCorrectOptionQuestionArgumentSchema,
  answer: singleCorrectOptionQuestionAnswerSchema,
});

export const multipleCorrectOptionsQuestionArgumentsSchema = object({
  options: array(string()).min(2),
});
export const multipleCorrectOptionsQuestionAnswerSchema = object({
  correctOptions: array(array(number()).min(1)).min(1),
});
export const multipleCorrectOptionsQuestionSchema = baseQuestionSchema.extend({
  questionType: literal(QuestionType.MultipleCorrectOptions),
  questionArguments: multipleCorrectOptionsQuestionArgumentsSchema,
  answer: multipleCorrectOptionsQuestionAnswerSchema,
});

export const numericalQuestionArgumentsSchema = object({
  precision: int().nonnegative(),
});
export const numericalQuestionAnswerSchema = object({
  correctNumber: array(number()).min(1),
});
export const numericalQuestionSchema = baseQuestionSchema.extend({
  questionType: literal(QuestionType.Numerical),
  questionArguments: numericalQuestionArgumentsSchema,
  answer: numericalQuestionAnswerSchema,
});

export const questionArgumentsSchema = xor([
  singleCorrectOptionQuestionArgumentSchema,
  multipleCorrectOptionsQuestionArgumentsSchema,
  numericalQuestionArgumentsSchema,
]);
export const questionAnswerSchema = xor([
  singleCorrectOptionQuestionAnswerSchema,
  multipleCorrectOptionsQuestionAnswerSchema,
  numericalQuestionAnswerSchema,
]);
export const questionSchema = discriminatedUnion("questionType", [
  singleCorrectOptionQuestionSchema,
  multipleCorrectOptionsQuestionSchema,
  numericalQuestionSchema,
]);

export type QuestionArgumentsJsonType = z.infer<typeof questionArgumentsSchema>;
export type QuestionAnswerJsonType = z.infer<typeof questionAnswerSchema>;
