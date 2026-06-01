package com.railpost.util.validator;

import com.railpost.util.ValidationUtil;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SriLankanPhoneValidator.class)
@Documented
public @interface ValidSriLankanPhone {
    String message() default "Phone number must be a valid Sri Lankan number (10 digits with +94 prefix or operator codes 077, 072, 070, 078, 076)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

class SriLankanPhoneValidator implements ConstraintValidator<ValidSriLankanPhone, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        // Accept both formats: with +94 prefix or without
        return ValidationUtil.isValidSriLankanPhoneNumber(value) || 
               ValidationUtil.isValidSriLankanPhoneNumberWithoutCountryCode(value);
    }
}
