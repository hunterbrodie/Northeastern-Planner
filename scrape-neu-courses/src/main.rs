use select::document::Document;
use select::predicate::{Attr, Class, Name, Predicate};
use std::fs::File;
use std::io::prelude::*;
use std::env;

struct NEUCourse {
	crn: String,
	name: String,
	nupath: Vec<String>,
	credits: u32,
}

fn main() {
	scrape_courses();
}

fn scrape_courses() {
	let mut courses: Vec<NEUCourse> = Vec::new();

	let links = scrape_course_links();
	
	for link in links {
		courses.append(&mut scrape_course_page(link));
	}

	let mut result = String::new();
	
	for course in courses {
		result.push_str(&make_query(course));
		result.push_str("\n\n");
	}

	save(result, "insert-classes.sql".to_owned()).unwrap();
}

fn scrape_course_links() -> Vec<String> {
	let mut links: Vec<String> = Vec::new();
	let url = String::from("https://catalog.northeastern.edu/course-descriptions/");

    let client = reqwest::blocking::Client::new();
    let resp = client.get(&url)
        .send()
        .unwrap()
        .text()
        .unwrap();
    
    let document = Document::from(resp.as_str());

	for link_node in document.find(Attr("id", "atozindex").descendant(Name("li")).descendant(Name("a"))) {
		match link_node.attr("href") {
			Some(e) => links.push(String::from(e)),
			None => continue
		}
	}

	links
}

fn scrape_course_page(link: String) -> Vec<NEUCourse> {
	let mut course_list: Vec<NEUCourse> = Vec::new();

	let url = format!("https://catalog.northeastern.edu{}", link);

    let client = reqwest::blocking::Client::new();
    let resp = client.get(&url)
        .send()
        .unwrap()
        .text()
        .unwrap();
    
    let document = Document::from(resp.as_str());

	for class_node in document.find(Class("courseblock")) {
		let title = class_node.find(Class("courseblocktitle").descendant(Name("strong")))
			.next().unwrap().text();
		let mut title = title.as_str().split_whitespace();

		let course_number = format!("{} {}", title.next().unwrap(), title.next().unwrap());
		let course_number = course_number.trim_end_matches(".");

		let mut course_name = String::new();
		let mut credit_hours = 0u32;

		for word in title {
			let mut chars = word.chars();
			if chars.next().unwrap() == '(' {
				credit_hours = match chars.next().unwrap().to_digit(10) {
					Some(e) => e,
					None => 0
				};
				break;
			}
			else {
				course_name.push_str(word);
				course_name.push(' ');
			}
		}

		let course_name = course_name.trim_end_matches(". ").replace("'", "''");

		let mut nupaths: Vec<Option<String>> = Vec::new();

		for attribute_node in class_node.find(Class("courseblockextra")) {
			let attribute = attribute_node.text();
			if attribute.contains("Attribute(s): ") {
				let attribute = String::from(attribute.trim_start_matches("Attribute(s): "));
				let attributes = attribute.split(", ");
	
				for attr in attributes {
					nupaths.push(match attr.trim() {
						"NUpath Natural/Designed World" => Some(String::from("nd")),
						"NUpath Creative Express/Innov" => Some(String::from("ei")),
						"NUpath Interpreting Culture" => Some(String::from("ic")),
						"NUpath Formal/Quant Reasoning" => Some(String::from("fq")),
						"NUpath Societies/Institutions" => Some(String::from("si")),
						"NUpath Analyzing/Using Data" => Some(String::from("ad")),
						"NUpath Difference/Diversity" => Some(String::from("dd")),
						"NUpath Ethical Reasoning" => Some(String::from("er")),
						"NU Core/NUpath 1st Yr Writing" => Some(String::from("wf")),
						"NU Core/NUpath Adv Writ Dscpl" => Some(String::from("wd")),
						"NUpath Writing Intensive" => Some(String::from("wi")),
						"NUpath Integration Experience" => Some(String::from("ex")),
						"NUpath Capstone Experience" => Some(String::from("ce")),
						_ => None,
					});
				}
			}
		}

		nupaths.retain(|x| x.is_some());

		let nupaths: Vec<String> = nupaths.iter().map(|x| x.as_ref().unwrap().to_owned()).collect();

		course_list.push(NEUCourse {
			crn: String::from(course_number),
			name: String::from(course_name),
			nupath: nupaths,
			credits: credit_hours
		})
	}

	course_list
}

fn make_query(course: NEUCourse) -> String {
	if course.nupath.len() > 0 {
		let cols = vec![
			"nd",
			"ei",
			"ic",
			"fq",
			"si",
			"ad",
			"dd",
			"er",
			"wf",
			"wi",
			"wd",
			"ex",
			"ce"];
		let mut vals = String::new();
		for c in cols {
			if course.nupath.contains(&c.to_owned()) {
				vals.push_str("1, ");
			}
			else {
				vals.push_str("0, ");
			}
		}
		vals = String::from(vals.trim_end_matches(", "));

		format!("INSERT INTO course (crn, name, fk_id_nupath, credits)\nVALUES(\'{}\', \'{}\', GetNUPathID({}), {});", course.crn, course.name, vals,course.credits)
	}
	else {
		format!("INSERT INTO course (crn, name, credits)\nVALUES(\'{}\', \'{}\', {});", course.crn, course.name, course.credits)
	}
}

fn save(str: String, file_name: String) -> std::io::Result<()> {
	let mut path = env::current_dir()?;
	path.pop();
	path.push(file_name);
    let mut file = File::create(path)?;
    file.write_all(str.as_bytes())?;
    Ok(())
}