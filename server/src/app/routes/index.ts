import { authRouter } from "../modules/auth/auth.route.ts";
import { userRouter } from "../modules/user/user.route.ts";
import express  from 'express';


const router = express.Router();

const modules = [
    {
        path: '/user',
        module: userRouter
    },
    {
        path: '/auth',
        module: authRouter
    }
]


modules.forEach(m => {
    router.use(m.path, m.module);
})


export const globalRouter = router;