"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Percent } from "lucide-react";

function PercentageToCGPA() {
  const [percentage, setPercentage] = useState("");
  const [cgpa, setCgpa] = useState<number | null>(null);

  const calculateCGPA = () => {
    if (percentage.trim() === "") {
      toast.error("Please enter a percentage");
      setCgpa(null);
      return;
    }

    const value = Number(percentage);

    if (isNaN(value) || value < 0 || value > 100) {
      toast.error("Please enter a valid percentage between 0 and 100");
      setCgpa(null);
      return;
    }

    const result = value / 10 + 0.75;

    setCgpa(Number(result.toFixed(2)));

    toast.success("CGPA calculated successfully");
  };

  const resetFields = () => {
    setPercentage("");
    setCgpa(null);
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
               bg-gray-100
    dark:bg-zinc-800
      border
    border-gray-200
    dark:border-zinc-700
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <Percent
              size={28}
  className="text-gray-700 dark:text-gray-300"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Percentage to CGPA
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Convert your percentage into CGPA instantly
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Percentage
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="Example: 85"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
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
              onClick={calculateCGPA}
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
        {cgpa !== null && (
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
              Calculated CGPA
            </p>

            <h3 className="text-3xl font-bold text-green-800 dark:text-green-300">
              {cgpa}
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
            CGPA = (Percentage ÷ 10) + 0.75
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default PercentageToCGPA;