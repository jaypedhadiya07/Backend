import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get("/api/jokes").then((res) => setJokes(res.data));
  });

  return (
    <>
      <h1>Welcome to the Joke API</h1>
      <h2>JOKES: {jokes.length}</h2>
      {jokes.map((j) => {
        return (
          <div key={j.id}>
            <h3>{j.title}</h3>
            <p>{j.content}</p>
          </div>
        );
      })}
    </>
  );
}

export default App;
