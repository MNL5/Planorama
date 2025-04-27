package com.planorama.backend.event.entity;

public record DiagramTableDAO(String color,
                              Double height,
                              String id,
                              String label,
                              Integer seatCount,
                              String type,
                              Double width,
                              Double x,
                              Double y) implements DiagramObjectDAO {
}