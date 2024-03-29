import { Router } from 'express';
import { newUser, getAllUsers, getUser, deleteUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
const router = Router();
// /api/v1/user/
router.get("/", (req, res) => res.send("this is user route ✔"));
// /api/v1/user/new
router.post("/new", newUser);
// /api/v1/user/all
router.get("/all", adminOnly, getAllUsers);
// /api/v1/user/:dynamicId - get single user - delete a user
router.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default router;
