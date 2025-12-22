import { Router } from 'express';
import {
  getProjectTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/tasks.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/projects/:projectId/tasks', getProjectTasks);
router.post('/projects/:projectId/tasks', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);

export default router;