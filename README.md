# NextJs 学习笔记

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

我们来看看目录结构(主要包含一些高优先级的文件夹和文件)：

```md
- public // 存放本地加载的静态文件
- src
  - app // App 路由(所有的路由都在里面定义)
    - page.tsx // 访问 '/'根路由时，会默认访问'app'目录的该文件
    - layout.tsx // '/'根路由的布局组件，根目录会自动生成，访问时，会将当前目录'page.tsx'嵌套在里面
    - globals.css // 全局样式文件，初始化可以将除了 TailWindcss 的内容全部删除
    - favicon.ico // 浏览器标签图标

* next.config.js // Next.js 配置文件
* package.json // 项目配置文件
* .eslintrc.json // ESLint 配置文件
* .gitignore // 需要忽略上传的文件和文件夹
* next-env.d.ts // Next.js 的 TS 声明文件
* tsconfig.json // TypeScript 配置文件
```

## 3. NextJs 路由约定

在讲路由之前，我们先来讲讲 NextJs 中常见的文件声明约定

### 前置

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image27.png)

#### `layout.tsx`

`layout.tsx`布局的内容可以在不同的路由间共享。

例如我们的根路由的`/app/layout.tsx`文件，它使用`<html>`和`<body>`组成

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

当我们目录下面存在`layout.tsx`并访问路由时，我们的所有页面都会被该布局组件嵌套一层。

`layout.tsx`还会接受一个属性`params`，当我们访问**动态路由**(后面会详细讲到)的时候，能够从`props`里面拿到。

对于根布局组件我们需要知道

- `app`根目录必须包含一个`/app/layout.tsx`
- 根布局必须包含`<html>` 和 `<body>`标签，其余的`<title>`,`<meta>`等等，都不需要，NextJs 提供了函数去动态添加
- 我们可以使用**路由组**(后面会详细讲到)去创建多个不同的根布局，前提是根据你的需求来使用。

#### `page.tsx`

`page.tsx`文件用于渲染对应路由的正文内容，它接受两个参数`params`,`searchParams`，我们直接来看官方的例子

`params`例子

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image28.png)

`searchParams`例子

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image29.png)

#### `loading.tsx`

`loading.tsx`文件配合着`Suspend`一起使用，会立即创建出一个加载的状态，我们可以用它来做骨架屏之类的效果

#### `not-found.tsx`

`not-found.tsx`文件用于捕获`notFound()`或者是当你访问了一个不存在的路由时，会默认返回该文件的内容
⚠️ 注意注意
创建该文件，得放到`/app`下面，否则无法覆盖 NextJs 默认自带的`not-found.tsx`界面。

#### `error.tsx`

`error.tsx`文件捕获客户端组件和服务端组件抛出的错误，会作为一个占位显示。看一个官方的例子

```tsx
"use client"; // error.tsx 必须是一个客户端组件

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 上报错误
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // 尝试重新恢复到未出错的状态
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

我们来看看比较重要的几点

- 首先，`error.tsx` 必须是一个客户端组件
- `digest`代表的是一个`hash`值，它可以用来在服务端日志中匹配相关的错误
- `reset`是一个重置错误边界的函数，它会重新渲染错误边界的内容，如果成功，该组件被正确渲染的内容所替代
- `error.tsx`不会捕获同层级`layout.tsx`里面的内容，只能捕获在它下级的`layout.tsx`

那我们如何捕获`root layout`的错误呢？使用`global-error.tsx`

#### `global-error.tsx`

一种用于捕获根布局`root layout`错误的文件

#### `route.ts`

`route.ts`允许你使用`Web Request`和`Web Response`为一个给定的路由创建自定义的请求。

具体支持的`Http methods`

```ts
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

export async function OPTIONS(request: Request) {}
```

属性介绍：
来看看一个官方的例子

`app/dashboard/[team]/route.ts`

```ts
type Params = {
  team: string;
};

