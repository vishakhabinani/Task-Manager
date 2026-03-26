package com.teamflow.backend.service;

import com.teamflow.backend.dto.TaskRequest;
import com.teamflow.backend.dto.TaskResponse;
import com.teamflow.backend.model.Status;
import com.teamflow.backend.model.User;
import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, User currentUser);
    List<TaskResponse> getAllTasks(Status status, Long assignedToId);
    TaskResponse getTaskById(Long id);
    TaskResponse updateTask(Long id, TaskRequest request, User currentUser);
    void deleteTask(Long id, User currentUser);
}
