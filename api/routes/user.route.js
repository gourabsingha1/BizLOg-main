import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  getInvestors,
  getTopInvestors
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';



const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', getUsers);
router.get('/investors', getInvestors);
router.get('/topinvestors', getTopInvestors);
router.get('/:userId', getUser);


export default router;


