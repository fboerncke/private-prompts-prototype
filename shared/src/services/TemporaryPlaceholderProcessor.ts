// src/services/TemporaryPlaceholderProcessor.ts

import { faker } from "@faker-js/faker";

/**
 * TemporaryPlaceholderProcessor
 *
 * A utility class for processing placeholder expressions within strings.
 * It handles smart expressions enclosed in curly braces (e.g., `{randomDate(1900,2000,'YYYY-MM-DD')}`)
 * by generating dynamic replacement strings based on the type of expression and provided parameters.
 *
 * ### Usage Example:
 *
 * ```typescript
 * const placeholder = "{randomDate(1900,2000,'YYYY-MM-DD')}";
 * const replacement = TemporaryPlaceholderProcessor.getTemporaryReplacementString(placeholder);
 * console.log(replacement); // Outputs a random date string within the specified range and format.
 * ```
 */
export class TemporaryPlaceholderProcessor {

    static getTemporaryReplacementString(inputString: string): string {
        return inputString.replace(/\{([^{}]+)\}/g, (_match, expression) => {
            return TemporaryPlaceholderProcessor.processExpression(expression);
        });
    }

    /**
     * Processes the placeholder expression and returns a temporary replacement string.
     * 
     * This method checks if the provided placeholder expression is a smart expression
     * enclosed in curly braces (e.g., "{randomFutureDate}"). If it is, the method extracts
     * the smart expression and evaluates it to generate a temporary replacement string.
     * If the expression contains parameters (e.g., "randomDate(1900,2000,'YYYY-MM-DD')"),
     * it parses the parameters and evaluates the expression accordingly. If no parameters
     * are found, it treats the expression as a simple placeholder and evaluates it without parameters.
     * 
     * If the placeholder expression is not a recognized smart expression, the method returns
     * the original input unchanged.
     * 
     * @param placeholderExpression - The placeholder expression to process.
     * @returns The temporary replacement string, or the original expression if not a recognized smart expression.
     */
    static processExpression(placeholderExpression: string): string {
        placeholderExpression = placeholderExpression.trim();

        //        captures function names with or without parentheses
        const match = placeholderExpression.match(/^(\w+)(\((.*?)\))?$/);

        //const match = placeholderExpression.match(/^(\w+)\((.*?)\)$/);
        if (match) {
            const functionName = match[1];
            const rawParams = match[2];
            const params = TemporaryPlaceholderProcessor.parseParams(rawParams);

            return TemporaryPlaceholderProcessor.smartExpressionEvaluator(functionName, params);
        }

        // If it’s not in braces or not a recognized function call, return as literal
        return placeholderExpression;
    }


