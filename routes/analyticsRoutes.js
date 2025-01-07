const express = require('express');
const {
   getAnalytics,
   addTask,
   addRoommate,
   getTasks,
   getRoommates,
   addTaskType,
   getTaskTypes,
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/analytics', getAnalytics);
router.post('/tasks', addTask);
router.get('/tasks', getTasks);
router.post('/roommates', addRoommate);
router.get('/roommates', getRoommates);
router.post('/task-types', addTaskType);
router.get('/task-types', getTaskTypes);

module.exports = router;