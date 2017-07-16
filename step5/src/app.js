import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'k6SOIiFIuxrQRmjsXD7sPbxq-gzGzoHsz'
var APP_KEY = 'KHrbNCeqsmqKPctnhyYrzIzh'

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
})

var app = new Vue({
    el: '#app',
    data: {
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        newTodo: '',
        todoList: [],
        currentUser: null
    },
    created: function() {
        // window.onbeforeunload = () => { //当窗口即将被卸载时,会触发该事件
        //let dataString = JSON.stringify(this.todoList)
        //var AVTodos = AV.Object.extend('AllTodos')
        //var avTodos = new AVTodos()
        //avTodos.set('content', dataString)
        //avTodos.save().then((todo) => {
        //console.log('succes')
        // }, (error) => {
        //     console.log('error')
        // })
        //let newTodoValue = JSON.stringify(this.newTodo)
        //window.localStorage.setItem('myTodos', dataString) //存储输入款内容
        //window.localStorage.setItem('todoInputValue', newTodoValue)
        // }
        //let todoInputValue = window.localStorage.getItem('todoInputValue')
        //let todoInputData = JSON.parse(todoInputValue) //输入框的数据

        //let oldDataString = window.localStorage.getItem('myTodos') //取出数据
        //let oldData = JSON.parse(oldDataString) //转化成JSON格式

        //this.todoList = oldData || [] // 如果没有oldData则默认为空数组
        //this.newTodo = todoInputData || '' //为输入框添加上一次未提交的内容

        this.currentUser = this.getCurrentUser() //获取用户状态
        console.log('current', this.currentUser)
        this.fetchTodos()

    },
    methods: {
        fetchTodos: function() {
            if (this.currentUser) {
                var query = new AV.Query('AllTodos');
                query.find()
                    .then(function(todos) {
                        console.log('todos', todos)
                        let avAllTodos = todos[0] //因为理论上 AllTodos 只有一个，所以我们取结果的第一项
                        console.log('avAllTodos', avAllTodos)
                        let id = avAllTodos.id
                        this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
                        this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
                        console.log('todoList', this.todoList)
                    }.bind(this), function(error) { //this如果不用bind的话会是undefined。。
                        console.error(error)
                    })
            }
        },
        updateTodos: function() {
            let dataString = JSON.stringify(this.todoList)
                // 第一个参数是 className，第二个参数是 objectId
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
                // 修改属性
            avTodos.set('content', dataString)
                // 保存到云端,然后一个回调函数
            avTodos.save().then(() => {
                console.log('更新成功')
            })
        },
        saveTodos: function() {
            let dataString = JSON.stringify(this.todoList)
            var AVTodos = AV.Object.extend('AllTodos')
            var avTodos = new AVTodos()
            var acl = new AV.ACL()
            acl.setReadAccess(AV.User.current(), true) //只有这个user能读
            acl.setWriteAccess(AV.User.current(), true) //只有这个user能写
            avTodos.set('content', dataString)
            avTodos.setACL(acl) //设置访问控制
            avTodos.save().then((todo) => {
                this.todoList.id = todo.id //把id挂到this.todolist上，否则下次就不会调用updateTodos
                console.log('保存成功')
            }, (error) => {
                console.log('保存失败')
            })
        },
        saveOrUpdateTodos: function() {
            if (this.todoList.id) {
                this.updateTodos()
            } else {
                this.saveTodos()
            }
        },
        addTodo: function() {
            this.todoList.push({ //this 被指向data
                title: this.newTodo,
                data: new Date(),
                done: false
            })
            console.log(this.todoList)
            this.newTodo = '' //变成空
            this.saveOrUpdateTodos()
        },
        removeTodo: function(todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
            this.saveOrUpdateTodos()
        },
        //TODO
        //在addTodo的时候就把时间的格式转化好
        //尝试createAt直接指向一个methods
        signUp: function() { //注册
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                console.log('loginedUser', loginedUser)
                this.actionType = 'login'
                    // this.currentUser = this.getCurrentUser()
                    // console.log('signUpcurrent', this.currentUser)
            }, (error) => {
                alert('注册失败')
            });
        },
        login: function() { //登入
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
                this.fetchTodos()
            }, (error) => {
                alert('登陆失败')
            });
        },
        getCurrentUser: function() {
            let current = AV.User.current()

            if (current) {
                let { id, createAt, attributes: { username } } = AV.User.current()
                    //使用了ES6的解构赋值
                return { id, username, createAt } //

            } else {
                return null
            }
        },
        logout: function() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        }

    }

})