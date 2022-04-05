package com.hunterbrodie.neucourseapi;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class JoinedCourse {
  private String crn;

  private String name;

  private List<String> nupath;

  private Integer credits;

  public String getCrn() {
    return this.crn;
  }

  public String getName() {
    return this.name;
  }

  public List<String> getNupath() {
    return this.nupath;
  }

  public Integer getCredits() {
    return this.credits;
  }
}