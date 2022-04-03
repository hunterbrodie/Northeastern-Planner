package com.hunterbrodie.neucourseapi.course;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity // This tells Hibernate to make a table out of this class
@Table(name = "course")
public class Course {
  @Id
  private String crn;

  private String name;

  private Integer fk_id_nupath;

  private Integer credits;

  public String getCrn() {
    return this.crn;
  }

  public String getName() {
    return this.name;
  }

  public Integer getFk_id_nupath() {
    return this.fk_id_nupath;
  }

  public Integer getCredits() {
    return this.credits;
  }
}