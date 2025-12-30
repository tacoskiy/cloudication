import { Router } from "express";
import prisma from "@/lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const samples = await prisma.sample.findMany({
    orderBy: {createdAt: "desc"},
  });

  res.json(samples);
});

router.post("/", async (req, res) => {
  const { content } = req.body;

  const sample = prisma.sample.create({
    data: { content }
  });

  res.json(sample);
});

export default router;