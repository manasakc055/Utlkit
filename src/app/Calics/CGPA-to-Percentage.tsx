"use client";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

function CGPAConverter() {
  const [cgpa, setCgpa] = useState("");
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculatePercentage = () => {
    if (cgpa.trim() === "") {
      setPercentage(null);
      toast.error("Please enter a CGPA");
      return;
    }

    const value = Number(cgpa);

    if (isNaN(value) || value < 0 || value > 10) {
      setPercentage(null);
      toast.error("Please enter a valid CGPA between 0 and 10");
      return;
    }

    const result = (value - 0.75) * 10;
    setPercentage(Number(result.toFixed(2)));

    toast.success("Percentage calculated successfully");
  };
    const resetFields = () => {
        setCgpa("");
   setPercentage(null);
    toast.success("Reset completed");
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div
        className="
          w-full
          max-w-xl
          bg-white
          dark:bg-zinc-900
          border
          border-gray-200
          dark:border-zinc-800
          rounded-3xl
          shadow-sm
          p-6
          sm:p-8
        "
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="
              w-14
              h-14
              rounded-2xl
                border
    border-gray-200
    dark:border-zinc-700
     bg-gray-100
    dark:bg-zinc-800
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <GraduationCap
              size={28}
  className="text-gray-700 dark:text-gray-300"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            CGPA to Percentage
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Convert your CGPA into Percentage instantly
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter CGPA
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="Example: 8.5"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-800
                text-gray-900
                dark:text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-gray-400
                transition
              "
            />
          </div>
                   <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={calculatePercentage}
              className="
                flex-1
                py-3
                rounded-xl
                bg-black
                dark:bg-white
                text-white
                dark:text-black
                font-semibold
                cursor-pointer
                hover:opacity-90
                active:scale-[0.98]
                transition-all
              "
            >
              Convert CGPA
            </button>

            <button
              onClick={resetFields}
              className="
                flex-1
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-zinc-700
                bg-gray-100
                dark:bg-zinc-800
                text-gray-900
                dark:text-white
                font-semibold
                cursor-pointer
                hover:bg-gray-200
                dark:hover:bg-zinc-700
                transition-all
              "
            >
              Reset
            </button>
          </div>


        </div>

        {/* Result */}
        {percentage !== null && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-green-200
              dark:border-green-900
              bg-green-50
              dark:bg-green-500/10
              p-5
            "
          >
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">
              Calculated Percentage
            </p>

            <h3 className="text-3xl font-bold text-green-800 dark:text-green-300">
              {percentage}%
            </h3>
          </div>
        )}

        {/* Formula */}
        {/* <div
          className="
            mt-6
            rounded-2xl
            border
            border-gray-200
            dark:border-zinc-800
            bg-gray-50
            dark:bg-zinc-800/50
            p-4
          "
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Formula Used
          </p>

          <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
            Percentage = (CGPA − 0.75) × 10
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default CGPAConverter;