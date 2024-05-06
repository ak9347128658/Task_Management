const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config.js/db');


// create table users(
//     id int primary key auto_increment,
//     username varchar(100),
//     password varchar(100)
//   );

exports.registerUser = async (req, res) => {
  try{
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user, _] = await db.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
    res.status(201).send({ message: 'User registered', userId: user.insertId });    
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [user, _] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            return res.status(401).send({ message: 'Authentication failed' });
        }

        const result = await bcrypt.compare(password, user[0].password);
        if (!result) {
            return res.status(401).send({ message: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user[0].id, username: user[0].username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).send({
            message: 'Authentication successful',
            token: token
        });
    } catch (error) {
        res.status(500).send({ message: 'Error logging in', error: error.message });
    }
};