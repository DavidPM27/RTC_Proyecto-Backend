const {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  changeUserRole,
  updateUser,
  getUser
} = require('../controllers/user.controller')
const { isAuth, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/img');

const userRouter = require('express').Router();

userRouter.get('/', isAdmin, getAllUsers);
userRouter.post('/register', upload.single("image"), registerUser);
userRouter.post('/login', loginUser);
userRouter.delete('/:id', isAuth,  deleteUser);
userRouter.put('/changeRole/:id', isAdmin, changeUserRole);
userRouter.put('/:id', isAuth, upload.single("image"), updateUser);
userRouter.get('/:id', getUser);

module.exports = userRouter;