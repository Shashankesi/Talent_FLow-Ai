package com.talentflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.talentflow.repository")
public class TalentFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(TalentFlowApplication.class, args);
    }
}
