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
        todoList: []
    },
    created: function() {
        window.onbeforeunload = () => { //当窗口即将被卸载时,会触发该事件
            let dataString = JSON.stringify(this.todoList)
            let newTodoValue = JSON.stringify(this.newTodo)
            window.localStorage.setItem('myTodos', dataString) //存储输入款内容
            window.localStorage.setItem('todoInputValue', newTodoValue)
        }
        let todoInputValue = window.localStorage.getItem('todoInputValue')
        let todoInputData = JSON.parse(todoInputValue) //输入框的数据

        let oldDataString = window.localStorage.getItem('myTodos') //取出数据
        let oldData = JSON.parse(oldDataString) //转化成JSON格式

        this.todoList = oldData || [] // 如果没有oldData则默认为空数组
        this.newTodo = todoInputData || '' //为输入框添加上一次未提交的内容
    },
    methods: {
        addTodo: function() {
            this.todoList.push({ //this 被指向data
                title: this.newTodo,
                data: new Date(),
                done: false
            })
            console.log(this.todoList)
            this.newTodo = '' //变成空
        },
        removeTodo: function(todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
        },
        //TODO
        //在addTodo的时候就把时间的格式转化好
        //尝试createAt直接指向一个methods
        signUp: function() {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then(function(loginedUser) {
                console.log(loginedUser);
            }, function(error) {});
        },
        login: function() {
            AV.User.logIn(this.formData.username, this.formData.password).then(function(loginedUser) {
                console.log(loginedUser);
            }, function(error) {});
        }
    }

})