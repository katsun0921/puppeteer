'use static';

const puppeteer = require('puppeteer');

const fs = require('fs');

const urlTxt = fs.readFileSync('./url.txt');

const urls = urlTxt.toString().split('\r\n');

/* --------------------------------------------------------------------------------------
ページのhttpレスポンスステータス
-------------------------------------------------------------------------------------- */

(async () => {

  let elementList = [];

  let csvHeader = [['URL', 'httpステータス', 'リダイレクト先のURL']];

  try {

    const getResponseStatus = async (browser, url) => {

      const page = await browser.newPage();

      let httpStatus = [];

      const response = await page.goto(url);

      httpStatus.push(url, String(response._status) ,response._url);

      // console.log(httpStatus);

      elementList.push(httpStatus);
    }

    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
    });

    for (const url of urls) {

      await getResponseStatus(browser, url);

    };

    await browser.close();

  } catch (err) {

    console.error(err);

  };

  const csvArray = csvHeader.concat(elementList);

  console.log(csvArray)

  function arrToCSV(arr) {

    return arr.map(row => row.map(
      str => '"' + (str ? str.replace(/"/g, '""') : '') + '"')
    ).map(
      row
      => row.join(',')).join('\n');
  }

  arrToCSV(csvArray);

  fs.writeFile('public/csv/description.csv', arrToCSV(csvArray), 'utf8',

    function (err) {
      if (err) {
        console.log(err + 'のため保存できませんでした');
      } else {
        console.log('保存できました');
      }
    });
})();
