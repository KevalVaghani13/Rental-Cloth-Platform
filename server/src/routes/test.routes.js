const express = require("express");
const router = express.Router();


const auth = require("../middlewares/auth.middleware");

router.get("/protected", auth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});

module.exports = router;
