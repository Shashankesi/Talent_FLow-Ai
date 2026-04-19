package com.talentflow.repository;

import com.talentflow.entity.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByUserId(String userId);
    List<Application> findByJobId(String jobId);
    List<Application> findByUserIdAndJobId(String userId, String jobId);
    List<Application> findByJobIdAndStatus(String jobId, String status);
}
