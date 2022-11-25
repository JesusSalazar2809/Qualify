import { Router, Response, Request } from 'express';
import colors from 'colors'

const router: Router = Router();

router.get('/test', (req: Request, res: Response) =>{
    console.log(colors.green("Un texto pa checar XDDDD"))
    res.status(200).json({'msg': 'Ya esta funcionando el ruteo'})
})

export default router;