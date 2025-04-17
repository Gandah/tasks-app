import { formatPercent } from "@/lib/utils";
import React, { useRef, useState } from "react";
// Adjust the import path as necessary
const FileUploader = () => {
  const fileInputRef = useRef(null);
  const [dataStats, setDataStats] = useState({
    maxCpuUsage: 0,
    minCpuUsage: 0,
    averageCpuUsage: 0,
    sampleCount: 0,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);

      const reader = new FileReader();
      reader.onload = function (e) {
        // e.target.result contains the file content as text
        const logContent = e.target.result;

        // Now pass this text content to your function
        const result = analyzeCpuUsage(logContent);
        setDataStats(result);
        console.log(result);
      };

      // Start reading the file as text
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {dataStats && (
        
          <div className="flex-1 bg-gray-100  flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                CPU Usage Statistics
              </h1>

              <div className="space-y-4">
                {/* Max CPU Usage */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-700">
                      Maximum CPU Usage
                    </h2>
                    <span className="text-xl font-bold text-red-600">
                      {formatPercent(dataStats.maxCpuUsage)}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full"
                      style={{ width: `${dataStats.maxCpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Min CPU Usage */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-700">
                      Minimum CPU Usage
                    </h2>
                    <span className="text-xl font-bold text-green-600">
                      {formatPercent(dataStats.minCpuUsage)}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${dataStats.minCpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Average CPU Usage */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-700">
                      Average CPU Usage
                    </h2>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPercent(dataStats.averageCpuUsage)}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${dataStats.averageCpuUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        
      )}

      <div className='flex flex-col items-center p-2'>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default FileUploader;


