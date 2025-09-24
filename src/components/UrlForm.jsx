import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const fetchUrls = async () => {
    try {
      let res = await axios.get("http://localhost:5000/urls");
      let data = res.data;
      setUrls(data);
    } catch (error) {
      toast.error("❌ URLs fetch karte waqt error aaya!");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.warning("⚠️ Please enter a URL!");
      return;
    }
    try {
      let res = await axios.post("http://localhost:5000/shorten", {
        originalUrl: url,
      });
      if (res.data.message === "URl Already Exsist!") {
        toast.info("Already Exsist This URl");
      } else {
        toast.success("URl Shorten Succesfully!");
      }
      setUrl("");
      fetchUrls();
    } catch (error) {
      toast.error("❌ Error while shortening URL!");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        🔗 URL Shortener
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your URL"
          className="border border-gray-300 p-3 rounded-lg flex-1 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto shadow-md transition"
        >
          Shorten
        </button>
      </form>

      {/* URL List */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          📂 Your URLs
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {urls.map((url, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition bg-white"
            >
              <p className="truncate mb-2">
                <span className="font-semibold text-gray-700">Original: </span>
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {url.originalUrl}
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Short: </span>
                <a
                  href={`http://localhost:5000/${url.shortUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:underline"
                >
                  http://localhost:5000/{url.shortUrl}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UrlForm;
