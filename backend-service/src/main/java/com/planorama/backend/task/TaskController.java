package com.planorama.backend.task;

import com.planorama.backend.task.api.CreateTaskDTO;
import com.planorama.backend.task.api.TaskDTO;
import com.planorama.backend.task.api.UpdateTaskDTO;
import com.planorama.backend.task.mapper.TaskMapper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;


@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService,
                          TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @GetMapping
    public Flux<TaskDTO> getTasksByEvent(@RequestParam("event") String eventId) {
        return taskService.getAllTaskByEvent(eventId)
                .map(taskMapper::daoToDTO);
    }

    @PostMapping
    public Mono<TaskDTO> createTask(@Valid CreateTaskDTO createTaskDTO) {
        return taskService.createTask(createTaskDTO)
                .map(taskMapper::daoToDTO);
    }

    @PutMapping("/{taskId}")
    public Mono<TaskDTO> updateTask(@PathVariable("taskId") UUID taskId,
                                    @Valid UpdateTaskDTO updateTaskDTO) {
        return taskService.updateTask(taskId, updateTaskDTO)
                .map(taskMapper::daoToDTO);
    }

    @DeleteMapping("/{taskId}")
    public Mono<TaskDTO> deleteTask(@PathVariable("taskId") UUID taskId) {
        return taskService.deleteTask(taskId)
                .map(taskMapper::daoToDTO);
    }
}