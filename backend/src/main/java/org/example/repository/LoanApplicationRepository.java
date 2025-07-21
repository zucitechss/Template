package org.example.repository;

import org.example.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByStatus(String status);

    // Custom query to fetch the most recent loan application
    @Query("SELECT la FROM LoanApplication la ORDER BY la.id DESC")
    LoanApplication findTopByOrderByIdDesc();
}
