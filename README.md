# Vue-cli2ToVue-cli3-webpack4.0-
项目开发阶段构建太慢超过300秒，按需加载所有组件也需50秒，转为vue-cli3.0配置少量webpack即可达到15秒的构建速度效果，可以接受
- todoList:已解决
  - 构建使用history模式去掉hash后必须在public中配置路径模式为绝对路径,nginx处理重定向
  - 苹方字体抽离
    - node 使用filesystem将项目中ascii码中文范围内文字抽取去重后得到对应1250个字体
    - 使用font-spider压缩pingfangsc得到270k ttf,woff,eot,svg
    - nginx配置mime.type 中ttf
    - gzip开启font/ttf等
  - vue首屏渲染方案
    - https://juejin.im/post/5a9ca40b6fb9a028b77a4aac
    - https://ssr.vuejs.org/zh/
  - wangEditor坑
    - 换行获取text纯文本不带空格,纯文本内容无法正常显示
    - 有时候会出现spanyes标签，导致filter过滤失败后直接输出，原因为word或wps复制粘贴将样式和特定标签带过来
    - 处理时删除有bug,解决方案已经提在https://github.com/wangfupeng1988/wangEditor/issues/1749
  - xss处理
    - xss.js处理xss,生成白名单过滤所有非白名单标签，会转化成文本输出入如<会转化为&lt等；也可定制标签中属性，非对应属性会清空，主要处理对应富文本
    - 无论请求亦或回显渲染都需过滤
    - CSP，项目被植入miner旷工的外置链接
      - 设置meta标签如下可以限制外部链接植入
      - <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'; style-src 'self' 'unsafe-inline';">
  - i18n国际化处理
    - vue-i18n，vue-cli3可使用插件,vue add i18n，项目目录如下
      ```
        |-src
           |-lang
             |-en.json,zh.json
           |-page
             |-abc
               |-lang.json
               |-abc.vue
      ```
    - router处理,逻辑是在每次跳转先将from来源的参数存储入keysArr，包括lang属性，排序固定为?lang=en&a=123&b=456
      ```
        function nextWithLang() {
          let queryKeysArr = Object.keys(to.query);
          // 如果目标地址没有lang属性,我们需要从前一页取或者默认给一个zh
          if (!to.query.lang) {
            let nextPath;
            // 之前有设置过语言就采用
            if (from.query.lang) {
              nextPath = `${to.path}?lang=${from.query.lang}`;
              // 将所有属性拍平接在语言之后，如：/?lang=zh&id=123&name=qqq
              if (queryKeysArr.length > 0) {
                queryKeysArr.forEach(key => {
                  if (key != 'lang') {
                    nextPath += `&${key}=${to.query[key]}`;
                  }
                });
              }
            }
            // 没有设置过语言的话就给默认设置一个zh
            else {
              nextPath = `${to.path}?lang=zh`;
              // 将所有属性拍平接在语言之后，如：/?lang=zh&id=123&name=qqq
              if (queryKeysArr.length > 0) {
                queryKeysArr.forEach(key => {
                  if (key != 'lang') {
                    nextPath += `&${key}=${to.query[key]}`;
                  }
                });
              }
            }

            next(nextPath);
          } else {
            next();
          }
        }
      ```
  - dayjs处理时间戳
    - 处理与momeng.js相同 
  - postcss.config.js处理低版本浏览器前缀
    ```
      module.exports = {
        plugins: {
          "autoprefixer": {
            browsers: ['ie >= 9', 'last 2 versions',"Firefox >= 30",">2%"]
          }
        }
      }
    ```
