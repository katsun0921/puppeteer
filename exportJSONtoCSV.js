//jsonをcsv文字列に編集する
function jsonToCsv(jsonHeader, json, delimiter) {
    var header = Object.keys(json[0]).join(delimiter) + '\r\n';
    console.log(header);
    var body = json.map(function(d){
        return Object.keys(d).map(function(key) {
            return d[key];
        }).join(delimiter);
    }).join('\r\n');
    console.log(body);
    return header + body;
}

//csv変換
function exportCSV(jsonHeader,items, delimiter, filename) {

    //文字列に変換する
    var csv = jsonToCsv(jsonHeader, items, delimiter);

    //拡張子
    var extention = delimiter === ',' ? 'csv' : 'tsv';

    //出力ファイル名
    var exportedFilenmae = (filename || 'export') + '.' + extention;

    //BLOBに変換
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // for IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        //anchorを生成してclickイベントを呼び出す。
        var link = document.createElement('a');
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}