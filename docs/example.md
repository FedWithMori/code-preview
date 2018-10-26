# React Code Preview

## 背景

让 Markdown 中的代码可以实时运行，为什么会有这样一个需求？

很多前端团队技术相关的文档都采用 Markdown 编写， 文档中往往会伴随很多示例代码，我们希望大家在阅读文档的时候，可以运行示例代码，看到效果。

## 特性

- Markdown 中的代码可以运行，并预览效果
- 代码可以在线编辑
- 不影响整个文档流的布局
- 支持 React, 支持代码高亮

<!--start-code-->
###### 案例一
```js
const instance = (
  <Button>
    Test
  </Button>
);
ReactDOM.render(instance);
```
<!--end-code-->

<!--start-code-->
###### 案例二
```js
const instance2 = (
  <Button>
    Test2
  </Button>
);
ReactDOM.render(instance2);
```
<!--end-code-->

<!--parameter-description-->
### 其它声明

Markdown 源文件: [example.md](https://github.com/FedWithMori/code-preview/blob/master/docs/example.md)
Github: [react-code-view](https://github.com/FedWithMori/code-preview)
