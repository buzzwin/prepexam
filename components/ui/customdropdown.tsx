import React, { useState } from "react";
import { Input } from "../ui/input";

interface CustomPromptSelectorProps {
  customPrompt: string;
  onCustomPromptChange: (newPrompt: string) => void;
}

const CustomPromptSelector: React.FC<CustomPromptSelectorProps> = ({
  customPrompt,
  onCustomPromptChange,
}) => {
  // Component implementation...
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  const prompts: string[] = [
    "Select a prompt",
    "Give me wedding quotes",
    "Give me birthday quotes",
    "Give me quotes for renewing vows",
    // Add more prompts as needed
  ];

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setSelectedPrompt(value);
    // Clear custom prompt if the placeholder is selected
    if (value === prompts[0]) {
      onCustomPromptChange("");
    } else {
      onCustomPromptChange(value);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onCustomPromptChange(event.target.value);
  };

  return (
    <div>
      <div className="pb-2 ">
        {" "}
        <select
          className="flex w-full h-10 px-4 py-2 text-sm border rounded-md sm:px-6 lg:px-8 border-input bg-background text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedPrompt}
          onChange={handleSelectChange}
        >
          {prompts.map((prompt, index) => (
            <option key={index} value={prompt}>
              {prompt}
            </option>
          ))}
        </select>
      </div>
      {/* <div className="pb-2 ">
        <Input
          type="text"
          value={customPrompt}
          onChange={handleInputChange}
          placeholder="Enter or edit your prompt"
        />
      </div> */}
    </div>
  );
};

export default CustomPromptSelector;
