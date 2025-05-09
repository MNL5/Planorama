package com.planorama.backend.gift.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateGiftDTO(@Positive @NotNull Double amount,
                            @Nullable String greeting) {
}