package com.hunterbrodie.neucourseapi.nupath;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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
@Table(name = "nupath")
public class NUPath {
  @Id
  private int id;

  private boolean nd;

  private boolean ei;

  private boolean ic;

  private boolean fq;

  private boolean si;

  private boolean ad;

  private boolean dd;

  private boolean er;

  private boolean wf;

  private boolean wi;

  private boolean wd;

  private boolean ex;

  private boolean ce;

  public List<String> getNUPaths() {
    List<String> nupaths = new ArrayList<>();

    if (nd) {
      nupaths.add("ND");
    }
    if (ei) {
      nupaths.add("EI");
    }
    if (ic) {
      nupaths.add("IC");
    }
    if (fq) {
      nupaths.add("FQ");
    }
    if (si) {
      nupaths.add("SI");
    }
    if (ad) {
      nupaths.add("AD");
    }
    if (dd) {
      nupaths.add("DD");
    }
    if (er) {
      nupaths.add("ER");
    }
    if (wf) {
      nupaths.add("WF");
    }
    if (wi) {
      nupaths.add("WI");
    }
    if (wd) {
      nupaths.add("WD");
    }
    if (ex) {
      nupaths.add("EX");
    }
    if (ce) {
      nupaths.add("CE");
    }

    return nupaths;
  }
}