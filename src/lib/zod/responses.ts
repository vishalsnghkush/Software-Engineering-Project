import z, {
  array,
  boolean,
  date,
  int,
  literal,
  number,
  object,
  uuid,
  xor,
} from "zod";
import { QuestionType } from "../enums/question-type";

const baseResponseSchema = object({
  id: uuid().optional(),
  sessionId: uuid().optional(),
  questionId: uuid().optional(),
  responseValue: object(),
  responseType: int(),
  attemptedAt: date().optional(),
  marked: boolean(),
  timeTaken: int().optional(),
});

export const singleCorrectOptionResponseValueSchema = object({
  selectedOption: int(),
});
export const singleCorrectOptionResponseSchema = baseResponseSchema.extend({
  responseType: literal(QuestionType.SingleCorrectOption),
  responseValue: singleCorrectOptionResponseValueSchema,
});

export const multipleCorrectOptionsResponseValueSchema = object({
  selectedOptions: array(int()).min(1),
});
export const multipleCorrectOptionsResponseSchema = object({
  responseType: literal(QuestionType.MultipleCorrectOptions),
  responseValue: multipleCorrectOptionsResponseValueSchema,
});

export const numericalResponseValueSchema = object({
  numberEntered: number(),
});
export const numericalResponseSchema = object({
  responseType: literal(QuestionType.Numerical),
  responseValue: numericalResponseValueSchema,
});

export const ResponseValueSchema = xor([
  singleCorrectOptionResponseValueSchema,
  multipleCorrectOptionsResponseValueSchema,
  numericalResponseValueSchema,
]);

export type ResponseValueJsonType = z.infer<typeof ResponseValueSchema>;
