import { useState } from 'react';

export default function SimpleDialog({ handleStop, handleSave }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true)
    handleStop()
 };
 

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={openDialog}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
      >
        STOP
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Save Logs</h2>
            <p className="mb-6 text-gray-800">Do you want to save logs?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() =>{
                    handleSave()
                    setIsOpen(false)
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Yes
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}