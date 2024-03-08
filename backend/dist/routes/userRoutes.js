import { Router } from 'express';
const router = Router();
router.get("/", (req, res) => res.send("this is user route ✔"));
export default router;