export async function GET(request: Request, context: { params: Params }) {
  const team = context.params.team; // '1'
}
```

#### `template.tsx`

`template.tsx`文件和`layout.tsx`文件有点相似。它可以包裹`children`，但是会被`layout.tsx`包裹。并且
当使用了`template.tsx`并且用户在其中切换路由，子页面会被重新创建渲染，状态也不会被保存。

#### `default.tsx`

`default.tsx`会搭配着**平行路由**一起使用，后面会详细讲到。

最后我们来看看这些文件的一个等级(也就是嵌套逻辑，组件在渲染时的嵌套关系)，直接上官网的图片

![Component Hierarchy](/public/doc-images/6281.png)

### 3.1 嵌套路由

在`src/app`目录下面，我们每创建一个目录，代表一个**路由段**，我们可以通过该路由段来访问对应的界面。接下来，我们来创建一个`/blog`嵌套路由，我们在`app`目录下，新建立一个文件夹，然后在文件夹下面创建`page.tsx`（注意：`page.tsx`的内容也就是作为你访问路由的内容）

`src/app/blog/page.tsx`内容：

```tsx
const Blog = () => {
  return <div>我的博客界面</div>;
};

export default Blog;
```

执行`pnpm dev`命令后，在`localhost:3000`端口，访问`/blog`路由，我们可以看到如下的界面：
![image.png](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image.png)

刚刚我们主目录下面建立了一个嵌套路由，当然我们还可以在`blog`下面继续嵌套更多文件夹(路由)，用以创建更多、更深路由的界面

### 3.2 动态路由

#### 3.2.1 创建基础的动态路由

当我们需要根据实际需求中的 ID 去访问某个页面的详情时，这个时候，我们就需要使用的动态路由。例如，在这里，我要创建一个博客详情页面，我需要创建一个使用**中括号**包裹，在`/src/app/blog`目录下面，建立`[blogId]`目录，并且建立`[blogId]/page.tsx`页面，并且填入以下内容：

```tsx
import React, { memo } from "react";

const BlogDetail = (props: { params: { blogId: string } }) => {
  return <div>博客ID: {props.params.blogId}</div>;
};

export default BlogDetail;
```

然后我们在`blog/page.tsx`添加路由跳转，以便跳转到博客详情页面，如下：

```tsx
import Link from "next/link";

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
![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image1.png)

我们可以通过界面点击`博客1`等进入对应的详情界面：
![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image2.png)

到这个时候我们就创建了一个基础的动态路由。

#### 3.2.2 匹配所有子路由

我们还可以通过在方括号里面加省略号的方式，匹配更多路由，比如说，我在`blog`目录下面加入`[...slug]`文件夹，因为我们这里已经建立了`[blogId]`目录，所有这个目录只能够匹配出`/blog`路由下面所有除了一级路由以外的路由，举个例子：

- `/blog/1` 这个路由会走到`[blogId]`目录下
- `/blog/1/2` 这个路由会走到`[...slug]`目录下

我们先来看看刚刚创建的`[...slug]`下的文件内容，`[...slug]/page.tsx`：

```tsx
import React, { memo } from "react";

const Others = (props: { params: { slug: string } }) => {
  return <div>其他: {JSON.stringify(props.params.slug)}</div>;
};

export default Others;
```

再来看看实际的情况：

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image3.png)

这实际上就是走到了`[...slug]/page.tsx`内容下。

这里我们还有一种**可选匹配所有子路由**，我们可以使用两个中括号来创建，`/blog/[[...slug]]/page.tsx`，它和上述的区别在于它可将`/blog`路由一起匹配。但是这里我们这里已经创建了`/blog/page.tsx`，所以这里会有冲突，nextjs 会提示报错。我们可以删除`/blog/page.tsx`，直接使用`/blog/[[...slug]]/page.tsx`匹配`blog`目录下面所有的路由。

### 3.3 路由组

当我们需要使用目录去组合、收纳一些有关联的路由这个时候我们可以使用**小括号**的形式包裹文件夹名字，例如`(folderName)`，并且它不会被声明为一个我们可以访问的路由，我们来举个例子，我想在`blog`目录同级再建立两个目录，一个是我喜欢的文章(`favorite-article`)，一个是我喜欢的视频(`favorite-video`)，如果我直接创建两个目录铺平，显得有点冗杂，这个时候我可建立一个路由组 `(favorite)`，然后在其目录下面再建立`article`、`video`目录如下

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image4.png)

然后我们分别建立`page.tsx`，内容如下

`/(favorite)/article/page.tsx`

```tsx
/** 最喜欢的文章 */
const Articles = () => {
  return <div>最喜欢的文章页面</div>;
};

export default Articles;
```

