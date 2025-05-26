package com.planorama.backend.event.entity;

public record DiagramTextDAO(String color,
                             Double height,
                             String id,
                             String label,
                             String type,
                             Double width,
                             Double x,
                             Double y) implements DiagramObjectDAO {
}