# Nextjs 开发模版

(图片存储于：<https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template>)

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
    - globals.css       // 全局样式文件，初始化可以将除了TailWindcss的内容全部删除
    - favicon.ico       // 浏览器标签图标
- next.config.js        // Next.js 配置文件
- package.json          // 项目配置文件
- .eslintrc.json        // ESLint 配置文件
- .gitignore            // 需要忽略上传的文件和文件夹
- next-env.d.ts         // Next.js的TS声明文件
- tsconfig.json         // TypeScript 配置文件
```

## 3. 路由约定

### 3.1 嵌套路由

在`src/app`目录下面，我们每创建一个目录，代表一个**路由段**，我们可以通过该路由段来访问对应的界面。接下来，我们来创建一个`/blog`嵌套路由，我们在`app`目录下，新建立一个文件夹，然后在文件夹下面创建`page.tsx`（注意：`page.tsx`的内容也就是作为你访问路由的内容）

`src/app/blog/page.tsx`内容：

```tsx
const Blog = () => {
  return <div>我的博客界面</div>;
};

export default Blog
```

执行`pnpm dev`命令后，在`localhost:3000`端口，访问`/blog`路由，我们可以看到如下的界面：
![image.png](/public/doc-images/image.png)

刚刚我们主目录下面建立了一个嵌套路由，当然我们还可以在`blog`下面继续嵌套更多文件夹(路由)，用以创建更多的路由界面

### 3.2 动态路由

#### 3.2.1 创建基础的动态路由

当我们需要根据实际需求中的ID去访问某个页面的详情时，这个时候，我们就需要使用的动态路由。例如，在这里，我要创建一个博客详情页面，我需要创建一个使用**中括号**包裹，在`/src/app/blog`目录下面，建立`[blogId]`目录，并且建立`[blogId]/page.tsx`页面，并且填入以下内容：

```tsx
import React, { memo } from 'react';

const BlogDetail = (props: { params: { blogId: string } }) => {
  return <div>博客ID: {props.params.blogId}</div>;
};

export default BlogDetail;

```

然后我们在`blog/page.tsx`添加路由跳转，以便跳转到博客详情页面，如下：

```tsx
import Link from 'next/link';

const BLOGS = [1, 2, 3, 4, 5];

const Blog = () => {
  return (
    <div className="p-4">
      <h1>我的博客界面</h1>
      <ul>
        {BLOGS.map((b) => (
          <li key={b}>
            <Link href={`/blog/${b}`}>博客{b}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
```

替换代码后，我们的博客页面添加了跳转到详情的入口：
![image](/public/doc-images/image1.png)

我们可以通过界面点击`博客1`等进入对应的详情界面：
![image](/public/doc-images/image2.png)

到这个时候我们就创建了一个基础的动态路由。

#### 3.2.2 匹配所有子路由

我们还可以通过在方括号里面加省略号的方式，匹配更多路由，比如说，我在`blog`目录下面加入`[...slug]`文件夹，因为我们这里已经建立了`[blogId]`目录，所有这个目录只能够匹配出`/blog`路由下面所有除了一级路由以外的路由，举个例子：

- `/blog/1` 这个路由会走到`[blogId]`目录下
- `/blog/1/2` 这个路由会走到`[...slug]`目录下

我们先来看看刚刚创建的`[...slug]`下的文件内容，`[...slug]/page.tsx`：

```tsx
import React, { memo } from 'react';

const Others = (props: { params: { slug: string } }) => {
  return <div>其他: {JSON.stringify(props.params.slug)}</div>;
};

export default Others;
```

再来看看实际的情况：
![image](/public/doc-images/image3.png)

这实际上就是走到了`[...slug]/page.tsx`内容下。
