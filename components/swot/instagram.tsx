import React, { useState, MouseEvent } from "react";
import { Button } from "../ui/button";

interface IApiResponse {
  author: string;
  quote: string;
}

const Instagram: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<IApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const handleClick = async (
    event: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/generateQuotes`, { method: "POST" });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data.message);
      setLoading(false);
      setShowDirections(true);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setLoading(false);
    }
  };

  // ... Previous code for downloadCSV and generateCSV
  // Function to trigger CSV download
  const downloadCSV = () => {
    // Create a Blob object containing the CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(generateCSV(apiResponse));

    // Create an invisible anchor element and set its attributes
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "quotes.csv");

    // Simulate a click event to trigger the download
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to generate CSV content from the API response
  const generateCSV = (data: IApiResponse[]) => {
    const header = "Author,Quote\n"; // CSV header
    const csvRows = data.map((quote) => `${quote.author},${quote.quote}\n`);
    return header + csvRows.join("");
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white rounded-lg shadow">
      <Button
        onClick={handleClick}
        className={`w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Start Generating"}
      </Button>

      {apiResponse.length > 0 && (
        <div>
          <h1 className="mb-4 text-2xl font-bold text-center">Quotes</h1>

          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Author</th>
                <th className="text-left">Quote</th>
              </tr>
            </thead>
            <tbody>
              {apiResponse.map((quote, index) => (
                <tr key={index}>
                  <td className="text-gray-700">{quote.author}</td>
                  <td className="text-gray-700">{quote.quote}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add a download button */}
          <Button
            onClick={downloadCSV}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          >
            Download CSV
          </Button>
        </div>
      )}

      {showDirections && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Next Steps:</h2>
          <p className="mt-2">
            You have successfully generated quotes. Follow these steps to
            proceed:
          </p>
          <ol className="pl-6 mt-2 list-decimal">
            <li>Step 1: Open the downloaded CSV file.</li>
            <li>Step 2: Perform the next actions as needed.</li>
            <li>Step 3: Enjoy your quotes!</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default Instagram;
