package com.talentflow.repository;

import com.talentflow.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByRecruiterId(String recruiterId);
    List<Job> findByTitleContainingIgnoreCase(String title);
    List<Job> findByLocationContainingIgnoreCase(String location);
    List<Job> findByRequiredSkillsContainingIgnoreCase(String skill);
    List<Job> findByIsClosed(Boolean isClosed);
}
