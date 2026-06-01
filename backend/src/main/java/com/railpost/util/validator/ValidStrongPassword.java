package com.railpost.util.validator;

import com.railpost.util.ValidationUtil;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
@Documented
public @interface ValidStrongPassword {
    String message() default "Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character (!@#$%^&*_-+=)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

class StrongPasswordValidator implements ConstraintValidator<ValidStrongPassword, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || ValidationUtil.isStrongPassword(value);
    }
}
