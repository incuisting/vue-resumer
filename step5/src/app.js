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

        this.currentUser = this.getCurrentUser()
        console.log('current', this.currentUser)
        if (this.currentUser) {
            var query = new AV.Query('AllTodos');
            query.find()
                .then(function(todos) {
                    console.log(todos)
                }, function(error) {
                    console.error(error)
                })
        }

    },
    methods: {
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
                console.log('succes')
            }, (error) => {
                console.log('error')
            })
        },
        addTodo: function() {
            this.todoList.push({ //this 被指向data
                title: this.newTodo,
                data: new Date(),
                done: false
            })
            console.log(this.todoList)
            this.newTodo = '' //变成空
            this.saveTodos()
        },
        removeTodo: function(todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
            this.saveTodos()
        },
        //TODO
        //在addTodo的时候就把时间的格式转化好
        //尝试createAt直接指向一个methods
        signUp: function() { //注册
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, (error) => {
                alert('注册失败')
            });
        },
        login: function() { //登入
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, (error) => {
                alert('注册成功')
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