"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
// @ts-ignore
import type { CodeProps } from "react-markdown/lib/ast-to-react";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("css", css);

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }: CodeProps) {
          const [copied, setCopied] = useState(false);
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (inline || !match) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          const handleCopy = () => {
            navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          };

          return (
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 z-10 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <SyntaxHighlighter
                language={match[1]}
                style={oneDark}
                PreTag="div"
                className="prose code-block"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
