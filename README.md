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

这里我们还有一种**可选匹配所有子路由**，我们可以使用两个中括号来创建，`/blog/[[...slug]]/page.tsx`，它和上述的区别在于它可将`/blog`路由一起匹配。但是这里我们这里已经创建了`/blog/page.tsx`，所以这里会有冲突，nextjs会提示报错。我们可以删除`/blog/page.tsx`，直接使用`/blog/[[...slug]]/page.tsx`匹配`blog`目录下面所有的路由。

### 3.3 路由组

当我们需要使用目录去组合、收纳一些有关联的路由这个时候我们可以使用**小括号**的形式包裹文件夹名字，例如`(folderName)`，并且它还不会被声明为一个我们可以访问的路由，我们来举个例子，我想在`blog`目录同级再建立两个目录，一个是我喜欢的文章(`favorite-article`)，一个是我喜欢的视频(`favorite-video`)，如果我直接创建两个目录铺平，显得有点冗杂，这个时候我可建立一个路由组 `(favorite)`，然后在其目录下面再建立`article`、`video`目录如下

![image](/public/doc-images/image4.png)

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

![image](/public/doc-images/image5.png)

![image](/public/doc-images/image6.png)

当然，路由组还有一个强大的功能。我们可以根据不同的路由分组使用不同根布局(`root layout`)，这种情况适用于，不同的路由使用不同的布局方式。我们创建两个目录`(home)`，`(daily)`目录，然后将我们将`/app/layout.tsx`，`/app/page.tsx`都移动到`(home)`目录，把之前创建的`/app/blog`目录移动`(daily)`目录在下面，然后我们将`/(home)/layout.tsx`的内容复制，并且在`(daily)`和`(favorite)`目录下面分别创建`layout.tsx`：

`(daily)/layout.tsx`：

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DAILY',
  description: 'Generated by create next app',
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

`(favorite)/layout.tsx`：

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FAVORITE',
  description: 'Generated by create next app',
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

![image](/public/doc-images/image7.png)

我们改造一下我们的首页：

`(home)/page.tsx`：

```tsx
import Link from 'next/link';

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
  
![image](/public/doc-images/image8.png)

- 日常`(daily)`效果

![image](/public/doc-images/image9.png)

- 我的喜欢`(favorite)`效果
  
![image](/public/doc-images/image10.png)

![image](/public/doc-images/image11.png)

注意注意⚠️：

- 当我们使用路由组并且想在其中使用单独的根布局`root layout`，我们也得把首页的`/app/layout.tsx`和`/app/page.tsx`也要移动到路由组里面，并且同级的路由组内，只能有一个`page.tsx`，不然 Nextjs 无法判断将哪个`page.tsx`作为首页页面。
- 统计路由组下面的目录名不能重名，例如，如果我在`(daily)`目录下面也创建一个`/(daily)/video`目录，这个时候会报错，Nextjs无法判断使用哪个路由
- 使用多个根布局`root layout`会造成页面全量刷新

### 3.4 私有目录

刚刚我们谈到的**路由组**功能开发，其实就是为了更好的组织我们项目中目录、文件，我们刚才只是建立基本的路由文件`page.tsx`，但是实际开发中我们还会有通用组件、通用方法等等。这个时候，我们应该怎么去存放这些目录或者文件呢？

Nextjs App router 允许我们在路由目录下面建立文件，并且不被外界访问，他只会对客户端返回`page.tsx`或者`route.ts`，其他文件默认为私有内容，但是如果我们需要建立一个文件，文件名不能和Nextjs约定的文件名(如下图所示)重合，否则会报错。如果未来 Nextjs 新增一种约定和你之前定义的文件名重合，也会造成错误了。虽然但是这也不是什么大事儿。还是很推荐这种方式的。

![image](/public/doc-images/image12.png)

当然，如果你想建立一个私有的目录去存放一些公共的资源，有很多种方法，就看看自己约定的规范罢了。例如

- 我们可以直接在`/app`目录下面建立文件夹但是里面不放和Nextjs约定的文件名相同即可
- 在`/app`目录外建立文件夹，不会约束你的文件名(强烈推荐)
- 在`/app`目录里面，使用下划线加目录名`_folderName`来建目录，这个也不会约束你的文件名

我们选择第二种方式，来创建一些公共的目录，如下

![image](/public/doc-images/image13.png)

### 3.5 平行路由 & 路由拦截

平行路由一般用于，当我们的网站页面，有多个模块(`dashboard`)或者可以根据条件选择性渲染某些模块时，我们可以使用平行路由来异步渲染这些模块提高我们页面的渲染性能。

要创建平行路由，我们使用`插槽 slot`的形式，我们命名文件夹时使用`@folderName`的约定来创建一个`插槽`，当我们创建`插槽`之后，该`插槽`会以`props`的形式向下传递，我们可以在`/layout.tsx`里面直接取到。我们来改造一下首页，创建`@daily`和`@favorite`插槽，如下：
![image](/public/doc-images/image14.png)
然后我们将之前首页的内容放到`@daily/page.tsx`和`@favorite/page.tsx`中

`@daily/page.tsx`：

```tsx
import Link from 'next/link';

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
import Link from 'next/link';

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

然后在`/app/layout.tsx`中我们使用`props`去接受`daily`和`favorite`这两个插槽，然后就完成使用平行路由改造首页。

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

⚠️注意：

- `插槽`不属于路由段，所以它不会影响路由。例如我们在`@daily`下面建立`detail`目录，这个时候我们的路由是`/detail`而不是`/@daily/detail`。
- `children`其实也是一种插槽的，只不过是内部配置好的
