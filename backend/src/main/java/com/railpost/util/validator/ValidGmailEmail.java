package com.railpost.util.validator;

import com.railpost.util.ValidationUtil;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = GmailValidator.class)
@Documented
public @interface ValidGmailEmail {
    String message() default "Email must be a valid Gmail address (@gmail.com)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

class GmailValidator implements ConstraintValidator<ValidGmailEmail, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || ValidationUtil.isValidGmailEmail(value);
    }
}
