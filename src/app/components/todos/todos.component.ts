import { Component, OnInit } from '@angular/core';
import { ITodo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: ITodo[] = [];
  newTodo: ITodo = {
    id: '',
    description: '',
    createDate: new Date(),
    isCompleted: false,
    copletedDate: new Date()
  }

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getAllTodos();
  }

  getAllTodos(): void {
    this.todoService.getAllTodos().subscribe({
      next: (result) => {
        console.log(result)
        this.todos = result;
      },
      error: () => {
        console.log('Error');
      }
    })
  }

  addTodo(): void {
    if (this.newTodo.description === '') {
      return;
    }

    this.todoService.addTodo(this.newTodo).subscribe({
      next: (todo) => {
        console.log("Success add new todo");
        this.newTodo.description = '';
        this.getAllTodos();
      },
      error: () => {
        console.log("Error add new todo");
      }
    })
  }

  onCompleteChange(id: string | undefined, todo: ITodo) {
    if (!id) return;
    this.todoService.onCompleteChange(id, todo).subscribe({
      next: (todo) =>{
        console.log("Success changed inComplete");
        
        this.getAllTodos();
      },
      error: () => {
        console.log("Error changed inComplete");
      }
    })
  }

  delete(todo: ITodo): void {
    if (!todo.id) return;
    this.todoService.onDelete(todo.id).subscribe({
      next: (result) => {
        console.log("Success delete todo");
        this.getAllTodos();
      },
      error: () => {
        console.log("Error delete");
      }
    })
  }
}
