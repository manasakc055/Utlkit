"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
// import ReactJson from "react-json-view";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

function Jsonfromatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [parsedJSON, setParsedJSON] = useState(null);
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setParsedJSON(parsed);

      const formatted = JSON.stringify(parsed, null, 2);

      setInput(formatted);
      setError("");
    } catch (err) {
      setError("Invalid JSON");
      setParsedJSON(null);
    }
  };

  const treeJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setParsedJSON(parsed);

      const formatted = JSON.stringify(parsed, null, 2);

      setInput(formatted);
      setError("");
    } catch (err) {
      setError("Invalid JSON");
      setParsedJSON(null);
    }
  };


  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);

      setInput(minified);
      setError("");
    } catch (err) {
      setError("Invalid JSON");
    }
  };

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(input);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (err) {
      console.log("Copy failed");
    }
  };

  const clearJSON = () => {

    setInput("");
    setError("");
    setParsedJSON(null);

  }

  const downloadJSON = () => {
     if (!input.trim()) {
    toast.error("No JSON data available to download");
    return;
  }
    try {
      const blob = new Blob([input], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "formatted.json";

      a.click();

      URL.revokeObjectURL(url);

      toast.success("Download started!");

    } catch (err) {
      toast.error("Download failed");
    }
  };

  const uploadJSON = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      setInput(text);

      toast.success("File uploaded!");
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-300 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <h1 className="text-3xl text-black dark:text-white md:text-4xl  font-bold">
            JSON Formatter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Format, validate and minify JSON instantly
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          {/* Left Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={formatJSON}
              className="
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-lg
                font-medium
              "
            >
              Format
            </button>

            <button
              onClick={treeJSON}
              className="
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-lg
                font-medium
              "
            >
              Tree Viewer
            </button>

            <button
              onClick={minifyJSON}
              className="
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-lg
                font-medium
              "
            >
              Minify
            </button>

            <button
              onClick={copyJSON}
              className="
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-lg
                font-medium
                flex
                items-center
                gap-2
              "
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={clearJSON}
              className="
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-100
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-lg
              "
            >
              Clear
            </button>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadJSON}
              className="
                bg-gray-100
                dark:bg-gray-900
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-200
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-xl
              "
            >
              Download
            </button>

            <label
              className="
                bg-gray-100
                dark:bg-gray-900
                border
                border-gray-300
                dark:border-gray-700
                hover:bg-gray-200
                dark:hover:bg-gray-800
                transition
                px-5
                py-2
                rounded-xl
                cursor-pointer
              "
            >
              Upload

              <input
                type="file"
                accept=".json"
                onChange={uploadJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              bg-red-50
              dark:bg-red-500/10
              border
              border-red-500
              text-red-600
              dark:text-red-400
              px-4
              py-3
              rounded-lg
              mb-4
            "
          >
            {error}
          </div>
        )}

        {/* Textarea */}
        {/* <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className="
            w-full
            h-[300px]
            bg-white
            dark:bg-gray-800
            border
            border-gray-300
            dark:border-gray-700
            rounded-2xl
            p-5
            outline-none
            resize-none
            text-sm
            font-mono
            text-black
            dark:text-white
            placeholder:text-gray-500
            focus:border-blue-500
          "
        /> */}

        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste your JSON here...' className=" w-full h-[300px] bg-gray-800 border border-gray-700 text-white rounded-2xl p-5 outline-none resize-none text-sm font-mono focus:border-blue-500 " />


        {/* Interactive Tree Graph Component Section */}
        {parsedJSON && (
          <div className="mt-6 rounded-2xl border border-gray-700 bg-gray-900 p-5 text-left font-mono text-sm">
            <p className="text-xs text-gray-500 font-sans mb-3 uppercase tracking-wider font-semibold">
              Interactive Nodes Tree
            </p>
        <JsonView
  src={parsedJSON}
  collapsed={1}
/>
          </div>
        )}
      </main>


    </div>

  );
}

export default Jsonfromatter;