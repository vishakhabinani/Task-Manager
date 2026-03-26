package com.teamflow.backend.repository;

import com.teamflow.backend.model.Status;
import com.teamflow.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(Status status);
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByCreatedById(Long userId);
    List<Task> findByStatusAndAssignedToId(Status status, Long userId);
}
