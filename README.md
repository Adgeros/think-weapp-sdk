#### ThinkJS 微信小程序登录SDK

需要配合腾讯云小程序客户端sdk一起使用
[`wafer-client-sdk`](https://github.com/tencentyun/wafer-client-sdk)

> 在小程序框架`mpvue`中使用时候，在编译过成功会提示`import`和`module.exports`不能一起使用的错误
> 解决办法为添加`babel`配置:
> ```
> npm install babel-plugin-transform-es2015-modules-commonjs --save-dev
> ```
> 然后在`.babelrc`文件中添加`plugin`
> ```
> "plugins": ["transform-es2015-modules-commonjs"]
> ```
> 这样既可解决问题

#### 安装
```
npm install think-weapp-sdk --save
```
### 使用
```
// 这里需要用到 redis ，sdk把session存储到了 redis 中
const Redis = require('think-redis');
const wepp = require('think-wapp-sdk');
```
`Controller`中使用
```
module.exports = class extends think.Controller {
    constructor(ctx) {
        super(ctx);
        let options = {
            port: 6379,
            host: redis_host,
            password: ''
        }
        // 可以放到其他地方
        wepp.config.config({
            AppId: '',
            AppSecret: '',
            Redis: new Redis(options))
        });
    }
}
```

### 开始登陆
```
const loginService = wepp.LoginService.create(this.ctx.req, this.ctx.res);
let info = await loginService.login();
```


