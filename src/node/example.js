import fs from "fs";

fs.readdir("public/random-ex/json", function (err, files) {
  if (err) throw err;
  console.log(files);
});
