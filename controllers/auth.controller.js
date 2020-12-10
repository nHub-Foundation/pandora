
exports.loginUser = (req, res, next) => {
  res.json({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "07033680280",
    id: 0
  });
}

exports.registerUser = (res, req, next) => {
  res.json("Registration Successful!");
}