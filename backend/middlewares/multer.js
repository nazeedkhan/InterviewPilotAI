import multer from "multer";
import path from "path";
// express.json() se hum log sirf text data hi frontend se backend bhej sakte hai files nahi.
// multer is a middleware-> pdf files ya pictures ko backend me laane ka or unko server ke localdisk me save krne ka kaam karta hai.

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // file means jo file hum bhej rahe hai.
    // callback se hi multer se baat kr sakte hai command de sakte hai.
    // null means no error destination is public folder.
    callback(null, path.resolve("public"));
  },
  filename: function (req, file, callback) {
    const filename = Date.now() + "-" + file.originalname;
    // null means noerror and filename is as described above.
    callback(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5 mb max size
});

// yaha par multer over. file ki info multer send karta hai controllers me jo req,res hota hai uske req.file me. waha se hi files ko access kiya ja sakta hai.

export default upload;
