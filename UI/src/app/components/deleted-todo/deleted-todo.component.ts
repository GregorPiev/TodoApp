import { Component, OnInit } from '@angular/core';
import { ITodo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-deleted-todo',
  templateUrl: './deleted-todo.component.html',
  styleUrls: ['./deleted-todo.component.css']
})
export class DeletedTodoComponent implements OnInit {

  todos: ITodo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getAllDeletedTodos();
  }

  getAllDeletedTodos(): void {
    this.todoService.getAllDeletedTodos().subscribe({
      next: (result) => {
        console.log(result)
        this.todos = result;
      },
      error: () => {
        console.log('Error');
      }
    })
  }

  undo(todo: ITodo): void {
    if (!todo.id) return;

    this.todoService.onUndo(todo.id).subscribe({
      next: (result) => {
        this.getAllDeletedTodos();
      },
      error: () => {

      }
    })
  }
}
