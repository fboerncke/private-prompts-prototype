
make a suggestion for a regex that helps detecting sensitive information with the following use case:

email: Matches common email address formats.
Use case: Anonymizing personal contact information in documents or databases.


---

email: Matches common email address formats.
Use case: Anonymizing personal contact information in documents or databases.

ipAddress: Matches IPv4 addresses.
Use case: Masking server logs or network-related data.

creditCard: Matches common credit card number formats (Visa, MasterCard, American Express, etc.).
Use case: Securing financial data in transaction logs or user input forms.

ssn: Matches U.S. Social Security Numbers.
Use case: Protecting sensitive personal information in forms or databases.

date: Matches various date formats (e.g., YYYY-MM-DD, DD/MM/YYYY, MM-DD-YY).
Use case: Anonymizing dates in medical records or personal documents.

url: Matches web URLs.
Use case: Removing or masking web addresses in content to prevent unintended linking or data leakage.

zipCode: Matches U.S. ZIP codes (both 5-digit and 9-digit formats).
Use case: Anonymizing location data in address databases.

currencyAmount: Matches currency amounts with optional dollar sign and thousand separators.
Use case: Masking financial figures in reports or transaction records.

credit card numbers:
se case: Matches most credit card numbers with various formats, including dashes or spaces as separators

german Postal Codes:
use case: Matches postal/zip codes, useful for anonymizing location-based information

dates for specific formats:
use case: Matches dates in formats like YYYY-MM-DD, MM/DD/YYYY, or DD.MM.YYYY.

IBAN (International Bank Account Number):
use case: Matches IBANs, useful for anonymizing financial information across countries.

MAC Addresses:
use case: Matches MAC addresses used in networking hardware.

UUID (Universally Unique Identifier):
use case: Matches UUIDs, which are commonly used for unique identification in databases or systems.

File Paths (Unix-style):
use case: Matches Unix-style file paths.







-----

# private-prompts-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
