# Vue-cli2ToVue-cli3-webpack4.0-
项目开发阶段构建太慢超过300秒，按需加载所有组件也需50秒，转为vue-cli3.0配置少量webpack即可达到15秒的构建速度效果，可以接受
- todoList:已解决
  - 构建使用history模式去掉hash后必须在public中配置路径模式为绝对路径
  - 国际化分离
    - 暂时方案为i18n，但是组长好像不喜欢，不开心，但i18n似乎对ie非常不友好很伤心
    - 待处理方案为使用多项目构建，我不喜欢
  - 苹方字体抽离
    - node 使用filesystem将项目中ascii码中文范围内文字抽取去重后得到对应1250个字体
    - 使用font-spider压缩pingfangsc得到270k ttf,woff,eot,svg
    - nginx配置mime.type 中ttf
    - gzip开启font/ttf等
  
