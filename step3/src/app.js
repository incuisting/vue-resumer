import Vue from 'vue'
var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: []
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