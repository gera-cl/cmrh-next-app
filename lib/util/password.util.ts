export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  customSymbols: string;
}

export interface PasswordGeneratorConfig {
  uppercase: string;
  lowercase: string;
  numbers: string;
  defaultSymbols: string;
}

const DEFAULT_CONFIG: PasswordGeneratorConfig = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  defaultSymbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/**
 * Generates a random password based on the provided options
 * @param options - Configuration for password generation
 * @param config - Optional custom character sets (uses defaults if not provided)
 * @returns Generated password string
 */
export function generatePassword(
  options: PasswordOptions,
  config: PasswordGeneratorConfig = DEFAULT_CONFIG,
): string {
  let charset = "";

  if (options.includeUppercase) {
    charset += config.uppercase;
  }

  if (options.includeLowercase) {
    charset += config.lowercase;
  }

  if (options.includeNumbers) {
    charset += config.numbers;
  }

  if (options.includeSymbols) {
    charset += options.customSymbols || config.defaultSymbols;
  }

  // Return empty string if no character types are selected
  if (charset === "") {
    return "";
  }

  let password = "";

  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);

    password += charset.charAt(randomIndex);
  }

  return password;
}

/**
 * Validates password generation options
 * @param options - Password options to validate
 * @returns Object with validation result and error message if any
 */
export function validatePasswordOptions(options: PasswordOptions): {
  isValid: boolean;
  error?: string;
} {
  if (options.length < 1) {
    return { isValid: false, error: "Password length must be at least 1" };
  }

  if (options.length > 1000) {
    return {
      isValid: false,
      error: "Password length cannot exceed 1000 characters",
    };
  }

  const hasAnyCharacterType =
    options.includeUppercase ||
    options.includeLowercase ||
    options.includeNumbers ||
    options.includeSymbols;

  if (!hasAnyCharacterType) {
    return {
      isValid: false,
      error: "At least one character type must be selected",
    };
  }

  if (options.includeSymbols && !options.customSymbols) {
    return {
      isValid: false,
      error: "Custom symbols cannot be empty when symbols are enabled",
    };
  }

  return { isValid: true };
}

/**
 * Creates default password options
 * @returns Default password generation options
 */
export function createDefaultPasswordOptions(): PasswordOptions {
  return {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    customSymbols: DEFAULT_CONFIG.defaultSymbols,
  };
}

/**
 * Estimates password strength based on character set and length
 * @param options - Password options to analyze
 * @returns Object with strength information
 */
export function estimatePasswordStrength(options: PasswordOptions): {
  charsetSize: number;
  entropy: number;
  strength: "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong";
} {
  let charsetSize = 0;

  if (options.includeUppercase) charsetSize += 26;
  if (options.includeLowercase) charsetSize += 26;
  if (options.includeNumbers) charsetSize += 10;
  if (options.includeSymbols) charsetSize += options.customSymbols?.length || 0;

  const entropy = Math.log2(Math.pow(charsetSize, options.length));

  let strength:
    | "very-weak"
    | "weak"
    | "fair"
    | "good"
    | "strong"
    | "very-strong";

  if (entropy < 30) {
    strength = "very-weak";
  } else if (entropy < 50) {
    strength = "weak";
  } else if (entropy < 70) {
    strength = "fair";
  } else if (entropy < 90) {
    strength = "good";
  } else if (entropy < 120) {
    strength = "strong";
  } else {
    strength = "very-strong";
  }

  return { charsetSize, entropy, strength };
}
