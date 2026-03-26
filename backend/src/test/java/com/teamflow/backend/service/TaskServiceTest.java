package com.teamflow.backend.service;

import com.teamflow.backend.dto.TaskRequest;
import com.teamflow.backend.dto.TaskResponse;
import com.teamflow.backend.model.Role;
import com.teamflow.backend.model.Status;
import com.teamflow.backend.model.Task;
import com.teamflow.backend.model.User;
import com.teamflow.backend.repository.TaskRepository;
import com.teamflow.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User currentUser;
    private TaskRequest taskRequest;

    @BeforeEach
    void setUp() {
        currentUser = User.builder()
                .id(1L)
                .email("user@test.com")
                .role(Role.USER)
                .name("Test User")
                .build();

        taskRequest = TaskRequest.builder()
                .title("Test Task")
                .description("Test Description")
                .status(Status.TODO)
                .build();
    }

    @Test
    void createTask_Success() {
        Task savedTask = Task.builder()
                .id(1L)
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .createdBy(currentUser)
                .build();

        when(taskRepository.save(any(Task.class))).thenReturn(Objects.requireNonNull(savedTask));

        TaskResponse response = taskService.createTask(taskRequest, currentUser);

        assertNotNull(response);
        assertEquals(Objects.requireNonNull(savedTask).getId(), response.getId());
        assertEquals(savedTask.getTitle(), response.getTitle());
        assertEquals(savedTask.getDescription(), response.getDescription());
        assertEquals(savedTask.getStatus(), response.getStatus());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void deleteTask_Success() {
        Task task = Task.builder()
                .id(1L)
                .createdBy(currentUser)
                .build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(java.util.Objects.requireNonNull(task)));

        taskService.deleteTask(1L, currentUser);

        verify(taskRepository, times(1)).delete(java.util.Objects.requireNonNull(task));
    }
}
