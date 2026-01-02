import "dotenv/config";
import app from "./app.js";
import { connectToDB } from "./db/db.js";

connectToDB();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