`/(favorite)/video/page.tsx`

```tsx
/** 最喜欢的视频 */
const Videos = () => {
  return <div>最喜欢的视频页面</div>;
};

export default Videos;
```

到这里，我们我们可以使用路由访问啦！我们分别访问，`/article`和`/video`试试：

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image5.png)

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image6.png)

当然，路由组还有一个强大的功能。我们可以根据不同的路由分组使用不同根布局(`root layout`)，这种情况适用于，不同的路由使用不同的布局方式。我们创建两个目录`(home)`，`(daily)`目录，然后将我们将`/app/layout.tsx`，`/app/page.tsx`都移动到`(home)`目录，把之前创建的`/app/blog`目录移动`(daily)`目录在下面，然后我们将`/(home)/layout.tsx`的内容复制，并且在`(daily)`和`(favorite)`目录下面分别创建`layout.tsx`：

`/(daily)/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAILY",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>我是Daily根布局：{children}</body>
    </html>
  );
}
```

`/(favorite)/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FAVORITE",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>我是Favorite根布局：{children}</body>
    </html>
  );
}
```

我们来看看调整后的目录结构

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image7.png)

我们改造一下我们的首页：

`(home)/page.tsx`：

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>我的日常</h1>
      <ul>
        <li>
          <Link href={`/blog`}>博客</Link>
        </li>
      </ul>
      <h1>我的喜欢</h1>
      <ul>
        <li>
          <Link href={`/video`}>视频</Link>
        </li>
        <li>
          <Link href={`/article`}>文章</Link>
        </li>
      </ul>
    </main>
  );
}
```

然后我们来看看具体的页面效果

- 首页`(home)`效果

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image8.png)

- 日常`(daily)`效果

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image9.png)

- 我的喜欢`(favorite)`效果

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image10.png)

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image11.png)

注意注意 ⚠️：

- 当我们使用路由组并且想在其中使用单独的根布局`root layout`，我们也得把首页的`/app/layout.tsx`和`/app/page.tsx`也要移动到路由组里面，并且同级的路由组内，只能有一个`page.tsx`，不然 Nextjs 无法判断将哪个`page.tsx`作为首页页面。
- 统一层级路由组下面的目录名不能重名，例如，如果我在`(daily)`目录下面也创建一个`/(daily)/video`目录，这个时候会报错，Nextjs 无法判断使用哪个路由
- 使用多个根布局`root layout`会造成页面全量刷新

### 3.4 私有目录

刚刚我们谈到的**路由组**功能开发，其实就是为了更好的组织我们项目中目录、文件，我们刚才只是建立基本的路由文件`page.tsx`，但是实际开发中我们还会有通用组件、通用方法等等。这个时候，我们应该怎么去存放这些目录或者文件呢？

Nextjs App router 允许我们在路由目录下面建立文件，并且不被外界访问，他只会对客户端返回`page.tsx`或者`route.ts`，其他文件默认为私有内容，但是如果我们需要建立一个文件，文件名不能和 Nextjs 约定的文件名(如下图所示)重合，否则会报错。如果未来 Nextjs 新增一种约定和你之前定义的文件名重合，也会造成错误了。虽然但是这也不是什么大事儿。还是很推荐这种方式的。

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image12.png)

当然，如果你想建立一个私有的目录去存放一些公共的资源，有很多种方法，就看看自己约定的规范罢了。例如

- 我们可以直接在`/app`目录下面建立文件夹但是里面不放和 Nextjs 约定的文件名相同即可
- 在`/app`目录外建立文件夹，不会约束你的文件名(强烈推荐)
- 在`/app`目录里面，使用下划线加目录名`_folderName`来建目录，这个也不会约束你的文件名

我们选择第二种方式，来创建一些公共的目录，如下

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image13.png)

### 3.5 平行路由 & 路由拦截

平行路由一般用于，当我们的网站页面，有多个模块(`dashboard`)或者可以根据条件选择性渲染某些模块时，我们可以使用平行路由来异步渲染这些模块提高我们页面的渲染性能。

要创建平行路由，我们使用`插槽 slot`的形式，我们命名文件夹时使用`@folderName`的约定来创建一个`插槽`，当我们创建`插槽`之后，该`插槽`会以`props`的形式向下传递，我们可以在`/layout.tsx`里面直接获取到。我们来改造一下首页，创建`@daily`和`@favorite`插槽，如下：
![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image14.png)
然后我们将之前首页的内容放到`@daily/page.tsx`和`@favorite/page.tsx`中

`@daily/page.tsx`：

```tsx
import Link from "next/link";

