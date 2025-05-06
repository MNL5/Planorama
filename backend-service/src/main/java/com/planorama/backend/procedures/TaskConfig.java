package com.planorama.backend.procedures;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

@Configuration
@EnableScheduling
public class TaskConfig implements SchedulingConfigurer {
    private final EventNotifierTask task;

    public TaskConfig(EventNotifierTask task) {
        this.task = task;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar registrar) {
        registrar.addCronTask(task, "0 0 9 * * *");
    }
}