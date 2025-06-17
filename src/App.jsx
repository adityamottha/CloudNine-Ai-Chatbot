import { useEffect, useRef, useState } from "react";
import "./App.css";
import Answer from "./components/Answers";
import RecentSearch from "./components/RecentSearch";
import QueAns from "./components/QueAns";
import { hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs";

function App() {
  const URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBC0iNgqtmnsB59nox3v5tmXb7VUdNNGf0";
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollTOAnswer = useRef();
  const [loader, setLoader] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const askQuestion = async () => {
    if (localStorage.getItem("history")) {
      let history = JSON.parse(localStorage.getItem("history"));
      history = history.slice(0, 10);
      history = [question, ...history];

      history = history
        .filter((item) => typeof item === "string" && item.trim() !== "")
        .map((item) => {
          const trimmed = item.trim();
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        });

      history = [...new Set(history)];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    } else {
      localStorage.setItem("history", JSON.stringify([question]));
      setRecentHistory([question]);
    }

    const payloadData = question ? question : selectedHistory;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: payloadData,
            },
          ],
        },
      ],
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString
      .filter((item) => typeof item === "string")
      .map((item) => item.trim());

    setResult([
      ...result,
      { type: "q", text: question ? question : selectedHistory },
      { type: "a", text: dataString },
    ]);
    setQuestion("");
    setTimeout(() => {
      if (scrollTOAnswer.current) {
        scrollTOAnswer.current.scrollTop = scrollTOAnswer.current.scrollHeight;
      }
    }, 500);
    setLoader(false);
  };

  const isEnter = (e) => {
    if (e.key == "Enter") {
      askQuestion();
    }
  };
  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);

  const [darkMode, setDarkMode] = useState("dark");

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode == "dark" ? "dark" : "light"}>
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen">
        <div className="hidden md:block">
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>

        {/* Main chat part  */}
        <div className="col-span-1 md:col-span-4 ">
          <button
            className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full dark:bg-zinc-700 bg-blue-400"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {showMobileMenu && (
            <div
              className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <div
                className="absolute left-0 top-0 h-full w-3/4 dark:bg-zinc-800 bg-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <RecentSearch
                  recentHistory={recentHistory}
                  setRecentHistory={setRecentHistory}
                  setSelectedHistory={setSelectedHistory}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              </div>
            </div>
          )}
          <div
            ref={scrollTOAnswer}
            className="container h-[calc(100vh-8rem)] md:h-110 overflow-y-auto overflow-x-hidden pt-4 md:pt-10 dark:bg-zinc-900 bg-white pb-10 px-2 md:px-4"
          >
            {result.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <h2
                  className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text 
  bg-gradient-to-r 
  dark:from-gray-400 dark:via-white dark:to-gray-800 
  from-blue-800 via-indigo-700 to-purple-800
  hover:from-blue-900 hover:via-indigo-800 hover:to-purple-900 
  dark:hover:from-gray-300 dark:hover:via-slate-100 dark:hover:to-slate-800 
  transition-all duration-500"
                >
                  Hi, I'm CloudNine
                </h2>

                <p className="text-base md:text-lg dark:text-zinc-300 text-zinc-900">
                  How can I help you today?
                </p>
              </div>
            ) : (
              <div className="dark:text-zinc-300 text-zinc-900 ml-7 w-full">
                <ul className="dark:text-zinc-300 text-zinc-900 w-full">
                  {result.map((item, index) =>
                    item.type === "q" ? (
                      <QueAns key={`q-${index}`} item={item} index={index} />
                    ) : (
                      item.text.map((ansItem, ansIndex) => (
                        <div
                          key={`a-${index}-${ansIndex}`}
                          className="flex justify-start w-full px-2 md:px-4 mb-2"
                        >
                          <li className="w-full max-w-[90%] md:max-w-[80%] overflow-hidden">
                            <Answer
                              className="text-left"
                              ans={ansItem}
                              totalResult={item.length}
                              index={ansIndex}
                              type={item.type}
                            />
                          </li>
                        </div>
                      ))
                    )
                  )}
                </ul>

                {loader ? (
                  <div className="py-2 px-3 text-sm md:text-base font-medium text-gray-900 rounded-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-gray-400 inline-flex items-center">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>
                    Typing...
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div
            className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:my-4 
             mx-auto w-[calc(100%-2rem)] md:w-1/2 
             bg-blue-300 dark:bg-zinc-800 
             border border-blue-400 dark:border-zinc-700 
             rounded-full shadow-md flex items-center h-14 px-3"
          >
            <div className="flex w-full items-center gap-2">
              <input
                onKeyDown={isEnter}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                type="text"
                placeholder="Ask me a question..."
                className="flex-grow bg-transparent outline-none h-full 
                 text-sm md:text-base text-zinc-900 dark:text-white 
                 placeholder:text-zinc-600 dark:placeholder:text-zinc-400"
              />
              <button
                onClick={askQuestion}
                className="px-4 py-2 text-white text-sm md:text-base 
                 bg-blue-600 dark:bg-zinc-700 
                 hover:bg-blue-700 dark:hover:bg-zinc-600 
                 rounded-full whitespace-nowrap shrink-0 transition"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
