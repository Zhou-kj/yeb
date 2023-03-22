const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})


// proxyObj['/ws']
/* 
let proxyObj = {}

proxyObj['/'] = {
  //websocket
  ws: false,
  //目标地址
  target: 'http://localhost:8081', // 发送请求头会被设置为target
  changeOrigin: true,
  pathReWrite: {
    '^/': '/'
  }
}


moudle.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}
 */