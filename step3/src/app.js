import Vue from 'vue'
var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: []
    },
    created: function () {
        window.onbeforeunload = () => {//当窗口即将被卸载时,会触发该事件
            let dataString = JSON.stringify(this.todoList)
            let newTodoValue = JSON.stringify(this.newTodo)
            window.localStorage.setItem('myTodos', dataString) //存储输入款内容
            window.localStorage.setItem('todoInputValue', newTodoValue)
        }
        let todoInputValue = window.localStorage.getItem('todoInputValue')
        let todoInputData = JSON.parse(todoInputValue)
        console.log('todoInputValue',todoInputValue)
        let oldDataString = window.localStorage.getItem('myTodos')//取出数据
        let oldData = JSON.parse(oldDataString)//转化成JSON格式
        this.todoList = oldData || []// 如果没有oldData则默认为空数组
        this.newTodo = todoInputData || ''//为输入框添加上一次未提交的内容
    },
    methods: {
        addTodo: function () {
            this.todoList.push({  //this 被指向data
                title: this.newTodo,
                createAt: new Date(),
                done: false
            })
            console.log(this.todoList)
            this.newTodo = '' //变成空
        },
        removeTodo: function (todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
        }
    }
})