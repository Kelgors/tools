var
  fs = require("fs"),
  os = require('os');

var results = {};

var
  FIRST_FILE_PATH = "/Users/matthieu/Desktop/ip.blacklist",
  SECOND_FILE_PATH = "/Users/matthieu/Desktop/tips.txt",

  FIRST_FILE_CONTENT = "first-file-content",
  SECOND_FILE_CONTENT = "second-file-content";

results[FIRST_FILE_CONTENT] = String(fs.readFileSync(FIRST_FILE_PATH)).split(os.EOL);
results[SECOND_FILE_CONTENT] = String(fs.readFileSync(SECOND_FILE_PATH)).split(os.EOL);


console.log("***************************************");
console.log("*  check 2 file contents              *");
console.log("***************************************\n");

console.log("File[0] = " + FIRST_FILE_PATH);
console.log("File[1] = " + SECOND_FILE_PATH + "\n");

var
  longerTableName = results[FIRST_FILE_CONTENT].length > results[SECOND_FILE_CONTENT].length ? FIRST_FILE_CONTENT : SECOND_FILE_CONTENT,
  longerLength = results[longerTableName].length,
  shorterTableName = results[FIRST_FILE_CONTENT].length < results[SECOND_FILE_CONTENT].length ? FIRST_FILE_CONTENT : SECOND_FILE_CONTENT,
  shorterLength = results[shorterTableName].length,
  longerLineElement, shorterLineElement,
  before, after,
  countEquals = 0
  ;
results["sames"] = [];

function check(a, b, i, j) {
  if (a === b) {
    results["sames"].push(a + " (line[0] = " + i + ", line[1] = " + j + ")");
    countEquals += 1;
  }
}

function run() {
  var i = 0;
  before = Date.now();
  for (; i < longerLength; i++) {
    longerLineElement = results[longerTableName][i];
    if (longerLineElement.trim()[0] !== '#' && longerLineElement.trim().length !== 0) {
      for (var j = 0; j < shorterLength; j++) {
        shorterLineElement = results[shorterTableName][j];
        if (shorterLineElement.trim()[0] !== '#' && shorterLineElement.trim().length) {
          check(longerLineElement, shorterLineElement, i, j);
        }
      }
    }
  }
  after = Date.now();
  console.log(String(i) + " elements have been checked");
  console.log("This test took " + String((after - before) / 1000) + " seconds\n");
  console.log(String(countEquals) + " elements are similare");


  console.log(" - " + results["sames"].join("\n - "));
}

run();