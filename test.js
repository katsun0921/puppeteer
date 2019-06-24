const json = {
    "https://bitcoin.dmm.com": {
        "h1": [
            [
                "",
                "<img src=\"https://bitcoin.dmm.com/_img/logo.png\" alt=\"ビットコインなどの仮想通貨を始めるならDMM Bitcoin\" height=\"28\">"
            ]
        ],
        "h2": [
            [
                "DMMビットコインの安心・安全のセキュリティ体制",
                "DMMビットコインの<br data-ua=\"sp\">安心・安全のセキュリティ体制"
            ],
            [
                "DMMビットコインの取引ツール・アプリ",
                "DMMビットコインの<br data-ua=\"sp\">取引ツール・アプリ"
            ],
        ]
    }
}

const objUrl = json[Object.keys(json)];
console.log(objUrl);

const arrayObj = Object.keys(json[Object.keys(json)])[0];
console.log(arrayObj);

const array = objUrl[arrayObj]

console.log(array[0]);