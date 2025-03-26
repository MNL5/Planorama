package com.planorama.backend.user.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record LoginUserAction(@Email @NotNull @NotEmpty String email, @NotNull @NotEmpty String password) {
}
