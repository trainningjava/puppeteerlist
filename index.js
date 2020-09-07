const puppeteer = require("puppeteer");
const fs = require("fs");
const urlBase = `https://maratona.dev/pt/ranking`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.waitFor(2000);
  await page.goto(`${urlBase}`, { waitUntil: "load" });

  const buttonCount = await page.evaluate(
    () =>
      document.querySelectorAll(
        "main > div > div.styles_navigation__CorUw > button"
      ).length
  );

  await browser.close();
  let i = 0;
  while (i < buttonCount) {
    // const browser = await puppeteer.launch({ slowMo: 500 });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.waitFor(2000);
    const url = `${urlBase}?c=${i + 1}`;
    await page.goto(`${url}`, { waitUntil: "load" });

    page.waitFor(2000);
    const text = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "main > div > div > div.styles_participant__YQRLp > p"
        ),
        (element) => element.textContent.concat("\r\n")
      )
    );
    page.waitFor(2000);

    const ts = Date.now();

    const date_ob = new Date(ts);
    const date = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();
    const minutes = ("0" + date_ob.getMinutes()).slice(-2);
    const seconds = ("0" + date_ob.getSeconds()).slice(-2);

    await page.screenshot({
      path: `desafio${i + 1}_${year}${month}${date}_${minutes}${seconds}.png`,
      fullPage: true,
    });

    var file = fs.writeFileSync(
      `./desafio${i + 1}_${year}${month}${date}_${minutes}${seconds}.txt`,
      text
    );
    await browser.close();
    i++;
  }
})();
