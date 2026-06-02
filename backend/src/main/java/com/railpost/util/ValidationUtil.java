package com.railpost.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    /**
     * Gmail email validation
     * Validates that email is in Gmail format (ends with @gmail.com)
     */
    public static boolean isValidGmailEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String gmailPattern = "^[a-zA-Z0-9._%-]+@gmail\\.com$";
        return Pattern.compile(gmailPattern).matcher(email).matches();
    }

    /**
     * Strong password validation
     * Requirements:
     * - Minimum 8 characters
     * - At least one uppercase letter (A-Z)
     * - At least one lowercase letter (a-z)
     * - At least one digit (0-9)
     * - At least one special character (!@#$%^&*_-+=)
     */
    public static boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        boolean hasUppercase = Pattern.compile("[A-Z]").matcher(password).find();
        boolean hasLowercase = Pattern.compile("[a-z]").matcher(password).find();
        boolean hasDigit = Pattern.compile("[0-9]").matcher(password).find();
        boolean hasSpecialChar = Pattern.compile("[!@#$%^&*_\\-+=]").matcher(password).find();

        return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
    }

    /**
     * Sri Lankan phone number validation
     * Format: +94 followed by 9 digits (10 digits total without +94)
     */
    public static boolean isValidSriLankanPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return false;
        }

        String cleanedPhone = phoneNumber.replaceAll("\\s+", ""); // Remove spaces

        String sriLankanPhonePattern = "^\\+94(77|72|70|78|76|63|25|36|55|57|65|32|11|91|33|47|51|21|67|34|81|35|37|23|66|41|54|31|52|38|27|45|26|24)\\d{7}$";

        return Pattern.compile(sriLankanPhonePattern).matcher(cleanedPhone).matches();
    }

    /**
     * Validates phone number without country code (10 digits with valid prefix)
     */
    public static boolean isValidSriLankanPhoneNumberWithoutCountryCode(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return false;
        }

        String cleanedPhone = phoneNumber.replaceAll("\\s+", ""); // Remove spaces

        String sriLankanPhonePattern = "^0(77|72|70|78|76|63|25|36|55|57|65|32|11|91|33|47|51|21|67|34|81|35|37|23|66|41|54|31|52|38|27|45|26|24)\\d{7}$";

        return Pattern.compile(sriLankanPhonePattern).matcher(cleanedPhone).matches();
    }

    /**
     * Email validation (basic RFC 5322 compliant)
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String emailPattern = "^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return Pattern.compile(emailPattern).matcher(email).matches();
    }

}
