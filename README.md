#构建本地模拟数据
本项目旨在解决本地调试ajax数据，提供本地自测数据。支持<a href="http://mockjs.com/" target="_blank">mock</a>构建json数据或自定义数据。默认路由规则。

##参数解释
项目中config.js文件为示例文件，
* URLBASE为请求连接固定前缀
* PORT为构建请求默认输出端口
* paths为配置路径参数，不同路径对应不同数据文件

##安装

    npm install

##启动任务
在config配置好路由规则，启动local mock，可以访问本地对应接口里的路径测试
    
    node listen.js    

##MIT
MIT