const HomeDaily = () => {
  return (
    <div>
      <h1>我的日常</h1>
      <ul>
        <li>
          <Link href={`/blog`}>博客</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomeDaily;
```

`@favorite/page.tsx`：

```tsx
import Link from "next/link";

const HomeFavorite = (props: any) => {
  return (
    <div>
      <h1>我的喜欢</h1>
      <ul>
        <li>
          <Link href={`/video`}>视频</Link>
        </li>
        <li>
          <Link href={`/article`}>文章</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomeFavorite;
```

然后在`/app/(home)/layout.tsx`中我们使用`props`去接受`daily`和`favorite`这两个插槽，然后就完成使用平行路由改造首页。

```tsx
export default function RootLayout({
  children,
  favorite,
  daily,
}: Readonly<{
  children: React.ReactNode;
  favorite: React.ReactNode;
  daily: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        我是Home Root布局：
        {children}
        {daily}
        {favorite}
      </body>
    </html>
  );
}
```

⚠️ 注意：

- `插槽`不属于路由段，所以它不会影响路由。例如我们在`@daily`下面建立`detail`目录，这个时候我们的路由是`/detail`而不是`/@daily/detail`。
- `children`其实也是一种插槽的，只不过是内部配置好的默认的插槽

插槽还有很多的用法，我们来讲讲

#### 3.5.1 根据角色显示不同的插槽

我们直接使用一下官方文档的例子，这里在`layout`里面，通过使用`checkUserRole`函数获取用户角色，然后选择`user`或者`admin`查插槽来渲染。

```tsx
import { checkUserRole } from "@/lib/auth";

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const role = checkUserRole();
  return <>{role === "admin" ? admin : user}</>;
}
```

#### 3.5.2 加载独立的 Loaning 和 Loading Error

由于平行路由是独立加载的，所以我们可以使用独立的加载中状态`loading.tsx`和加载失败`error.tsx`来优化不同加载状态的处理，官方例子:
![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image15.png)

#### 3.5.3 活动状态和导航

我们直接上例子，在`@favorite`文件夹下面新增一个`types`目录，路径为`/@favorite/types`，并且新增`page.tsx`:

```tsx
/** 喜欢的分类 */
const FavoriteTypes = () => {
  return <div>喜欢的分类</div>;
};

export default FavoriteTypes;
```

然后在`/@favorite/page.tsx`里面新增喜欢分类的链接：

```tsx
import Link from "next/link";

const HomeFavorite = (props: any) => {
  return (
    <div>
      <h1>我的喜欢</h1>
      <ul>
        <li>
          <Link href={`/video`}>视频</Link>
        </li>
        <li>
          <Link href={`/article`}>文章</Link>
        </li>
        <li>
          <Link href={`/types`}>分类</Link>
        </li>
      </ul>
    </div>
  );
};
export default HomeFavorite;
```

这时候，我们看主页是这样子的，多了一个分类：

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image16.png)

我们点击这个分类，会发现，它直接使用`/@favorite/type/page.tsx`的内容覆盖掉当前插槽的内容，在这里 Nextjs 将它视为是一个`软导航`，Nextjs 会使用局部渲染，用插槽来将访问的路由内容渲染出来。

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image17.png)

我们尝试刷新一下，发现插槽内容都显示`404`，这是因为当你重新加载整个页面，Nextjs 将它视为是一个`硬导航`，它无法判别当前插槽的状态，所以它会默认使用当前插槽的`default.tsx`内容渲染，如果没有，则会使用内置的`not-found.tsx`页面渲染。

其实仔细想想，我们直接刷新浏览器之后，渲染`default.tsx`的内容，如果`default.tsx`的内容和`page.tsx`不同，就感觉有差异感。如果两个内容相同，那是不是代码又重复了。感觉这里有点奇怪～

#### 3.5.4 使用插槽完成一个`Tabs`标签页的功能

完成插槽功能，我们只需要在`@favorite`目录下面新建一个`layout.tsx`文件，内容如下：

```tsx
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex gap-2">
        <Link href="/recommend-articles">推荐文章</Link>
        <Link href="/recommend-videos">推荐视频</Link>
      </nav>
      <div>{children}</div>
    </>
  );
}
```

然后我们建立`recommend-articles`和`recommend-videos`目录，表示为推荐的文章和视频，内容如下：

`recommend-articles/page.tsx`

```tsx
const RecommendArticles = () => {
  return <div>我是推荐的文章</div>;
};

export default RecommendArticles;
```

`recommend-videos/page.tsx`

```tsx
const RecommendVideos = () => {
  return <div>我是推荐的视频</div>;
};

export default RecommendVideos;
```

我们可以看到如图所示，这个时候主页已经有了两个标签页，**推荐文章**和**推荐视频**

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image18.png)

当我点击其中一个时他会加载对应路由代码的内容，如下：

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image19.png)

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image20.png)

但是我们刷新浏览器的时候，其他加载的页面也会去加载`default.tsx`的内容

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image21.png)

这样写标签页的好处，我想的是页面刷新后，也保持了之前的状态。
如果是以前的写法，状态记录在当前组件内，页面一刷新就会重置到原始的状态。

#### 3.5.5 使用插槽完成一个`Modal`模态窗口

这里我们用官网的登录窗口来举例子，要实现之前，我们需要了解一下**拦截路由**。

拦截路由，允许我们在当前的布局下，去加载应用另外一个部分的路由内容。

我们创建拦截路由，需要按照这个规则：`(.)folderName`，`.`有点类似于相对路径，当然还有另外的规则，我们来看看完整的规则：

- (.) 用于匹配同一级别上的路由段
- (...) 用于匹配高一级的路由段
- (..)(..) 用于匹配高两级的路由段
- (...) 用于匹配应用程序根目录中的路由段

接下来，我们再创建`/app/(auth)/layout.tsx`和`/app/(auth)/login/page.tsx`，文件

`/app/(auth)/layout.tsx`

```tsx
export const metadata = {
  title: "Login Page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`/app/(auth)/login/page.tsx`

```tsx
const LoginPage = () => {
  return <div>我是登录页面</div>;
};

export default LoginPage;
```

我们完成了我们的登录页面，然后我们在`/(home)/layout.tsx`加入一个跳转到登录页面的链接

`/(home)/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  favorite,
  daily,
  auth,
}: Readonly<{
  children: React.ReactNode;
  favorite: React.ReactNode;
  daily: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <Link href="/login">点击登录</Link>
        </nav>
        我是Home Root布局：
        {children}
        {daily}
        {favorite}
        {auth}
      </body>
    </html>
  );
}
```

页面中出现了跳转登录的按钮

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image22.png)

我们点击登录链接，直接跳转到了登录页面

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image23.png)

