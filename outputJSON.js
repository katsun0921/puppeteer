const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const fs = require('fs');

const urlTxt = fs.readFileSync('./url.txt');
const urls = urlTxt.toString().split('\r\n');

(async () => {
    const elementList = {};
    const getElement = async (browser, url) => {
        let page = await browser.newPage();
        await page.goto(url);

        const elements = ['html']
        const elementObj = {};
        for (element of elements) {
            let varElement = await page.evaluate((element) => {
                const array = [];
                
                const elementArray = document.querySelectorAll(element);

                elementArray.forEach(_elementArray => {
                    array.push([_elementArray.textContent,_elementArray.innerHTML]);
                });

                return array;
            },element);
            

            elementObj[element] = varElement;

        }

        elementList[url] = elementObj;

        await page.close();
    };

    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
    });
//   const page = await browser.newPage();
//     await page.goto(urls, {
//         waitUntil: 'domcontentloaded'
//     });
//   const hrefs = await page.$$eval('a', hrefs => hrefs.map((a) => {
//     return a.href
//   }));
//     console.log(await page.title())
//     console.log(hrefs);
    for (const url of urls) {
        await getElement(browser, url);
    }
    browser.close();

    console.log(elementList);
    // console.log(h1List);
    // fs.writeFile('h1List.json', JSON.stringify(h1List, null, ''));

    jsonfile.writeFile('public/json/elementList.json', elementList, {
        encoding: 'utf-8',
        replacer: null,
        spaces: 2,
        EOL: '\r\n'
    }, function (err) {
        });
    console.log('ファイル作成に成功しました。');
    console.log(elementList);
})();

