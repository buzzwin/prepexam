import React, { useState, MouseEvent, ChangeEvent } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import CustomPromptSelector from "../ui/customdropdown";

interface IApiResponse {
  author: string;
  quote: string;
}

interface IMessage {
  message: IApiResponse[];
}

const Instagram: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<IApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [message, setMessage] = useState<IApiResponse[]>([]);

  const handleClick = async (
    event: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    try {
      setLoading(true);

      // Assuming `customPrompt` is of type string
      const response = await axios.post<IMessage>("/api/generateQuotes", {
        customPrompt: customPrompt,
      });

      // The response data is now typed, providing better autocompletion and error checking
      setMessage(response.data.message); // Wrap `response.data` in an array

      setLoading(false);
      setShowDirections(true);
    } catch (error: any) {
      // Using `any` for error type; consider using a more specific type if available
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
      setLoading(false);

      if (error.response) {
        console.error(`HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        console.error("No response was received for the request.");
      } else {
        console.error("Error", error.message);
      }

      // Optionally, handle specific error responses or log additional details
    }
  };

  // Function to handle changes in the custom prompt text box
  const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(event.target.value);
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    // Generate CSV content from the API response
    const csvContent = generateCSV(message);

    // Create a Blob object containing the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // Create an object URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an invisible anchor element and set its attributes
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "quotes.csv");

    // Simulate a click event to trigger the download
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    // Cleanup: revoke the object URL
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  // Function to generate CSV content from the API response
  const generateCSV = (data: IApiResponse[]) => {
    const header = `Prompt: ${customPrompt}\nAuthor,Quote\n`; // CSV header
    const csvRows = data.map((quote) => {
      // Check if the quote contains a comma
      const quoteText = quote.quote.includes(",")
        ? `"${quote.quote}"`
        : quote.quote;
      return `${quote.author},${quoteText}\n`;
    });
    return header + csvRows.join("");
  };

  return (
    <div className="p-4 mx-auto bg-white rounded-lg shadow sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
      <div className="flex flex-col items-center justify-center space-y-4">
        <CustomPromptSelector
          customPrompt={customPrompt}
          onCustomPromptChange={setCustomPrompt}
        />

        <Button
          onClick={handleClick}
          className={`w-full md:max-w-md py-2 sm:py-3 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Start Generating"}
        </Button>
      </div>

      {message.length > 0 && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="mt-2 mb-4 text-2xl font-bold text-center">Quotes</h1>

          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-center border-b-2 border-gray-300">
                  Author
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-300">
                  Quote
                </th>
              </tr>
            </thead>
            <tbody>
              {message.map((quote, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                    {quote.author}
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                    {quote.quote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add a download button */}
          <Button
            onClick={downloadCSV}
            className={`w-full md:max-w-md py-2 sm:py-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download CSV"}
          </Button>
        </div>
      )}

      {showDirections && (
        <div className="p-4 ">
          <h2 className="mb-4 text-lg font-semibold text-center">
            Next Steps to use CSV file in Canva:
          </h2>
          <ol className="list-decimal list-inside text-md">
            <li>
              Open the Canva editor for any design format. In the left-hand
              sidebar, scroll down to <strong>Apps</strong> and look under{" "}
              <strong>More from Canva</strong>. Select{" "}
              <strong>Bulk create</strong>.
            </li>
            <li>
              Upload your CSV file:
              <ul className="ml-4 list-disc list-inside">
                <li>
                  Click <strong>Upload data</strong>.
                </li>
                <li>Select the CSV file containing your personalized data.</li>
                <li>
                  Ensure it's in the correct <code>.csv</code> format with UTF-8
                  encoding.
                </li>
              </ul>
            </li>
            <li>
              Select a template that aligns with your design goals and data
              structure. Consider using a Canva-created template for easier data
              mapping.
            </li>
            <li>
              Map your data (if necessary): If the template doesn't
              automatically map your data, drag and drop the column headers from
              your CSV onto the corresponding design elements.
            </li>
            <li>
              Generate your designs: Specify the number of designs you want to
              create based on your data rows. Click <strong>Generate</strong> to
              initiate the process.
            </li>
          </ol>
          <div className="pt-4 pb-8 text-center">
            Thanks for using AISocial!
          </div>
        </div>
      )}
    </div>
  );
};

export default Instagram;
