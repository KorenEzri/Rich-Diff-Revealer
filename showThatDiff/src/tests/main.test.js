const puppeteer = require("puppeteer");
const nock = require("nock");
const useNock = require("nock-puppeteer");
const {
  takeScreenshot,
  BASE_CONFIG,
  delay,
  CLIENT_URL,
} = require("./test.util");
const folderPath = `main`;
const { MOCK_INGREDIENTS, MOCK_COCKTAILS } = require("./mocks");

let browser;
let page;
jest.setTimeout(30000);

describe("Screenshot testing", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    useNock(page, [`${CLIENT_URL}/api/`]);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should load homepage and pixel perfect", async () => {
    await nock(CLIENT_URL).get("/api/ingredients").reply(200, MOCK_INGREDIENTS);
    await page.goto(CLIENT_URL);
    await page.setViewport(BASE_CONFIG);
    await delay(3);
    await takeScreenshot("homepage", folderPath, page);
  });

  it("Should choose Gin and get his list", async () => {
    const SELECTED_INGREDIENT = "Gin";

    await nock(CLIENT_URL).get("/api/ingredients").reply(200, MOCK_INGREDIENTS);
    await page.goto(CLIENT_URL);
    await page.setViewport(BASE_CONFIG);
    await delay(3);
    const selectedIngredientCard = await page.$(
      `[alt="${SELECTED_INGREDIENT}"]`
    );
    await nock(CLIENT_URL)
      .get(`/api/cocktails`)
      .query({
        ingredient: SELECTED_INGREDIENT,
      })
      .reply(200, MOCK_COCKTAILS);
    await selectedIngredientCard.click();
    await delay(6);
    await takeScreenshot("gin-list", folderPath, page);
  });
});
