package com.planorama.backend.task;

import com.planorama.backend.task.api.CreateTaskDTO;
import com.planorama.backend.task.api.UpdateTaskDTO;
import com.planorama.backend.task.entity.TaskDAO;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class TaskService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, Function<UpdateTaskDTO, Object>> updateFields;

    public TaskService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(
                TaskDAO.DESCRIPTION_FIELD, UpdateTaskDTO::description,
                TaskDAO.FULFILLED_FIELD, u -> u.fulfilled() != null && u.fulfilled()
        );
    }

    public Flux<TaskDAO> getAllTaskByEvent(String eventId) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(TaskDAO.EVENT_ID_FIELD).is(eventId)), TaskDAO.class);
    }

    public Mono<TaskDAO> createTask(CreateTaskDTO createTaskDTO) {
        return reactiveMongoTemplate.save(createTaskDAO(createTaskDTO));
    }

    private TaskDAO createTaskDAO(CreateTaskDTO createTaskDTO) {
        return new TaskDAO(UUID.randomUUID(),
                createTaskDTO.eventId(),
                createTaskDTO.description(),
                createTaskDTO.fulfilled() != null && createTaskDTO.fulfilled());
    }

    public Mono<TaskDAO> updateTask(UUID taskId, UpdateTaskDTO updateTaskDTO) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(TaskDAO.ID_FIELD).is(taskId)),
                createUpdateCommand(updateTaskDTO),
                FindAndModifyOptions.options().returnNew(true),
                TaskDAO.class);

    }

    private Update createUpdateCommand(UpdateTaskDTO updateTaskDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(updateTaskDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }

    public Mono<TaskDAO> deleteTask(UUID taskId) {
        return reactiveMongoTemplate.findAndRemove(Query.query(Criteria.where(TaskDAO.ID_FIELD).is(taskId)), TaskDAO.class);
    }

    public Mono<TaskDAO> findById(UUID id) {
        return reactiveMongoTemplate.findById(id, TaskDAO.class);
    }
}