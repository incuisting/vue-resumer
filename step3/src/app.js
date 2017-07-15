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
            window.localStorage.setItem('myTodos', dataString)
        }
        let oldDataString = window.localStorage.getItem('myTodos')//取出数据
        let oldData = JSON.parse(oldDataString)//转化成JSON格式
        this.todoList = oldData || []// 如果没有oldData则默认为空数组
    },
    methods: {
        addTodo: function () {
            this.todoList.push({  //this 被指向data
                title: this.newTodo,
                createAt: new Date(),
                done: false
            })
            this.newTodo = '' //变成空
        },
        removeTodo: function (todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
        }
    }
})