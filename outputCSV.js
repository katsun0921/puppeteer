'use static';

const puppeteer = require('puppeteer');
const fs = require('fs');

const urlTxt = fs.readFileSync('./url.txt');
const urls = urlTxt.toString().split('\r\n');

/* --------------------------------------------------------------------------------------

CSVファイル作成

-------------------------------------------------------------------------------------- */
(async () => {
    let elementList = [];
    const elements = ['h1', 'h2'];
    let csvHeader = [['URL', '要素名', 'テキスト', 'コード']];
    const getElement = async (browser, url) => {
        let page = await browser.newPage();
        await page.goto(url);

        for (element of elements) {
            let varElement = await page.evaluate((url, element) => {
                const elementObj = [];

                const elementArray = document.querySelectorAll(element);
                
                for (_elementArray of elementArray) {
                    const array = [];
                    array.push(url, element, _elementArray.textContent, _elementArray.innerHTML);
                    elementObj.push(array);                    
                }

                return elementObj;
            },url, element);
            
            elementList = elementList.concat(varElement);
        }

        await page.close();
    };

    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
    });

    for (const url of urls) {
        await getElement(browser, url);
    }

    const csvArray = csvHeader.concat(elementList);
    browser.close();

    function arrToCSV(arr) {
        return arr
        .map(row => row.map(str => '"' + (str ? str.replace(/"/g, '""') : '') + '"')
        )
        .map(row => row.join(','))
        .join('\n');
    }

    
    arrToCSV(csvArray);
      
        fs.writeFile('public/csv/formList.csv', arrToCSV(csvArray), 'utf8', function (err) {
          if (err) {
            console.log('保存できませんでした');
          } else {
            console.log('保存できました');
          }
        });
})();

