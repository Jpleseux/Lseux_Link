import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

const multerConfig = {
  storage: diskStorage({
    filename: (req, file, cb) => {
      console.log(file);
      const fileExt = path.extname(file.originalname);
      const fileName = uuidv4() + fileExt;
      cb(null, fileName);
    },
  }),
};

export default multerConfig;
