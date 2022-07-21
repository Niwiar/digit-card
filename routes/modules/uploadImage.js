const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../public/imgs/profile"),
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, "img_" + req.session.CardTag + "." + ext);
    },
  });
  
const upload = multer({ storage: storage }).single("avatar");

module.exports = upload