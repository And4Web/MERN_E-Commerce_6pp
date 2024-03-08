import { Router } from 'express';
import newUser from '../controllers/newUser.js';
const router = Router();
// /api/v1/user/
router.get("/", (req, res) => res.send("this is user route ✔"));
router.post("/new", newUser);
export default router;
