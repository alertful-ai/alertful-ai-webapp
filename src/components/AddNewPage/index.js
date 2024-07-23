import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export const AddNewPage = () => {
  const { userId } = useAuth();
  const [newPageUrl, setNewPageUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPageUrl === "") {
      return;
    }

    try {
      const response = await fetch(
        "https://alertful-ai-fastapi-app-j19t.onrender.com/api/addPages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              userId: userId,
              pageUrl: newPageUrl,
              query: "liseten to all changes",
            },
          ]),
        }
      );

      const data = await response.json();

      if (data.message === "success") {
        setMessage("Page added to be monitored!");
        setNewPageUrl("");
      }
    } catch (error) {
      setMessage("Page was not able to be added :(");
      console.error("Error adding page:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setNewPageUrl(e.target.value)}
          value={newPageUrl}
        />
        &nbsp;<button>Add to Monitored Pages</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
