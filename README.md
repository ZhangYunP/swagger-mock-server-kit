### swagger-mock-server-kit
语言: 中文
# 安装:
项目依赖nodemon, 必须事先在全局安装nodemon
执行npm install swagger-mock-server-kit nodemon -g 或者 yarn global add swagger-mock-server-kit nodemon

# 使用:
1. 进入任意目录, 输入swagger-mock-server-kit create [项目名] [-y]

2. 拿到swagger文档(swagger.yaml/swagger.json), 把文档放到任意目录

3. 配置config.js(在步骤1指定目录下config子目录内), 把docFilename指向你上一步swagger文档放置位置

4. 进入项目目录(步骤1指定), 执行npm start启动伪数据服务器

5. 等待片刻, 伪数据服务器启动后你可以通过命令行提示地址访问到伪数据

# 特点:
1. 自动通过swagger文档生成mock data

2. 支持插件系统, 可以通过自定义插件去格式化你需要的mock data, 插件提供body对象, 可以很方便的操作swagger json对象

3. 支持cors, 可以解析application/x-www-form-urlencoded, multipart/form-data, application/octet-stream, application/json格式请求

4. 支持代理服务, 可以随时和后台真是接口数据对接

5. 验证swagger文档, 对请求及响应通过sway验证(请求参数，响应体必须符合文档要求), 如果验证失败mock-server将不会返回mock data

6. 整合swagger-ui, 方便查看文档

lanuage: english
# install:
npm install swagger-mock-server-kit -g or yarn global add swagger-mock-server-kit

# usage:
1.enter into any directory that you want to start this mock server and input "swagger-mock-server-kit create"

2.put your swagger specs file(eg: swagger.yaml or swagger.json) into any directory you want

3.editor config.js, make 'docFilename' equal to this swagger specs file path(step2 you do)[must]

4.enter directory that you choose at step 2 and execute "swagger-mock-server-kit start" or "npm start"

5.mock server will run and you will get mock data on this interface that aggre on before 

# features:
1.generate mock data by swagger specs file automately

2.plugin system, you can write plugin and generate formatimg mock data that you want, plugin is easy and useful

3.validate swagger api doc, request and response, if those is invalidate mock server will not return data

4.support cors, support parser  application/x-www-form-urlencoded, multipart/form-data, application/octet-stream, application/json

5.support proxy, mock sever can communicate with real endpoint server

6.integrate swagger ui 