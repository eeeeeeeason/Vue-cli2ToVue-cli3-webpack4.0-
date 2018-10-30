//递归遍历项目，处理所有文件placeholder用于中英切换
// 递归爬取项目静态placeholder
let fs = require('fs')
let join = require('path').join;
let iconv = require('iconv-lite'); // 文件编码转化工具
let reg = /placeholder\=[\",\'][^"']*[\",\']?/g; // placeholder
let zhArr = [] // 中文字符数组

/**
 * Set函数进行数组去重
 */
function dedupe(array){
  return Array.from(new Set(array));
}

/**
 * 获取所有js文件名用于遍历文件
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
  let result=[];
  function finder(path) {
    let files=fs.readdirSync(path);
    files.forEach((val,index) => {
      let fPath=join(path,val);
      let stats=fs.statSync(fPath);
      if(stats.isDirectory()) finder(fPath);
      if(stats.isFile()) result.push(fPath);
    });
  }
  finder(startPath);
  return result;
}

/**
 * 用于读取文件中的所有中文字符
 * @param {string} file 路径及文件名
 */
function readFile(file,index,length){
  fs.readFile(file, function(err, data){
    if(err){
      console.log("读取文件fail " + err);
    }
    else{
      // 读取成功时
      // 输出字节数组
      // 把数组转换为gbk中文
      var str = iconv.decode(data, 'utf-8');
      console.log(str)
      let regResult = str.match(reg);
      //输出前去重
      zhArr = zhArr.concat(dedupe(regResult))
      zhArr = dedupe(zhArr)
      if (index === length - 1) {
        writeFile(zhArr)
      }
    }
  })
}
/**
 * 用于写入文件
 */
function writeFile(arr){
  let str = arr.join(',')
  console.log(str)
  fs.writeFile("./beenUsedPlaceholder.txt", str, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
}
let fileNames=findSync('./src');
let length = fileNames.length
// 读取所有文件并去重生成一个txt文件beenUsedFonts.txt
fileNames.forEach((item,index) => {
  readFile(item,index,length)
})
