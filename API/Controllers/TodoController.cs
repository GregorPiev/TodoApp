using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.API.Data;
using TodoApp.API.Models;
using System.Runtime.CompilerServices;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Http.HttpResults;

namespace TodoApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoDbContext _todoDbContext;

        public TodoController(TodoDbContext todoDbContext)
        {
            _todoDbContext = todoDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTodos()
        {
            var todos = await _todoDbContext.Todos
                .Where(x => x.IsDeleted == false)
                .OrderByDescending(x=>x.CreateDate)
                .ToListAsync();
            return Ok(todos);
        }
        
        [HttpGet]
        [Route("get-deleted-todos")]
        public async Task<IActionResult> GetAllDeletedTodos()
        {
            var todos = await _todoDbContext.Todos
                .Where(x => x.IsDeleted == true)
                .OrderByDescending(x=>x.CreateDate)
                .ToListAsync();
            return Ok(todos);
        }

        [HttpPost]
        public async Task<IActionResult> AddTodo(Todo todo)
        {
            todo.Id = Guid.NewGuid();
            _todoDbContext.Todos.Add(todo);
            await _todoDbContext.SaveChangesAsync();
            return Ok(todo);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> OnCompleteChange([FromRoute] Guid id, Todo todo)
        {
            var todoCurrent = await _todoDbContext.Todos.FindAsync(id);
            if (todoCurrent != null)
            {
                todoCurrent.IsCompleted = todo.IsCompleted;
                if(todoCurrent.IsCompleted == false)
                {
                    todoCurrent.CopletedDate = null;
                }
                else
                {
                todoCurrent.CopletedDate = DateTime.Now;
                }
                await _todoDbContext.SaveChangesAsync();
                return Ok(todoCurrent);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var todoCurrent = await _todoDbContext.Todos.FindAsync(id);
            if(todoCurrent == null)
            {
                return NotFound();
            }
            todoCurrent.IsDeleted = true;
            todoCurrent.DeletedDate = DateTime.Now;

            await _todoDbContext.SaveChangesAsync();
            return Ok(todoCurrent);
        }

        [HttpPut]
        [Route("undo-deleted-todo/{id:guid}")]
        public async Task<IActionResult> UndoDeletedTodo([FromRoute] Guid id)
        {
            var todoCurrent = await _todoDbContext.Todos.FindAsync(id);
            if (todoCurrent == null)
            {
                return NotFound();
            }
            todoCurrent.IsDeleted = false;
            todoCurrent.DeletedDate = null;
            await _todoDbContext.SaveChangesAsync();

            return Ok(todoCurrent);
        }
    }

    
}
