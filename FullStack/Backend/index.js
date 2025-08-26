import "dotenv/config";
import express from "express";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("dist"));

// app.get("/", (req, res) => {
//   res.send("<h1>Home Page</h1>");
// });

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "First Joke",
      content:
        "Why don't scientists trust atoms? Because they make up everything!",
    },
    {
      id: 2,
      title: "Second Joke",
      content:
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
    },
    {
      id: 3,
      title: "Third Joke",
      content:
        "Why don't skeletons fight each other? They don't have the guts.",
    },
    {
      id: 4,
      title: "Fourth Joke",
      content: "What do you call fake spaghetti? An impasta!",
    },
    {
      id: 5,
      title: "Fifth Joke",
      content:
        "Why did the math book look sad? Because it had too many problems.",
    },
  ];
  res.json(jokes);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
