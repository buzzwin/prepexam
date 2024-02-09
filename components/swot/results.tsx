"use client";
import React, { useEffect, useState, MouseEvent } from "react";
import { Button } from "../ui/button";

interface IApiResponse {
  question: string;
  choice_1: string;
  choice_2: string;
  choice_3: string;
  choice_4: string;
  answer: string;
  explanation: string;
}

const Quiz: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<IApiResponse | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasTestStarted, setHasTestStarted] = useState<boolean>(false);
  const [isChoiceCorrect, setIsChoiceCorrect] = useState<boolean | undefined>(
    undefined
  );
  const [score, setScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60 * 30); // 30 minutes for example
  const [hasAnswerBeenChecked, setHasAnswerBeenChecked] =
    useState<boolean>(false);

  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasTestStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      clearInterval(timer);
      // Handle test end logic here
    }

    return () => clearInterval(timer);
  }, [hasTestStarted, timeRemaining]);

  const handleClick = async (
    event: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    // Clear the current question before loading the next one

    try {
      const response = await fetch(`/api/generatePost`, { method: "POST" });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setHasTestStarted(true);

      // Parsing the outer JSON to get the 'message' string
      const outerData = await response.json();
      const messageString = outerData.message;

      // Parsing the 'message' string to get the actual JSON data
      const innerData = JSON.parse(messageString);

      setSelectedChoice(null); // Also reset the selected choice
      setIsChoiceCorrect(undefined); // Reset the correctness state
      setShowExplanation(false); // Hide the explanation for the previous question
      setApiResponse(innerData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const checkAnswer = () => {
    if (selectedChoice && apiResponse) {
      // Extract choices from apiResponse
      const choices = {
        choice_1: apiResponse.choice_1,
        choice_2: apiResponse.choice_2,
        choice_3: apiResponse.choice_3,
        choice_4: apiResponse.choice_4,
      };

      // Iterate through choices to find the correct one
      let correctChoiceKey = null;
      Object.entries(choices).forEach(([key, value]) => {
        if (value === apiResponse.answer) {
          correctChoiceKey = key;
        }
      });

      // Check if the selected choice matches the correct choice
      const isCorrect = selectedChoice === correctChoiceKey;
      setIsChoiceCorrect(isCorrect);

      // Update score if the answer is correct
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      setShowExplanation(true); // Show explanation after checking the answer
    }
  };

  const handleChoiceClick = (choiceKey: string) => {
    if (isChoiceCorrect === undefined) {
      // Allow selection only if answer is not checked
      setSelectedChoice(choiceKey);
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white rounded-lg shadow">
      {!hasTestStarted ? (
        <Button
          onClick={handleClick}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Start Test
        </Button>
      ) : (
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-600"
          >
            Next Question
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Score: {score}</h2>
            <p>Time Elapsed: {timeElapsed}s</p>
            <p>Time Remaining: {timeRemaining}s</p>
          </div>
        </div>
      )}
      {apiResponse && (
        <div>
          <h1 className="mb-4 text-2xl font-bold text-center">Question</h1>
          <p className="mb-6 text-lg text-gray-700">{apiResponse.question}</p>

          <div className="space-y-4">
            {Object.entries(apiResponse)
              .filter(([key, _]) => key.startsWith("choice_"))
              .map(([key, value]) => (
                <Button
                  key={key}
                  className={`w-full text-left text-gray-800
                              ${
                                selectedChoice === key
                                  ? "bg-blue-100 border-blue-500"
                                  : "bg-gray-100"
                              }
                              hover:bg-blue-100 border rounded-lg`}
                  onClick={() => handleChoiceClick(key)}
                  disabled={isChoiceCorrect !== undefined}
                >
                  {value}
                </Button>
              ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={checkAnswer}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!selectedChoice}
            >
              Check Answer
            </Button>
            <Button
              onClick={handleClick}
              className="bg-green-500 hover:bg-green-600"
            >
              {hasTestStarted ? "Next Question" : "Start Test"}
            </Button>
          </div>

          {showExplanation && (
            <div className="mt-4">
              <p className="text-lg">
                {isChoiceCorrect ? "Correct!" : "Incorrect."}
              </p>
              <p className="text-sm text-gray-600">{apiResponse.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
