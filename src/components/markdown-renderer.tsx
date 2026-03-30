import React from "react";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        ol(props) {
          const { children, className, ...rest } = props;

          return (
            <ul {...rest} className={className + " list-inside list-decimal"}>
              {children}
            </ul>
          );
        },
        ul(props) {
          const { children, className, ...rest } = props;

          return (
            <ul {...rest} className={className + " list-inside list-disc"}>
              {children}
            </ul>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
