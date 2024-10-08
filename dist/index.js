"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Create a new user
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const user = yield prisma.user.create({
            data: {
                name,
                email,
            },
        });
        res.status(201).json(user); // 201 Created
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Get all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: { posts: true },
        });
        res.status(200).json(users); // 200 OK
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Create a new post
app.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, authorId } = req.body;
    try {
        const post = yield prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { id: Number(authorId) } }, // Connect the post to an existing user
            },
        });
        res.status(201).json(post); // 201 Created
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Follow a user
app.post("/user/:id/follow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID of the user to be followed
    const { userId } = req.body; // ID of the follower
    try {
        // Check if both users exist
        const user = yield prisma.user.findUnique({
            where: { id: Number(id) },
        });
        const followedByUser = yield prisma.user.findUnique({
            where: { id: Number(userId) },
        });
        if (!user || !followedByUser)
            res.status(404).json({ error: "User not found" });
        // Update the follower-following relationship
        yield prisma.user.update({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
