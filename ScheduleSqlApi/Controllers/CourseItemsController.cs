#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScheduleSqlApi.Models;

namespace ScheduleSqlApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseItemsController : ControllerBase
    {
        private readonly CourseContext _context;

        public CourseItemsController(CourseContext context)
        {
            _context = context;
        }

        // GET: api/CourseItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseItem>>> GetCourseItems()
        {
            return await _context.CourseItems.ToListAsync();
        }

        // GET: api/CourseItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseItem>> GetCourseItem(string id)
        {
            var courseItem = await _context.CourseItems.FindAsync(id);

            if (courseItem == null)
            {
                return NotFound();
            }

            return courseItem;
        }

        // PUT: api/CourseItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourseItem(string id, CourseItem courseItem)
        {
            if (id != courseItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(courseItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CourseItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CourseItem>> PostCourseItem(CourseItem courseItem)
        {
			_context.CourseItems.Add(courseItem);
    		await _context.SaveChangesAsync();

    		//return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
    		return CreatedAtAction(nameof(GetCourseItem), new { id = courseItem.Id }, courseItem);
        }

        // DELETE: api/CourseItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseItem(string id)
        {
            var courseItem = await _context.CourseItems.FindAsync(id);
            if (courseItem == null)
            {
                return NotFound();
            }

            _context.CourseItems.Remove(courseItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseItemExists(string id)
        {
            return _context.CourseItems.Any(e => e.Id == id);
        }
    }
}
