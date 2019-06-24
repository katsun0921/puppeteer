'use static';

const puppeteer = require('puppeteer');

const fs = require('fs');

const urlTxt = fs.readFileSync('./url.txt');

const urls = urlTxt.toString().split('\r\n');

/* --------------------------------------------------------------------------------------
meta 要素
-------------------------------------------------------------------------------------- */



(async () => {

  let elementList = [];
  let csvHeader = [['URL', 'description', '値']];

  try {

    const getMeta = async (browser, url) => {

      let page = await browser.newPage();

      await page.goto(url);

      let metaAttrs = await page.evaluate(() =>
        [...document.querySelectorAll('meta')].map(
          elem => {
            const attrObj = {};
            elem.getAttributeNames().forEach(name => {
              attrObj[name] = elem.getAttribute(name);
            })
            return attrObj;
          }
        )
      );

      await page.close();

      for (metaAttr of metaAttrs) {
        let attr = [];

        if (metaAttr['name'] === 'description') {
          attr.push(url, 'description', metaAttr['content'])
          elementList.push(attr);
        };
      }
    }

    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
    });

    for (const url of urls) {
      await getMeta(browser, url);
    };

    await browser.close();

  } catch (err) {

    console.error(err);

  };

  const csvArray = csvHeader.concat(elementList);

  function arrToCSV(arr) {

    return arr.map(row => row.map(
      str => '"' + (str ? str.replace(/"/g, '""') : '') + '"')
    ).map(row
      => row.join(',')).join('\n');
  }

  arrToCSV(csvArray);

  fs.writeFile('public/csv/description.csv', arrToCSV(csvArray), 'utf8', function (err) {
    if (err) {
      console.log('保存できませんでした');
    } else {
      console.log('保存できました');
    }
  });

})();
