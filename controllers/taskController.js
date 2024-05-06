const db = require('../config.js/db');

// CREATE TABLE tasks (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     userId INT,
//     title VARCHAR(255),
//     description TEXT,
//     FOREIGN KEY (userId) REFERENCES users(id)
// );

exports.getAllTasks = async (req, res) => {
    try {
        const [tasks, _] = await db.execute('SELECT * FROM tasks WHERE userId = ?', [req.userData.userId]);
        res.send(tasks);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch tasks', error: error.message });
    }
};

exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const [task, _] = await db.execute(
            'INSERT INTO tasks (userId, title, description) VALUES (?, ?, ?)',
            [req.userData.userId, title, description]
        );
        res.status(201).send({ message: 'Task created', taskId: task.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create task', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;
    try {
        await db.execute(
            'UPDATE tasks SET title = ?, description = ? WHERE id = ? AND userId = ?',
            [title, description, taskId, req.userData.userId]
        );
        res.send({ message: 'Task updated' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update task', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        await db.execute('DELETE FROM tasks WHERE id = ? AND userId = ?', [taskId, req.userData.userId]);
        res.send({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete task', error: error.message });
    }
};