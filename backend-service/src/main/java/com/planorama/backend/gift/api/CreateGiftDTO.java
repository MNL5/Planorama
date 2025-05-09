package com.planorama.backend.gift.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateGiftDTO(@NotEmpty String eventId,
                            @NotEmpty String guestId,
                            @Positive @NotNull Double amount,
                            @Nullable String greeting) {
}