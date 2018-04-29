# 九尾狐游戏出品

### 本项目大部分的shader来源于[https://www.shadertoy.com/](https://www.shadertoy.com)

### 欢迎各位大神提交代码，希望能开发更多更好的效果器

### 本项目地址 https://github.com/fylz1125/ShaderDemos

### shader简介

- creator里面顶点shader采用默认就可以，如无特殊需求，一般不需要编写

- 主要是片元shader的编写，就是一段GLSL代码，类似C代码，main函数入口

- shader加载器，就是一段creator代码，将shader加载进creator<br>使组件产生各种各样的效果

### 代码有两部分
- 常用效果器，在script目录下，比如灰度图，模糊，动态波纹，流光，波光等

- 一些比较cool的光影shader，看起来很绚丽，主要用来学习shader编程

- 每个效果器包含两个TS，一个TS加载器和一个shader的TS脚本

- 酷炫shader是resources目录下的glsl文件，通过EffectManager.ts来动态加载完成



