using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace ScheduleSqlApi.Models
{
    public class CourseContext : DbContext
    {
        public CourseContext(DbContextOptions<CourseContext> options)
            : base(options)
        {
        }

        public DbSet<CourseItem> CourseItems { get; set; } = null!;
    }
}