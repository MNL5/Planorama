package com.planorama.backend.gift;

import com.planorama.backend.gift.api.GiftDTO;
import com.planorama.backend.gift.api.UpsertGiftDTO;
import com.planorama.backend.gift.mapper.GiftMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("gifts")
public class GiftController {
    private final GiftService giftService;
    private final GiftMapper giftMapper;

    public GiftController(GiftService eventService,
                          GiftMapper eventMapper) {
        this.giftService = eventService;
        this.giftMapper = eventMapper;
    }

    @GetMapping
    @PreAuthorize("hasAuthority(#eventID)")
    public List<GiftDTO> getGiftsByEventId(@RequestParam("event") String eventID) {
        return giftService.findGiftByEventID(eventID)
                .map(giftMapper::daoToDTO)
                .collectList()
                .block();
    }

    @PostMapping
    public GiftDTO upsertGift(@RequestBody UpsertGiftDTO upsertGiftDTO) {
        return giftService.upsertGift(upsertGiftDTO)
                .map(giftMapper::daoToDTO)
                .block();
    }
}