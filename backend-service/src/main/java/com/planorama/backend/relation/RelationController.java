package com.planorama.backend.relation;

import com.planorama.backend.relation.api.CreateRelationDTO;
import com.planorama.backend.relation.api.RelationAPI;
import com.planorama.backend.relation.api.RelationDTO;
import com.planorama.backend.relation.api.UpdateRelationDTO;
import com.planorama.backend.relation.mapper.RelationMapper;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/relations")
public class RelationController implements RelationAPI {
    private final RelationService relationService;
    private final RelationMapper mapper;

    public RelationController(RelationService relationService,
                              RelationMapper mapper) {
        this.relationService = relationService;
        this.mapper = mapper;
    }

    @GetMapping
    @Override
    public Flux<RelationDTO> getAllRelationsByEventID(@RequestParam("event") String eventId) {
        return relationService.findAllByEventId(eventId)
                .map(mapper::daoToDTO);
    }

    @PostMapping
    public Mono<RelationDTO> createRelation(@RequestBody CreateRelationDTO createRelationDTO) {
        return relationService.createRelation(createRelationDTO)
                .map(mapper::daoToDTO);
    }

    @PutMapping("/{relationId}")
    public Mono<RelationDTO> updateRelation(@RequestBody UpdateRelationDTO updateRelationDTO,
                                            @PathVariable("relationId") UUID relationId) {
        return relationService.updateRelation(updateRelationDTO, relationId)
                .map(mapper::daoToDTO);
    }

    @DeleteMapping("/{relationId}")
    public Mono<RelationDTO> deleteRelation(@PathVariable("relationId") UUID relationId) {
        return relationService.deleteRelation(relationId)
                .map(mapper::daoToDTO);
    }
}