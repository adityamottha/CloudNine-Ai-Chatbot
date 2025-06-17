function RecentSearch({
  recentHistory,
  setRecentHistory,
  setSelectedHistory,
  darkMode,
  setDarkMode,
}) {
  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  const deleteSingleHistory = (indexToRemove) => {
    const updatedHistory = recentHistory.filter(
      (_, index) => index !== indexToRemove
    );
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setRecentHistory(updatedHistory);
  };

  return (
    <>
      <div className="col-span-1 dark:bg-zinc-800 bg-blue-300 h-full md:h-screen text-center flex flex-col">
        <div className="p-4 border-b-1 dark:border-zinc-700 border-blue-400">
          <div className="flex items-center gap-3 justify-center">
            <h1
              className="text-3xl font-extrabold text-transparent bg-clip-text 
              bg-gradient-to-r 
              dark:from-gray-400 dark:via-white dark:to-gray-800 
              from-blue-800 via-indigo-700 to-purple-800
              hover:from-blue-900 hover:via-indigo-800 hover:to-purple-900 
              dark:hover:from-gray-300 dark:hover:via-slate-100 dark:hover:to-slate-800 
              transition-all duration-500 w-fit px-2 py-1 rounded"
            >
              CloudNine
            </h1>
          </div>

          <h1 className="pt-3 text-xl dark:text-white text-black flex items-center justify-center gap-2">
            <span className="leading-none">Recent Chats</span>
            <button
              onClick={clearHistory}
              className="p-0 m-0 flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="20"
                height="20"
                className="inline-block align-middle mt-[2px] fill-black dark:fill-white"
              >
                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
              </svg>
            </button>
          </h1>
        </div>

        <div className="overflow-y-auto flex-1">
          <ul className="text-left mt-2">
            {recentHistory.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex justify-between items-center dark:text-zinc-400 text-zinc-900 truncate cursor-pointer px-5 py-1 dark:hover:bg-zinc-700 hover:bg-blue-400 dark:hover:text-zinc-300 hover:text-zinc-700"
              >
                <span
                  onClick={() => setSelectedHistory(item)}
                  className="flex-1 truncate"
                >
                  {item}
                </span>
                <button
                  onClick={() => deleteSingleHistory(index)}
                  className="ml-2 dark:text-white text-black"
                  title="Delete this item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    width="18"
                    height="18"
                    className="fill-current"
                  >
                    <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t-1 dark:border-zinc-700 border-blue-400">
          <select
            id="theme"
            onChange={(event) => setDarkMode(event.target.value)}
            value={darkMode}
            className="dark:bg-zinc-800 bg-blue-300 dark:text-white text-black border border-zinc-600 text-xl rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-fit shadow-lg hover:border-blue-400 transition"
          >
            <option value="dark" className="text-black">
              Dark
            </option>
            <option value="light" className="text-black">
              Light
            </option>
          </select>
        </div>
      </div>
    </>
  );
}

export default RecentSearch;
