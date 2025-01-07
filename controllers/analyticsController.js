const Task = require('../models/Task');
const Roommate = require('../models/Roommate');
const TaskType = require('../models/TaskType');



const { startOfMonth, endOfMonth, format } = require('date-fns');

exports.getAnalytics = async (req, res) => {
   try {
      const tasks = await Task.aggregate([
         {
            $group: {
               _id: {
                  completedBy: "$completedBy",
                  month: { $month: "$dateCompleted" },
                  year: { $year: "$dateCompleted" }
               },
               taskCount: { $sum: 1 },
            },
         },
      ]);

      const roommates = await Roommate.find();

      const taskCounts = roommates.map((roommate) => {
         const task = tasks.find((t) => t._id.completedBy.toString() === roommate._id.toString());
         return {
            name: roommate.name,
            tasks: task ? task.taskCount : 0,
         };
      });

      const mostActive = taskCounts.reduce((max, roommate) =>
         roommate.tasks > max.tasks ? roommate : max,
         { name: "No data", tasks: 0 }
      );

      const leastActive = taskCounts.reduce((min, roommate) =>
         roommate.tasks < min.tasks ? roommate : min,
         { name: "No data", tasks: Infinity }
      );

      const monthlyTasksByRoommate = tasks.map(task => ({
         roommateId: task._id.completedBy,
         month: task._id.month,
         year: task._id.year,
         taskCount: task.taskCount,
      }));

      res.json({
         tasksByRoommate: taskCounts,
         mostActiveRoommate: mostActive,
         leastActiveRoommate: leastActive,
         monthlyTasksByRoommate,
      });
   } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
   }
};
exports.addTask = async (req, res) => {
   try {
      const { name, dateCompleted, completedBy } = req.body;
      if (!name || !dateCompleted || !completedBy) {
         return res.status(400).json({ error: 'Missing required fields' });
      }
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
   } catch (error) {
      console.error("Error adding task:", error);
      res.status(400).json({ error: 'Failed to add task' });
   }
};

exports.addRoommate = async (req, res) => {
   try {
      const roommate = new Roommate(req.body);
      await roommate.save();
      res.status(201).json(roommate);
   } catch (error) {
      res.status(400).json({ error: 'Failed to add roommate' });
   }
};

exports.getTasks = async (req, res) => {
   try {
      const tasks = await Task.find();
      res.json(tasks);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
   }
};

exports.getRoommates = async (req, res) => {
   try {
      const roommates = await Roommate.find().lean().exec();
      const transformedRoommates = roommates.map(roommate => ({
         ...roommate,
         id: roommate._id.toString(), // Convert _id to string and assign to id
      }));
      res.json(transformedRoommates);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch roommates' });
   }
};

exports.addTaskType = async (req, res) => {
   try {
      const taskType = new TaskType(req.body);
      await taskType.save();
      res.status(201).json(taskType);
   } catch (error) {
      res.status(400).json({ error: 'Failed to add task type' });
   }
};

exports.getTaskTypes = async (req, res) => {
   try {
      const taskTypes = await TaskType.find();
      res.json(taskTypes);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task types' });
   }
};