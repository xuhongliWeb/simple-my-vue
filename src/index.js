const add = (a, b) => a + b
console.log(add(...[1, 2]))
// 还需要在主要的js文件里写入下面这段代码   module.hot.accept 接受一个回掉 
// if (module.hot) {
//     // 实现热更新
//     module.hot.accept();
// }



function myVue(options) {
    this.init(options);
}

myVue.prototype.init = function (options) {
    this.$options = options
    this.$el = document.querySelector(options.el)
    this.$data = options.data
    this.$methods = options.methods
    this._binding = {} // binding 保存着model 和 view 的关系， 也就是 watcher 的实例，当model 改变时，我们会触发其中的指令类更新，保证view也能实时更新
    // 劫持监听所有属性 Observer 用defineProperty 重写 data 的 set 和get 函数

    this._observer(this.$data)

    // 编译
    this._compile(this.$el)
}

myVue.prototype._observer = function (data) {
    console.log(data, 'dadddddddd')
    let value
    for (let key in data) {
        if (data.hasOwnProperty(key)) { //一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
            value = data[key]
            this._binding[key] = {
                _directives: []
            }
            var binding = this._binding[key];
            console.log(this._binding[key], 'this._binding[key];')
            if (typeof value === 'object') {
                this._observer(value)
            }
        }
        // 关键
        Object.defineProperty(this.$data, key, {
            enumerable: true, // 可以被便利
            configurable: true, // 可被修改
            get: function () {
                console.log(value, '遍历循环的value')
                return value
            },
            set: function (newVal) {
                console.log('更新val' + newVal)
                if (newVal !== value) {
                    value = newVal
                    binding._directives.forEach(element => {
                        element.update()
                    });

                }
            }
        })
    }

}

// watcher 指令类函数  用来绑定更新函数， 实现对DOM 元素的更新

function Watcher(name, el, vm, exp, attr) {
    // name => input el => node vm => myVue exp => add attr => value
    this.name = name
    this.el = el;             //指令对应的DOM元素
    this.vm = vm;             //指令所属myVue实例
    this.exp = exp;           //指令对应的值，本例如"number"
    this.attr = attr;         //绑定的属性值，本例为"innerHTML"
    this.update();
}

Watcher.prototype.update = function () {
    this.el[this.attr] = this.vm.$data[this.exp]; //比如 H3.innerHTML = this.data.number; 当number改变时，会触发这个update函数，保证对应的DOM内容进行了更新。
}

// 将view和model绑定，并完成（v-bind,v-model,v-clickde）等。_compile函数

myVue.prototype._compile = function (root) {
    let _this = this
    let nodes = root.children
    for (let i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.children.length) {  // 对所有元素进行遍历，并进行处理
            this._compile(node);
        }

        if (node.hasAttribute('v-click')) {
            node.onclick = (function () {
                var attrVal = nodes[i].getAttribute('v-click');
                console.log(attrVal, '---attrVal')
                return _this.$methods[attrVal].bind(_this.$data) // 使作用域保持一致
            })()
        }

        if (node.hasAttribute('v-model') && (node.tagName == 'INPUT' || node.tagName == 'TEXTAREA')) {
            node.addEventListener('input', (function (key) {
                console.log(key, 'key')
                var attrVal = node.getAttribute('v-model');
                _this._binding[attrVal]._directives.push(new Watcher(
                    'input',
                    node,
                    _this,
                    attrVal,
                    'value'
                ))

                return function () {
                    _this.$data[attrVal] = nodes[key].value
                }
            })(i))
        }

        if (node.hasAttribute('v-bind')) { // 如果有v-bind属性，我们只要使node的值及时更新为data中number的值即可
            var attrVal = node.getAttribute('v-bind');
            _this._binding[attrVal]._directives.push(new Watcher(
                'text',
                node,
                _this,
                attrVal,
                'innerHTML'
            ))
        }

    }
}
var app = new myVue({
    el: '#app',
    data: {
        number: 1
    },
    methods: {
        add: function () {
            this.number++
            console.log(this.number, 'cccccc')
        }
    }
})

// console.log(app.$data.number = 3, '--------')


// bind 

window.x = 10
var model = {
    x: 22,
    getX: function(){
        return this.x
    }
}

var m =  model.getX.bind(model)
console.log('bind', model.getX())
console.log('m',m())