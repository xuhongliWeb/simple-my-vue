const add = (a,b) => a + b
console.log(add(...[1,2]))
console.log('add')
console.log('ad2222d')
// 还需要在主要的js文件里写入下面这段代码   module.hot.accept 接受一个回掉 
// if (module.hot) {
//     // 实现热更新
//     module.hot.accept();
// }