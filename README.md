# Nextjs 开发模版

## 1. 创建模版

这里我们直接使用`Nextjs`官方的命令：

```shell
npx create-next-app@latest
```

执行完命令后，我们跟随以下的步骤来选择：

```node
// 输入你的项目名字 默认是 my-app
What is your project named? my-app

// 是否使用TypeScript 是
Would you like to use TypeScript? No / Yes

// 是否使用ESLint 是
Would you like to use ESLint? No / Yes

// 是否使用Tailwind CSS  是
Would you like to use Tailwind CSS? No / Yes

// 是否使用 /src 目录  是
Would you like to use `src/` directory? No / Yes

// 是否使用App Router  是
Would you like to use App Router? (recommended) No / Yes

// 是否自定义别名  否
Would you like to customize the default import alias (@/*)? No / Yes
```

在最后一步确认后，会自动给你安装相关的依赖项目。到这里我们就得到了我们的开发模版。

## 2.目录结构

我们来看看大概的目录结构(主要包含一些高优先级的文件夹和文件)：

```md
+ public                // 存放本地加载的静态文件
+ src 
  + app                 // App路由(所有的路由都在里面定义)
    - page.tsx          // 访问 '/'根路由时，会默认访问'app'目录的该文件
    - layout.tsx        // '/'根路由的布局组件，根目录会自动生成，访问时，会将当前目录'page.tsx'嵌套在里面
    - globals.css       // 全局样式文件
    - favicon.ico       // 浏览器标签图标
- next.config.js        // Next.js 配置文件
- package.json          // 项目配置文件
- .eslintrc.json        // ESLint 配置文件
- .gitignore            // 需要忽略上传的文件和文件夹
- next-env.d.ts         // Next.js的TS声明文件
- tsconfig.json         // TypeScript 配置文件
```

## 3. 路由约定
