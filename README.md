# sso-nodejs
Single Sign On (SSO) Central Authentication Server (CAS) written in nodejs

<img src="https://img-blog.csdnimg.cn/20210520103409169.gif"/>

效果如图所示:

1. 第一次访问www.a.com首页
2. 跳转到www.c.com:3000登录页面,登录成功后跳转www.a.com首页
3. 再次访问www.a.com首页，无需登录直接跳转
4. 访问www.b.com首页，无需登录直接跳转

<img src="https://img-blog.csdnimg.cn/20210520105907837.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDUzMjY2,size_16,color_FFFFFF,t_70"/>

https://blog.csdn.net/qq_45453266/article/details/117066170
