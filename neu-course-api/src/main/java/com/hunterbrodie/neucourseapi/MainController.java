package com.hunterbrodie.neucourseapi;

import com.hunterbrodie.neucourseapi.course.Course;
import com.hunterbrodie.neucourseapi.course.CourseRepository;
import com.hunterbrodie.neucourseapi.nupath.NUPath;
import com.hunterbrodie.neucourseapi.nupath.NUPathRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller // This means that this class is a Controller
@RequestMapping(path="/get") // This means URL's start with /demo (after Application path)
public class MainController {
  @Autowired // This means to get the bean called userRepository
  // Which is auto-generated by Spring, we will use it to handle the data
  private CourseRepository courseRepository;
  @Autowired
  private NUPathRepository nupathRepository;

  @GetMapping(path="/allcourses")
  public @ResponseBody Iterable<Course> getAllCourses() {
    // This returns a JSON or XML with the users
    return courseRepository.findAll();
  }

  @GetMapping("/course/{crn}")
  public ResponseEntity<JoinedCourse> getCourseByCrn(@PathVariable("crn") String crn) {
    Optional<Course> courseData = courseRepository.findById(crn);
    if (courseData.isPresent()) {
      //return new ResponseEntity<>(courseData.get(), HttpStatus.OK);
      Course foundCourse = courseData.get();

      List<String> nupaths = new ArrayList<>();

      if (foundCourse.getFk_id_nupath() != null) {
        Optional<NUPath> nupathData = nupathRepository.findById(foundCourse.getFk_id_nupath());
        if (nupathData.isPresent()) {
          nupaths.addAll(nupathData.get().getNUPaths());
        }
      }

      JoinedCourse result = new JoinedCourse(foundCourse.getCrn(), foundCourse.getName(), nupaths, foundCourse.getCredits());

      return new ResponseEntity<>(result, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
}