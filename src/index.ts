import { PrismaClient } from "@prisma/client";
import express from "express";
const prisma = new PrismaClient();
const port = 3000;
const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { name, email, title } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: {
          title: title,
        },
      },
    },
  });
  res.status(200).json(user);
});
app.get("/", async (req, res) => {
  const user = await prisma.user.findMany();
  res.status(200).json(user);
});
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      posts: true,
    },
  });
  res.status(200).json(user);
});
app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
