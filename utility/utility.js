const { unlink } = require("fs");
const toDestroyFile = (path) => {
  return unlink(path, (err) => {
    if (err) console.log("Error was occur when deleting file..!", err);
  });
};
module.exports = { toDestroyFile };
