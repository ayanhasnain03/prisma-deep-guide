import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const port = 3000;
const app = express();
app.use(express.json());

// Create a new user
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(user); // 201 Created
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
    });
    res.status(200).json(users); // 200 OK
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
app.post("/posts", async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: Number(authorId) } }, // Connect the post to an existing user
      },
    });
    res.status(201).json(post); // 201 Created
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Follow a user
app.post("/user/:id/follow", async (req, res) => {
  const { id } = req.params; // ID of the user to be followed
  const { userId } = req.body; // ID of the follower

  try {
    // Check if both users exist
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    const followedByUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user || !followedByUser)
      res.status(404).json({ error: "User not found" });
    // Update the follower-following relationship
    await prisma.user.update({
      where: { id: Number(userId) }, // The follower
      data: {
        following: {
          connect: { id: Number(id) }, // Connect the user to the following list of the follower
        },
      },
    });

    res
      .status(200)
      .json({ message: `User ${userId} is now following User ${id}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
