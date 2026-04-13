"use client";

import TestHeader from "@/app/test/[slug]/_components/test-header";
import React, { createContext, use, useEffect, useState } from "react";
import TestSidebar from "./_components/test-sidebar";
import TestFooter from "./_components/test-footer";
import TestContent from "./_components/test-content";
import useSWR, { Fetcher } from "swr";
import { QuestionPaper } from "@/db/schema/questionPapers";
import { Question } from "@/db/schema/questions";
import { TestSession } from "@/db/schema/testSession";
import { Response } from "@/db/schema/responses";
import { Spinner } from "@heroui/react";
import { Form, FormProvider, useForm } from "react-hook-form";
import z, { boolean, object } from "zod";
import { ResponseValueSchema } from "@/lib/zod/responses";

export interface UnifiedTestElement {
  questionPaper: QuestionPaper;
  questionList: Question[];
  testSession: TestSession;
  responsesList: Response[];
}

const UnifiedTestResponseSchema = object({
  answer: ResponseValueSchema.nullable(),
});

export type UnifiedTestResponse = z.infer<typeof UnifiedTestResponseSchema>;

export const UnifiedTestContext = createContext<UnifiedTestElement>(
  null as any,
);

export const ActiveTestContext = createContext<
  [any, React.Dispatch<React.SetStateAction<any>>]
>(null as any);

export const TimeSpentContext = createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>(null as any);

const TestPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [error, setError] = useState<string | null>(null);

  const activeElementState = useState(0);
  const timeSpentState = useState(0);
  const [timeSpent, setTimeSpent] = timeSpentState;

  const slug = use(params);

  const fetcher: Fetcher<UnifiedTestElement> = (
    ...args: Parameters<typeof fetch>
  ) => fetch(...args).then((res) => res.json());

  const { data, isLoading } = useSWR(
    `/api/test-init?slug=${slug.slug}`,
    fetcher,
    {
      // refreshInterval: 1000,
      onError: () => {
        setError("Network error detected!");
      },
      onSuccess: () => {
        setError(null);
      },
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeSpent((e) => e + 1);
    }, 1000);

    return () => clearTimeout(timer);
  });

  const methods = useForm<UnifiedTestResponse>();
  const onSubmit = methods.handleSubmit((data) => {});

  useEffect(() => {
    console.log("Refreshed");

    // if (data) {
    //   methods.setValue(
    //     "answer",
    //     data.responsesList[activeElementState[0]].responseValue,
    //   );
    // } else {
    //   methods.resetField("answer");
    // }
    const responseData = data
      ? data.responsesList[activeElementState[0]].responseValue
      : null;
    methods.setValue("answer", responseData);
  }, [data, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  if (data == null) {
    return (
      <div>
        <p>Encountered an error</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <TimeSpentContext.Provider value={timeSpentState}>
        <UnifiedTestContext.Provider value={data}>
          <ActiveTestContext.Provider value={activeElementState}>
            <form onSubmit={onSubmit}>
              <section className="h-screen flex flex-col">
                <TestHeader />
                <section className="flex-1 h-full flex flex-col-reverse md:flex-row overflow-y-auto">
                  <TestContent />
                  <TestSidebar />
                </section>
                <TestFooter />
              </section>
            </form>
          </ActiveTestContext.Provider>
        </UnifiedTestContext.Provider>
      </TimeSpentContext.Provider>
    </FormProvider>
  );
};

export default TestPage;