但是这不是我们想要的结果，因为我们想通过**拦截路由**去实现登录弹窗。我们接着实现，
我们直接在`/(home)`目录下面建立`@auth`插槽，并且添加`login/page.tsx`，并且在之前`src/components`下面新增一个弹窗组件`Modal`，来看看代码

`/(home)/@auth/login/page.tsx`

```tsx
import { Modal } from "@/components";

const LoginModal = () => {
  return (
    <div>
      <Modal title="登录">我是登录窗口内容</Modal>
    </div>
  );
};

export default LoginModal;
```

`src/components/Modal/index.tsx`

```tsx
"use client";
import { useRouter } from "next/navigation";

type ModalProps = React.PropsWithChildren<{
  title?: string;
}>;

const Modal = (props: ModalProps) => {
  const { title = "模态窗口", children } = props;
  const router = useRouter();
  return (
    <div className="fixed w-screen h-screen left-0 top-0 bg-[rgba(0,0,0,0.4)]">
      <div className="bg-white w-[200px] h-[200px] left-4 top-4 absolute box-border p-4">
        <div className="flex w-full justify-between">
          <h1>{title}</h1>
          <button
            onClick={() => {
              router.back();
            }}
          >
            点击关闭
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
```

`src/components/index.ts`

```ts
export { default as Modal } from "./modal";
```

打开页面一看，发现多了一个`404`的页面

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image24.png)

我们还需要在`@auth`目录下面增增加一个`default.tsx`
这里默认返回空，是因为我们就只需要弹窗，其他页面不需要渲染该页面的任何东西。
`@auth/default.tsx`

