package com.planorama.backend.task.mapper;

import com.planorama.backend.task.api.TaskDTO;
import com.planorama.backend.task.entity.TaskDAO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDTO daoToDTO(TaskDAO taskDAO);
}