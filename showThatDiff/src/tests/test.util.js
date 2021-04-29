const {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} = require("fs");
const pixelMatch = require("pixelmatch");
const { PNG } = require("pngjs");

const BASE_PATH = "screenshots";
const VIEW_WIDTH = 1920;
const VIEW_HEIGHT = 1080;

const TEMP_PATH = BASE_PATH + "/temp";
const SHOTS_PATH = BASE_PATH + "/shots";

const takeScreenshot = async (testName, folderPath, page) => {
  const tempAndFolderPath = TEMP_PATH + "/" + folderPath;
  const shotsAndFolderPath = SHOTS_PATH + "/" + folderPath;
  if (!existsSync(BASE_PATH)) {
    mkdirSync("screenshots");
  }
  if (!existsSync(TEMP_PATH)) {
    mkdirSync(TEMP_PATH);
  }
  if (!existsSync(SHOTS_PATH)) {
    mkdirSync(SHOTS_PATH);
  }
  if (!existsSync(tempAndFolderPath)) {
    mkdirSync(tempAndFolderPath);
  }
  if (!existsSync(shotsAndFolderPath)) {
    mkdirSync(shotsAndFolderPath);
  }
  const tempFilePath = tempAndFolderPath + "/" + testName + ".png";
  const shotsFilePath = shotsAndFolderPath + "/" + testName + ".png";

  await page.screenshot({
    path: tempFilePath,
    fullpage: true,
    type: "png",
  });

  if (!existsSync(shotsFilePath)) {
    renameSync(tempFilePath, shotsFilePath);
    return;
  }
  console.log(tempFilePath);

  const tmpImage = PNG.sync.read(readFileSync(tempFilePath));
  const saveImage = PNG.sync.read(readFileSync(shotsFilePath));
  const { width, height } = saveImage;
  const diff = new PNG({ width, height });
  const diffCount = pixelMatch(
    saveImage.data,
    tmpImage.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
    }
  );
  if (diffCount) {
    console.log(`%c diffCount: ${diffCount}`, "color:red");
  } else {
    console.log(`%c  ✓ no diff found`, "color:green");
  }
  if (diffCount > 0) {
    writeFileSync(
      tempAndFolderPath + `/diff-${testName}.png`,
      PNG.sync.write(diff)
    );
    throw new Error("not matched");
  }
};

const BASE_CONFIG = { width: VIEW_WIDTH, height: VIEW_HEIGHT };
const delay = (secs) =>
  new Promise((resolve) => setTimeout(resolve, secs * 1000));

const CLIENT_HOST =
  process.env.RUN_IN_DOCKER && !process.env.RUN_IN_CI
    ? "host.docker.internal"
    : "localhost";

const PORT = 3000;

const CLIENT_URL = `http://${CLIENT_HOST}:${PORT}`;

module.exports = {
  takeScreenshot,
  BASE_PATH,
  BASE_CONFIG,
  CLIENT_URL,
  delay,
};