```tsx
const DefaultAuth = () => {
  return null;
};

export default DefaultAuth;
```

然后我们在来看看，页面 OK 了

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image25.png)

点击登录链接也能出来了

![image](https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/image26.png)

再试试关闭弹窗、前进、后退路由操作，我们的登录弹窗都能正常出现。

⚠️ 注意注意：

在弹窗出现的情况，我们再刷新整个页面，这个时候，会直接走`/app/(auth)/login`的内容，路由拦截失效，路由的活动状态在我们`硬导航`后直接失效。

到这里我们继续学会了怎么去创建渲染一个路由。

## 4. NextJs 内置组件

上一节我们用了许多的例子去创建路由、渲染页面，我们在路由跳转的时候使用 NextJs 内置的一个组件，`Link`，接下来我们详细地看看它的使用介绍

### 4.1 `Link`组件

`Link`组件是 NextJs 基于我们的 HTML 中的`a`标签拓展的一个组件，它支持页面预加载以及在客户端路由之间的导航。如果我们项目中需要使用到路由切换，尽可能地使用该组件，毕竟还可以提高 SEO ～

我们来看看该组件接受的属性以及具体的介绍

- `href` 跳转到的位置
- `replace` 如果设置为 true，那只会修改 URL 但是不会新增一个路由栈
- `scroll` `true` 会跳转到页面顶部，`false` 不会修改位置
- `prefetch` `true` 会在该组件出现在用户浏览器窗口时，去预加载链接内的内容

其余`a`标签的属性，我们可以用传给`Link`，它会默认透出传给`a`标签

#### 4.1.1 `href`

该属性可以传一个 URL 字符串或者传一个对象，例如

```tsx
<Link href="/blog">博客</Link>
```

当我们需要导航到动态路由或者路由上携带参数，我们可以用一个对象的形式，例如

(目前我使用会报错)

```tsx
// 导航到 /blog/1
<Link href={{
  pathname: '/blog/[blogId]',
  query: { blogId: '1' }
}}>
  博客详情
</Link>

// 导航到 /blog?search=NextJs
<Link href={{
  pathname: '/blog',
  query: { search: 'NextJs' }
}}>
  搜索博客
</Link>
```

但是我实际使用中将参数设置为动态的值，会报错
![image](/public/doc-images/6282.png)

所以我们还是用动态字符串拼接的形式去跳转动态路由吧～

#### 4.1.2 `scroll` 属性

这个属性我觉得是很有用的，NextJs 默认将它设置为 true，意味着我们前往一个新的路由，会跳转到页面的顶部。但是我们什么情况会用到`scroll=false`呢？
我来举个例子，当我的博客列表数据太大需要分页时，这个时候我们新增一个**加载更多**按钮去请求数据，我要通过路由跳转的方式去请求数据，如果`scroll=true`，那么我们请求数据就会跳到顶部去，交互太差啦～

我们来实现这个用例改造一下`(daily)/blog/page.tsx`路由内容

```tsx
import Link from "next/link";

const BLOGS = [...new Array(100)].map((_, index) => index);
const MORE_BLOGS = [...new Array(200)].map((_, index) => index);

const Blog = ({ searchParams }: { searchParams: { more: true } }) => {
  const blogs = searchParams.more ? MORE_BLOGS : BLOGS;
  return (
    <div className="p-4">
      <h1>我的博客界面</h1>
      <ul>
        {blogs.map((b) => (
          <li key={b}>
            <Link href={`/blog/${b}`}>博客{b}</Link>
          </li>
        ))}
      </ul>
      <Link href={`/blog?more=true`} scroll={false}>
        <button>加载更多</button>
      </Link>
    </div>
  );
};

export default Blog;
```

这里我们新增了一个**加载更多** Link 按钮，并且页面`props`里面我接受了`searchParams.more`这样的一个参数，当路由带有这个参数，我就加载**200 条**数据，否则我就加载**100 条**数据。初始化当我们只有 100 条数据的时候，我们滚动到页面底部，点击加载更多按钮，将剩余的 100 条也加载出来了，但是我们浏览的窗口位置没有改变

![image](/public/doc-images/6283.png)

![image](/public/doc-images/6284.png)
