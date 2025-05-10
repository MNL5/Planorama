package com.planorama.backend.gift;

import com.planorama.backend.gift.api.GiftDTO;
import com.planorama.backend.gift.api.UpsertGiftDTO;
import com.planorama.backend.gift.mapper.GiftMapper;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
    public Flux<GiftDTO> getGiftsByEventId(@RequestParam("event") String eventID) {
        return giftService.findGiftByEventID(eventID)
                .map(giftMapper::daoToDTO);
    }

    @PostMapping
    public Mono<GiftDTO> upsertGift(@RequestBody UpsertGiftDTO upsertGiftDTO) {
        return giftService.upsertGift(upsertGiftDTO)
                .map(giftMapper::daoToDTO);
    }
}