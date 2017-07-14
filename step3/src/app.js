import Vue from 'vue'
var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: []
    },
    methods:{
        addTodo:function () {
            this.todoList.push({
                title:this.newTodo,
                createAt:new Date()
            })
            console.log(this.todoList)
        }
    }
})