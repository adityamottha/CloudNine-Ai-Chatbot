import Answer from "./Answers";

const QueAns = ({ item, index }) => {
  return (
    <li key={`q-${index}`} className="flex justify-end w-full px-2 md:px-4 mb-2">
      <div className="bg-blue-400 dark:bg-zinc-600 text-white p-3 rounded-xl rounded-br-none text-left w-fit max-w-[90%] md:max-w-[80%] break-words mr-5">
        <Answer
          ans={item.text}
          totalResult={1}
          index={index}
          type={item.type}
          isQuestion={true}
        />
      </div>
    </li>
  );
};

export default QueAns;