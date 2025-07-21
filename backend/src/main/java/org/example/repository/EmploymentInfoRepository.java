package org.example.repository;

import org.example.entity.EmploymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmploymentInfoRepository extends JpaRepository<EmploymentInfo, Long> {
    // You can add custom query methods if needed
}