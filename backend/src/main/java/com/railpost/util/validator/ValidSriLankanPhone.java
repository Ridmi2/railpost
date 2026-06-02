package com.railpost.util.validator;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.util.Arrays;
import java.util.List;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SriLankanPhoneValidator.class)
@Documented
public @interface ValidSriLankanPhone {
    String message() default "Invalid phone number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

class SriLankanPhoneValidator implements ConstraintValidator<ValidSriLankanPhone, String> {

    private static final List<String> VALID_CODES = Arrays.asList(
        "77", "72", "70", "78", "76",
        "63", "25", "36", "55", "57", "65", "32", "11", "91", "33", "47", "51", "21", "67", "34", "81", "35", "37", "23", "66", "41", "54", "31", "52", "38", "27", "45", "26", "24"
    );

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        String cleanedPhone = value.replaceAll("\\s+", "");

        boolean hasValidPrefix = cleanedPhone.startsWith("+94") || cleanedPhone.startsWith("0");
        if (!hasValidPrefix) {
            setCustomMessage(context, "Phone number must start with +94 or 0");
            return false;
        }

        String code = "";

        if (cleanedPhone.startsWith("+94")) {
            if (cleanedPhone.length() != 12) {
                setCustomMessage(context, "Phone number must contain exactly 12 characters when starting with +94");
                return false;
            }
            if (!cleanedPhone.substring(1).matches("\\d+")) {
                setCustomMessage(context, "Phone number must contain only digits");
                return false;
            }
            code = cleanedPhone.substring(3, 5);
        } else if (cleanedPhone.startsWith("0")) {
            if (cleanedPhone.length() != 10) {
                setCustomMessage(context, "Phone number must contain exactly 10 digits");
                return false;
            }
            if (!cleanedPhone.matches("\\d+")) {
                setCustomMessage(context, "Phone number must contain only digits");
                return false;
            }
            code = cleanedPhone.substring(1, 3);
        }

        if (!VALID_CODES.contains(code)) {
            setCustomMessage(context, "The phone code is not valid");
            return false;
        }

        return true;
    }

    private void setCustomMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
    }
}
