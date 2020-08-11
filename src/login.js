
/* src/resolvers.js */
import jwt from "jsonwebtoken"

const validate = (req, res) => {
  const {username, password } = req.body;
  if (!username) {
    res.status(400).json({ message : 
      "missing username"
    });
  }

  if (!password) {
    res.status(400).json({ message : 
      "missing password"
    });
  }
};

const login = (req, res) => {
  const {username, password } = req.body;
  validate(req, res);

  if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET);
    res.json({
      token: token
    })
  } else {
    res.status(401).json({ message :
      "unauthorized"
    });
  }

};

export default login;