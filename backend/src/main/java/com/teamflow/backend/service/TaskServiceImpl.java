package com.teamflow.backend.service;

import com.teamflow.backend.dto.TaskRequest;
import com.teamflow.backend.dto.TaskResponse;
import com.teamflow.backend.exception.BadRequestException;
import com.teamflow.backend.exception.ResourceNotFoundException;
import com.teamflow.backend.exception.UnauthorizedException;
import com.teamflow.backend.model.Role;
import com.teamflow.backend.model.Status;
import com.teamflow.backend.model.Task;
import com.teamflow.backend.model.User;
import com.teamflow.backend.repository.TaskRepository;
import com.teamflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        User assignedTo = null;
        Long reqAssignedId = request.getAssignedToId();
        if (reqAssignedId != null) {
            assignedTo = userRepository.findById(reqAssignedId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + reqAssignedId));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .assignedTo(assignedTo)
                .createdBy(currentUser)
                .build();

        Task savedTask = taskRepository.save(Objects.requireNonNull(task));
        return mapToResponse(Objects.requireNonNull(savedTask));
    }

    @Override
    public List<TaskResponse> getAllTasks(Status status, Long assignedToId) {
        List<Task> tasks;
        if (status != null && assignedToId != null) {
            tasks = taskRepository.findByStatusAndAssignedToId(status, assignedToId);
        } else if (status != null) {
            tasks = taskRepository.findByStatus(status);
        } else if (assignedToId != null) {
            tasks = taskRepository.findByAssignedToId(assignedToId);
        } else {
            tasks = taskRepository.findAll();
        }
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        if (id == null) {
            throw new BadRequestException("Task ID cannot be null");
        }
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        if (id == null) {
            throw new BadRequestException("Task ID cannot be null");
        }
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // Authorization rule: Only Admin or the creator/assignee can update
        if (currentUser.getRole() != Role.ADMIN && 
            !task.getCreatedBy().getId().equals(currentUser.getId()) &&
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId()))) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription()) ;
        task.setStatus(request.getStatus());

        Long assignedToId = request.getAssignedToId();
        if (assignedToId != null) {
            User assignedTo = userRepository.findById(assignedToId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assignedToId));
            task.setAssignedTo(assignedTo);
        } else {
            task.setAssignedTo(null);
        }

        Task savedTask = Objects.requireNonNull(taskRepository.save(task));
        return mapToResponse(Objects.requireNonNull(savedTask));
    }

    @Override
    @Transactional
    public void deleteTask(Long id, User currentUser) {
        if (id == null) {
            throw new BadRequestException("Task ID cannot be null");
        }
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // Authorization rule: Only Admin or the creator can delete
        if (currentUser.getRole() != Role.ADMIN && !Objects.requireNonNull(task.getCreatedBy()).getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this task");
        }

        taskRepository.delete(Objects.requireNonNull(task));
    }

    private TaskResponse mapToResponse(Task task) {
        Objects.requireNonNull(task, "Task cannot be null for mapping");
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .assignedTo(task.getAssignedTo() != null ? mapUserToDto(task.getAssignedTo()) : null)
                .createdBy(mapUserToDto(task.getCreatedBy()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private TaskResponse.UserDto mapUserToDto(User user) {
        return TaskResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
