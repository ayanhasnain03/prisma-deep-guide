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
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, title } = req.body;
    const user = yield prisma.user.create({
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
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findMany();
    res.status(200).json(user);
}));
app.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            posts: true,
        },
    });
    res.status(200).json(user);
}));
app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});
