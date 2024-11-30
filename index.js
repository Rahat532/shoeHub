const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = 5000;
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

const uri =
  "mongodb+srv://abdullah154261:CRpdyxvfiMQDnC7f@cluster0.kk580.mongodb.net/mydatabases?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("mydatabases");

    // Signup Route
    app.post("/signup", async (req, res) => {
      const { name, email, password } = req.body;

      try {
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        const newUser = { name, email, password };
        await usersCollection.insertOne(newUser);

        res
          .status(201)
          .json({ message: "User registered successfully", user: { name, email } });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    });

    // Login Route
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user || user.password !== password) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        res
          .status(200)
          .json({ message: "Login successful", user: { name: user.name, email } });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    });

    // Fetch All Users
    app.get("/users", async (req, res) => {
      try {
        const usersCollection = db.collection("users");
        const users = await usersCollection.find().toArray();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
      }
    });

    // Delete a User by Email
    app.delete("/users/:email", async (req, res) => {
      const { email } = req.params;

      try {
        const usersCollection = db.collection("users");
        const result = await usersCollection.deleteOne({ email });

        if (result.deletedCount === 1) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error });
      }
    });

    // Ping to Confirm MongoDB Connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensure cleanup actions if necessary
  }
}
run().catch(console.dir);

// Default Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API", status: "OK" });
});

// Start the Server
app.listen(port, () => {
  console.log("Server is running on port", port);
});
