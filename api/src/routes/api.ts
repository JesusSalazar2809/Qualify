import { Router } from 'express';
import TeachersController from '../controllers/TeachersController';
import GroupsController from '../controllers/GroupsController';
import PartialsController from '../controllers/PartialsController';
import ActivitiesController from '../controllers/ActivitiesController';
import StudentsController from '../controllers/StudentsController';
import multer from 'multer';
import { Activities } from '../models/ActivitiesModel';

const upload = multer({ dest: "uploads/" });
const router: Router = Router();

//Auth routes
router.post('/sign-up', TeachersController.signUp);
router.post('/sign-in', TeachersController.signIn);

//Groups routes
router.post('/create-group', GroupsController.create);
router.get('/get-groups', GroupsController.readAll);
router.get('/get-group/:id', GroupsController.readOne);
router.put('/edit-group/:id', GroupsController.update);
router.delete('/delete-group/:id', GroupsController.delete)

//Partials routes
router.post('/create-partial', PartialsController.create);
router.get('/get-partial/:id', PartialsController.readOne);
router.put('/edit-partial/:id', PartialsController.update);
router.delete('/delete-partial/:id', PartialsController.delete)

//Activites routes
router.post('/create-activity', ActivitiesController.create);
router.put('/edit-activity/:id', ActivitiesController.update);
router.get('/get-actitivities', async (req, res)=>{
    const arr = await Activities.find();

    res.status(200).json({data: arr})
});

//Students routes
router.post('/read-students', upload.single('file') ,StudentsController.readFile);
router.post('/save-students',StudentsController.create);
router.put('/edit-student/:id',StudentsController.update);
router.delete('/delete-student/:id',StudentsController.delete);
router.post('/asign-activity/:id',StudentsController.assignActivities);
router.post('/save-scores',StudentsController.saveScores);

export default router;