import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStars } from "../helper";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";

const Answer = ({ ans, totalResult, index, type, className = "" }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStars(ans));
    }
  }, []);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          language={match[1]}
          style={dark}
          preTag="div"
          className="rounded-lg text-sm"
        />
      ) : (
        <code
          {...props}
          className={`${className} bg-zinc-800 px-1.5 py-0.5 rounded`}
        >
          {children}
        </code>
      );
    },
    p({ node, children }) {
      return <p className="mb-2 last:mb-0">{children}</p>;
    },
    ul({ node, children }) {
      return <ul className="list-disc pl-5 mb-2">{children}</ul>;
    },
    ol({ node, children }) {
      return <ol className="list-decimal pl-5 mb-2">{children}</ol>;
    },
    li({ node, children }) {
      return <li className="mb-1">{children}</li>;
    },
  };

  return (
    <div
      className={`${className} dark:text-white text-black overflow-x-hidden`}
    >
      {index === 0 && totalResult > 1 ? (
        <h2 className="text-xl font-semibold mb-2">{answer}</h2>
      ) : heading ? (
        <h3 className="text-lg font-medium mb-2">{answer}</h3>
      ) : (
        <div className="text-left">
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Answer;