    /**
     * Parses function parameters from a string.
     * Handles numbers, quoted strings, and ignores extra spaces.
     * 
     * @param rawParams - The raw parameter string to parse.
     * @returns 
     */
    private static parseParams(rawParams: string): (string | number)[] {
        const paramRegex = /"([^"]*)"|'([^']*)'|(\d+)/g;
        const params: (string | number)[] = [];
        let match;

        while ((match = paramRegex.exec(rawParams)) !== null) {
            if (match[1]) params.push(match[1].trim());
            else if (match[2]) params.push(match[2].trim());
            else if (match[3] && match[3].trim() !== "") params.push(parseInt(match[3], 10)); // Ensure numbers are not empty
        }

        return params.filter(param => param !== ""); // Remove empty params
    }


    /**
     * Evaluates the smart expression and returns the corresponding replacement string.
     *
     * To add support for additional smart expressions, extend the switch-case block with new cases.
     * For each case, use appropriate logic or faker methods to generate the replacement string.
     *
     * @param placeholderType - The type of smart expression to evaluate (e.g., "randomFutureDate").
     * @returns The generated replacement string based on the placeholder type.
     *
     * @throws {Error} If the smart expression type is unknown or unsupported.
     */
    private static smartExpressionEvaluator(functionName: string, params: (string | number)[]): string {

        functionName = functionName.toLowerCase();  // Normalize case before evaluation

        switch (functionName) {
            case "loremipsum":
                return TemporaryPlaceholderProcessor.generateLoremIpsum();
            case "city":  // random city
                return TemporaryPlaceholderProcessor.generateRandomCity();
            case "date":
                return TemporaryPlaceholderProcessor.generateRandomDate(params);
            case "futuredate":  // future dates
                return TemporaryPlaceholderProcessor.generateRandomFutureDate(params);
            case "pastdate":  // past dates
                return TemporaryPlaceholderProcessor.generateRandomPastDate(params);
            case "iso2":  // ISO 2-letter country codes
                return TemporaryPlaceholderProcessor.generateRandomISO2();
            case "iso3":  //  ISO 3-letter country codes
                return TemporaryPlaceholderProcessor.generateRandomISO3();

            case "number":  //random number 
                return TemporaryPlaceholderProcessor.generateRandomNumber(params);
            case "phonenumber":  // phone number
                return TemporaryPlaceholderProcessor.generateRandomPhoneNumber();

            case "word":  // pronounceable random string
            case "id":
            case "token":
            case "key":
            case "value":
                return TemporaryPlaceholderProcessor.generateReadableRandomString(params);

            case "ipv4":  // random IP generation
                return TemporaryPlaceholderProcessor.generateRandomIPv4(params);
            case "email":  // random email generation
                return TemporaryPlaceholderProcessor.generateRandomEmail(params);
            case "currency":  // random currency codes
                return TemporaryPlaceholderProcessor.generateRandomCurrency();
            case "price":  // random price 
                return TemporaryPlaceholderProcessor.generateRandomPrice(params);
            case "creditcardnumber":  //  credit card numbers
                return TemporaryPlaceholderProcessor.generateCreditCardNumber(params);
            case "cvc":  //  CVC numbrt
                return TemporaryPlaceholderProcessor.generateCvc();
            case "iban":  // IBAN 
                return TemporaryPlaceholderProcessor.generateIban(params);
            // throwing an error would break the ui, so we just return the placeholder
            default:
                console.warn(`Unknown expression '${functionName}' encountered.`);
                return `{ERROR: Unknown expression '${functionName}'}`;
        }
    }

    ///////////////////////////

    /**
     * Generates a static Lorem Ipsum text.
     * 
     * @returns A predefined "Lorem Ipsum" placeholder text.
     */
    private static generateLoremIpsum(): string {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    }


    /**
     *  * Generates a random city name using Faker.js.
    *
    * @returns A random city name.
    */
    private static generateRandomCity(): string {
        return faker.location.city();
    }

    /**
 * Generates a random ISO-3166-1 Alpha-2 (2-letter) country code.
 *
 * @returns A 2-letter country code (e.g., "US", "DE", "FR").
 */
    private static generateRandomISO2(): string {
        return faker.location.countryCode("alpha-2");
    }

    /**
     * Generates a random ISO-3166-1 Alpha-3 (3-letter) country code.
     *
     * @returns A 3-letter country code (e.g., "USA", "DEU", "FRA").
     */
    private static generateRandomISO3(): string {
        return faker.location.countryCode("alpha-3");
    }

    /**
     * Generates a random date string within a specified range and format.
     *
     * @param params - An array of parameters to specify the date range and format.
     *   - If the first two elements are numbers, they represent the start and end years (inclusive).
     *   - If the third element is a string, it represents the date format.
     *     - Default format is "YYYY-MM-DD".
     *     - Supported format tokens: "YYYY" for year, "MM" for month, "DD" for day.
     * 
     * @returns A string representing a randomly generated date in the specified format.
     * 
     * @example
     * // Generates a random date between 2000 and 2030 in "YYYY-MM-DD" format
     * const randomDate1 = TemporaryPlaceholderProcessor.generateRandomDate([]);
     * 
     * // Generates a random date between 1990 and 2020 in "YYYY-MM-DD" format
     * const randomDate2 = TemporaryPlaceholderProcessor.generateRandomDate([1990, 2020]);
     * 
     * // Generates a random date between 2000 and 2030 in "DD/MM/YYYY" format
     * const randomDate3 = TemporaryPlaceholderProcessor.generateRandomDate([2000, 2030, "DD/MM/YYYY"]);
     */
    private static generateRandomDate(params: (string | number)[]): string {
        let startYear = 2000, endYear = 2030, format = "YYYY-MM-DD";

        // NEW: If params are empty (i.e., {randomDate}), use default values
        if (params.length >= 2) {
            if (typeof params[0] === "number" && typeof params[1] === "number") {
                startYear = params[0];
                endYear = params[1];
            } else {
                console.warn("Invalid year parameters detected. Using default range 2000-2030.");
            }
        }

        if (params.length >= 3 && typeof params[2] === "string" && params[2].trim() !== "") {
            format = params[2].trim();
        }

        // Generate random numbers within specified range
        const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomYear = randomInRange(startYear, endYear);
        const randomMonth = randomInRange(1, 12);
        const randomDay = randomInRange(1, 28);

        return format
            .replace("YYYY", randomYear.toString())
            .replace("MM", String(randomMonth).padStart(2, "0"))
            .replace("DD", String(randomDay).padStart(2, "0"));
    }

    private static generateRandomEmail(params: (string | number)[]): string {
        if (params.length > 0 && typeof params[0] === "string" && params[0].includes(".")) {
            return faker.internet.email({ provider: params[0] });
        }
        return faker.internet.email(); // generate a random email
    }

    /**
     * Generates a random IPv4 address
     *
     * @param params - currently ignored
     * @returns A random IP V4 address.
     */
    private static generateRandomIPv4(_params: (string | number)[]): string {
        return faker.internet.ipv4(); // Generates a standard IPv4 address
    }

    /**
     * Generates a random number.
     * 
     * Supports:
     * - `{randomNumber()}` → Default **1-1000**.
     * - `{randomNumber(5,100)}` → Custom range.
     * - `{randomNumber(0,9)}` → Single-digit number.
     *
     * @param params - Optional min/max values.
     * @returns A random number as a string.
     */
    private static generateRandomNumber(params: (string | number)[]): string {
        let min = 1, max = 1000;

        if (params.length >= 2 && typeof params[0] === "number" && typeof params[1] === "number") {
            min = params[0];
            max = params[1];
        }

        return faker.number.int({ min, max }).toString(); // Generates a random integer
    }

    /**
     * Generates a random phone number.
     * @returns A random phone number.
     */
    private static generateRandomPhoneNumber(): string {
        return faker.phone.number({ style: 'international' }) // '+15551234567'
    }


    /**
     * Generates a readable, pronounceable random string.
     * Ensures a balance of vowels and consonants for better pronunciation.
     *
     * @param params - If provided, uses the first parameter as the string length.
     * @returns A pronounceable alphanumeric string of the given length.
     */
    private static generateReadableRandomString(params: (string | number)[]): string {
        const vowels = "aeiou";  // Limited vowel set for readability
        const consonants = "bcdfghjklmnpqrstvwxyz"; // Common consonants
        const length = (params.length > 0 && typeof params[0] === "number" && params[0] > 0) ? params[0] : 8; // Default length = 8

        let result = "";
        let useVowel = Math.random() > 0.5;  // Start with either vowel or consonant

        for (let i = 0; i < length; i++) {
            if (useVowel) {
                result += vowels[Math.floor(Math.random() * vowels.length)];
            } else {
                result += consonants[Math.floor(Math.random() * consonants.length)];
            }
            useVowel = !useVowel; // Alternate between vowel & consonant
        }

        return result.charAt(0).toUpperCase() + result.slice(1); // Capitalize first letter for better readability
    }

    /**
 * Generates a random ISO 4217 currency code.
 *
 * @returns A 3-letter currency code (e.g., "USD", "EUR").
 */
    private static generateRandomCurrency(): string {
        return faker.finance.currencyCode(); // ✅ Uses Faker.js to generate a random currency
    }

    /**
     * Generates a random price.
     * 
     * Supports:
     * - `{randomPrice()}` → Default range **1-1000**, no currency.
     * - `{randomPrice(5,100)}` → Custom range.
     * - `{randomPrice("USD")}` → Random price in USD with a **currency symbol**.
     * - `{randomPrice(10,50, "EUR")}` → Custom range + currency.
     *
     * @param params - Optional min/max range and currency code.
     * @returns A formatted price string.
     */
    private static generateRandomPrice(params: (string | number)[]): string {
        let min = 1, max = 1000, currency = "";

        if (params.length >= 2 && typeof params[0] === "number" && typeof params[1] === "number") {
            min = params[0];
            max = params[1];
        }

        if (params.length >= 1 && typeof params[0] === "string" && params[0].length === 3) {
            currency = params[0].toUpperCase();
        } else if (params.length === 3 && typeof params[2] === "string" && params[2].length === 3) {
            currency = params[2].toUpperCase();
        }

        const price = faker.finance.amount({ min, max, dec: 2 }); // generates a random price with 2 decimals

        if (currency) {
            return `${price} ${currency}`; // Example: "12.99 USD"
        }
        return price; // Example: "47.99"
    }

    /**
     * Generates a fake credit card number.
     *
     * Supports:
     * - `{creditCardNumber()}` → Default to **Visa**.
     * - `{creditCardNumber("Mastercard")}` → Specific brand.
     * - `{creditCardNumber("Amex")}` → American Express.
     *
     * @param params - Optional card type.
     * @returns A valid-looking fake credit card number.
     */
    private static generateCreditCardNumber(params: (string | number)[]): string {
        let cardType = "Visa"; // Default card type

        if (params.length > 0 && typeof params[0] === "string") {
            cardType = params[0].trim();
        }

        return faker.finance.creditCardNumber(cardType);
    }

    /**
     * Generates a fake 3-digit CVC code.
     *
     * Supports:
     * - `{cvc()}` → Generates a **3-digit** security code.
     *
     * @returns A 3-digit CVC code as a string.
     */
    private static generateCvc(): string {
        return faker.finance.creditCardCVV();
    }

    /**
     * Generates a fake IBAN.
     *
     * Supports:
     * - `{iban()}` → Default to a random IBAN.
     * - `{iban("DE")}` → German IBAN.
     * - `{iban("FR")}` → French IBAN.
     *
     * @param params - Optional country code.
     * @returns A valid-looking fake IBAN.
     */
    private static generateIban(params: (string | number)[]): string {
        let countryCode = undefined; // Default: Random IBAN

        if (params.length > 0 && typeof params[0] === "string" && params[0].length === 2) {
            countryCode = params[0].toUpperCase();
        }

        return faker.finance.iban({ countryCode });
    }



    /**
 * Generates a random future date.
 *
 * Supports:
 * - `{randomFutureDate()}` → Default **1-5 years in the future**.
 * - `{randomFutureDate(10)}` → Up to **10 years in the future**.
 * - `{randomFutureDate(3, "DD/MM/YYYY")}` → Custom range & format.
 *
 * @param params - Optional max range in years and date format.
 * @returns A formatted future date string.
 */
    private static generateRandomFutureDate(params: (string | number)[]): string {
        let maxYears = 5, format = "YYYY-MM-DD";

        if (params.length >= 1 && typeof params[0] === "number") {
            maxYears = params[0];
        }

        if (params.length >= 2 && typeof params[1] === "string") {
            format = params[1].trim();
        }

        const futureDate = faker.date.future({ years: maxYears });

        return TemporaryPlaceholderProcessor.formatDate(futureDate, format);
    }

    /**
     * Generates a random past date.
     *
     * Supports:
     * - `{randomPastDate()}` → Default **1-5 years in the past**.
     * - `{randomPastDate(10)}` → Up to **10 years in the past**.
     * - `{randomPastDate(3, "DD.MM.YYYY")}` → Custom range & format.
     *
     * @param params - Optional max range in years and date format.
     * @returns A formatted past date string.
     */
    private static generateRandomPastDate(params: (string | number)[]): string {
        let maxYears = 5, format = "YYYY-MM-DD";

        if (params.length >= 1 && typeof params[0] === "number") {
            maxYears = params[0];
        }

        if (params.length >= 2 && typeof params[1] === "string") {
            format = params[1].trim();
        }

        const pastDate = faker.date.past({ years: maxYears });

        return TemporaryPlaceholderProcessor.formatDate(pastDate, format);
    }

    /**
     * Formats a Date object into a specified format.
     *
     * @param date - The Date object to format.
     * @param format - The desired date format.
     * @returns A formatted date string.
     */
    private static formatDate(date: Date, format: string): string {
        const yyyy = date.getFullYear().toString();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return format
            .replace("YYYY", yyyy)
            .replace("MM", mm)
            .replace("DD", dd);
    }

}
