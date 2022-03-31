namespace ScheduleSqlApi.Models {
	public class CourseItem {
		public string Id { get; set; }
		public string name { get; set; }
		public int? fk_id_nupath { get; set; }
		public int credits { get; set; }
	}
}