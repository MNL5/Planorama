package com.planorama.backend.relation;

import com.planorama.backend.relation.api.CreateRelationDTO;
import com.planorama.backend.relation.api.RelationAPI;
import com.planorama.backend.relation.api.RelationDTO;
import com.planorama.backend.relation.api.UpdateRelationDTO;
import com.planorama.backend.relation.mapper.RelationMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController("relations")
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
    @PreAuthorize("hasAuthority(#eventId)")
    public List<RelationDTO> getAllRelationsByEventID(@RequestParam("event") String eventId) {
        return relationService.findAllByEventId(eventId)
                .map(mapper::daoToDTO)
                .collectList()
                .block();
    }

    @PostMapping
    @PreAuthorize("hasAuthority(#createRelationDTO.eventId)")
    public RelationDTO createRelation(@RequestBody CreateRelationDTO createRelationDTO) {
        return relationService.createRelation(createRelationDTO)
                .map(mapper::daoToDTO)
                .block();
    }

    @PutMapping("/{relationId}")
    @PreAuthorize("@securityUtils.canAccessEntity('relations', #relationId, authentication)")
    public RelationDTO updateRelation(@RequestBody UpdateRelationDTO updateRelationDTO,
                                      @PathVariable("relationId") UUID relationId) {
        return relationService.updateRelation(updateRelationDTO, relationId)
                .map(mapper::daoToDTO)
                .block();
    }

    @DeleteMapping("/{relationId}")
    @PreAuthorize("@securityUtils.canAccessEntity('relations', #relationId, authentication)")
    public RelationDTO deleteRelation(@PathVariable("relationId") UUID relationId) {
        return relationService.deleteRelation(relationId)
                .map(mapper::daoToDTO)
                .block();
    }

    @Override
    public RelationDTO findById(UUID id) {
        return relationService.findById(id)
                .map(mapper::daoToDTO)
                .block();
    }
}