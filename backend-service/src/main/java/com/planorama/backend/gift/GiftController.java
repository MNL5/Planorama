package com.planorama.backend.gift;

import com.planorama.backend.gift.api.CreateGiftDTO;
import com.planorama.backend.gift.api.GiftDTO;
import com.planorama.backend.gift.api.UpdateGiftDTO;
import com.planorama.backend.gift.mapper.GiftMapper;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

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
    public Mono<GiftDTO> createGift(@RequestBody CreateGiftDTO createGiftDTO) {
        return giftService.createGift(createGiftDTO)
                .map(giftMapper::daoToDTO);
    }

    @PutMapping("/{giftId}")
    public Mono<GiftDTO> updateGift(@PathVariable("giftId") String giftId,
                                    @RequestBody UpdateGiftDTO updateGiftDTO) {
        return giftService.updateGift(giftId, updateGiftDTO)
                .map(giftMapper::daoToDTO);
    }

    @DeleteMapping("/{giftId}")
    public Mono<GiftDTO> deleteGift(@PathVariable("giftId") UUID giftID) {
        return giftService.deleteGift(giftID)
                .map(giftMapper::daoToDTO);
    }
}