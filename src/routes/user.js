import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.send("GET user");
});

export default router;
