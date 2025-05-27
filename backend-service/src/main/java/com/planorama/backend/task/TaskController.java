package com.planorama.backend.task;

import com.planorama.backend.common.EventEntityAPI;
import com.planorama.backend.task.api.CreateTaskDTO;
import com.planorama.backend.task.api.TaskDTO;
import com.planorama.backend.task.api.UpdateTaskDTO;
import com.planorama.backend.task.mapper.TaskMapper;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController("tasks")
@RequestMapping("/tasks")
public class TaskController implements EventEntityAPI<TaskDTO> {
    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService,
                          TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @Override
    public TaskDTO findById(UUID id) {
        return taskService.findById(id)
                .map(taskMapper::daoToDTO)
                .block();
    }

    @GetMapping
    @PreAuthorize("hasAuthority(#eventId)")
    public List<TaskDTO> getTasksByEvent(@RequestParam("event") String eventId) {
        return taskService.getAllTaskByEvent(eventId)
                .map(taskMapper::daoToDTO)
                .collectList()
                .block();
    }

    @PostMapping
    @PreAuthorize("hasAuthority(#createTaskDTO.eventId)")
    public TaskDTO createTask(@Valid CreateTaskDTO createTaskDTO) {
        return taskService.createTask(createTaskDTO)
                .map(taskMapper::daoToDTO)
                .block();
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("@securityUtils.canAccessEntity('tasks', #taskId, authentication)")
    public TaskDTO updateTask(@PathVariable("taskId") UUID taskId,
                              @Valid UpdateTaskDTO updateTaskDTO) {
        return taskService.updateTask(taskId, updateTaskDTO)
                .map(taskMapper::daoToDTO)
                .block();
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("@securityUtils.canAccessEntity('tasks', #taskId, authentication)")
    public TaskDTO deleteTask(@PathVariable("taskId") UUID taskId) {
        return taskService.deleteTask(taskId)
                .map(taskMapper::daoToDTO)
                .block();
    }
}