const jwt = require("jsonwebtoken");
const LoginUser = require("../Modal/loginSchema");

const verify = async (req, res, next) => {
  const { token } = req.body;
  if (token) {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await LoginUser.findById(decode.user);
    if (user) {
      req.id = user._id;
    } else {
      res.send("Token not verified");
    }
  } else {
    res.send("Some Error Occured");
  }
  next();
};

module.exports = verify;
