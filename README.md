# Private Prompts

**Private Prompts** is an application designed to manage your AI prompts securely and locally on your device, ensuring your sensitive data remains under your control. It supports multiple platforms (Windows/Linux/macOS) and offers comprehensive features like prompt management, sensitive data masking, and an optional integration with external AI services (currently OpenAI only), with potential future support for additional providers.

## Problem and Solution

Problem: In today’s digital landscape, we often share personal information—such as résumés, private letters, and confidential notes—via online applications, potentially losing control over how that data is managed or archived. There’s a risk of unintended exposure or use in training future AI models, and data breaches can further compromise user privacy.

Solution: Private Prompts enables you to harness AI’s power without sending sensitive data beyond your own computer. By pre-processing prompts locally, the application ensures that confidential details never leave your device, even if you use external AI services for final text generation. This approach safeguards your information from data harvesting, offline or cloud-based storage you can’t monitor, and future AI-training pipelines.

## Core Philosophy: Why Privacy Matters

The core principle of **Private Prompts** is that private and personal information should remain exclusively on the user's computer. This ensures that data remains secure and under the user's control at all times. Consequently, **Private Prompts** is specifically designed as a desktop application, deliberately avoiding the use of web-based solutions. This approach guarantees that sensitive data is not transmitted over the internet or stored on external servers.

**Your data belongs to you**: By designing **Private Prompts** as a desktop application, it is ensured that all your data remains under your control, safeguarding it from potential breaches associated with web-based solutions. This is not a limitation but a deliberate decision to prioritize privacy.

For these reasons, there are no plans to develop a web application for **Private Prompts**, and this feature is not in the roadmap. This makes **Private Prompts** ideal for users who prioritize privacy and want to keep their personal data strictly confidential when using AI tools.

## Key Features: How Private Prompts Protects Your Data

- **Centralized Prompt Management**  
  Keep all AI prompts organized in one place with easy editing, tagging, and categorization.

- **Data Privacy Emphasis** & **Pseudonymization**
  Define what you consider sensitive data. The app can automatically mask confidential information before sending it to an external AI service.
  Automatically replaces sensitive information (like names) with placeholders to protect your privacy. These placeholders can be swapped back later to the original details in the responses.
 
- **Privacy Focus**: Ensures that your personal data is not shared with AI tools, making it safe to use without exposing personal information.

- **Global History & Undo**  
  An internal history logs prompt modifications, allowing changes to be reverted if needed.

- **Localization (i18n)**: Supports multiple languages and allows seamless switching between them, ensuring global accessibility.

- **Import/Export**  
  Prompts, rule sets, and full configurations can be easily imported and exported as JSON files.

- **Themes**  
  Light and dark themes can be switched globally.

- **Multi-Platform Support**
  Pre-built binaries available for Windows, Linux, and macOS.

## How Effective Is Private Prompts' Pseudonymization?

**Private Prompts** pseudonymizes sensitive information by replacing it with temporary placeholders, ensuring privacy protection. However, it's important to understand the strengths and limitations of this process:

- **Effectiveness**: The pseudonymization process is highly effective in removing previously defined sensitive information from prompts before they are shared with AI tools. This significantly reduces the risk of privacy breaches.

- **Conflict resolution**: User-defined replacement rules may occasionally conflict with existing text in a prompt, potentially causing unexpected results and preventing correct unmasking. A built-in mechanism automatically detects and resolves such conflicts in the background, ensuring a seamless experience.

- **Limitations**: Pseudonymization offers strong privacy protection but does not ensure absolute anonymity. Specific patterns or contextual clues in prompts may still allow re-identification, especially when combined with external data.

## Pseudonymization in Action

Observe how Private Prompts identifies and masks sensitive information in the following example prompt:

```markdown
<!-- Input Prompt with Sensitive Data -->
Create a personalized cover letter for Frank Börncke (email: frank.boerncke@gmail.com)
applying for the Senior Developer position at TechCorp, emphasizing his experience
with proprietary systems and confidential project details.
```

```markdown
<!-- Pseudonymized Prompt -->
Create a personalized cover letter for John Doe (email: john.doe@yahoo.com)
applying for the Senior Developer position at TechCorp, emphasizing his experience
with proprietary systems and confidential project details.
```

After receiving the anonymized output from an AI, Private Prompts can automatically restore the original data for your final version, ensuring that the core content is personalized while sensitive details remain protected from external systems.

## User Responsibilities and Limitations to Consider

To ensure privacy and security, users should be aware of the following:

- **No On-Device Encryption**: Configuration and state data are saved in an unencrypted JSON file. This file can be edited using other tools, offering flexibility but also necessitating additional security measures by the user.

- **User-Defined Privacy**: Defining private information is the user's responsibility. While **Private Prompts** assists in pseudonymizing personal information, the responsibility for identifying sensitive information rests with the user.

- **Computer Security**: It is still recommended to ensure that computers are secure by employing measures such as using antivirus software, keeping operating systems and applications updated, and adhering to best practices for digital security.

- **Web:** Technically **Private Prompts** is a Vue3 web application that works in a browser. Since this project is designed to keep private data offline, running it in a browser defeats its purpose. In short, this is **not recommended for production use** due to privacy concerns.
  
- **Browser Extension:** Same here: The business logic and UI could be packaged as a Chrome/Firefox extension using the `wxt` framework. However, running as a browser extension introduces significant limitations, including restricted file system access, limited offline functionality, and potential security concerns. For these reasons, **Private Prompts** is not recommended for production use in a browser extension format.

**Private Prompts** is designed to help users protect their privacy while using modern AI tools. However, the effectiveness of these measures depends on user vigilance and adherence to security practices.


## How You Can Use Private Prompts

This section highlights specific scenarios where **Private Prompts** is particularly beneficial, especially in handling sensitive data in both personal and professional environments.

### Everyday Scenarios: Using Private Prompts for Personal Privacy

1. **Personal Privacy**: Pseudonymize personal information before sharing it with AI tools, ensuring your privacy is maintained.

   - **Example**: Replace your name, address, and phone number with placeholders when asking an AI tool to draft a personal letter.

2. **Security**: Protect sensitive information from unauthorized access by replacing it with placeholders.

   - **Example**: Use placeholders for your email address and social media handles when seeking AI assistance in writing a public blog post.

3. **Data Sharing**: Share your prompts with others while keeping your personal data secure through pseudonymization.

   - **Example**: Pseudonymize the details of a personal project before sharing the prompt with a collaborator to get feedback without revealing private information.

### Workplace Scenarios: Using Private Prompts for Business Security

1. **Data Privacy**: In professional settings, pseudonymize sensitive information before sharing it with AI tools to protect privacy.

   - **Example**: Replace client names and project details with placeholders when using AI to draft reports or proposals.

2. **Legal Compliance**: For legal professionals, maintain confidentiality and comply with data protection regulations by using pseudonymization.

   - **Example**: Pseudonymize sensitive case details when using AI to draft legal documents or research memos, ensuring compliance with confidentiality requirements.

3. **Healthcare**: Pseudonymize patient information before using it with AI tools to protect highly sensitive healthcare data.

   - **Example**: Replace patient names and medical records with placeholders when using AI to analyze healthcare data or generate medical reports.

**Private Prompts** ensures that both personal and professional users can handle data securely and privately, making it a valuable tool for a variety of scenarios.

## In-Depth Use Cases

### Personal Letter or Email

Whether you’re writing a heartfelt letter to a loved one or emailing an acquaintance, you may need help crafting it—but want to shield real names and contact info.

```markdown
<!-- Sensitive Data Prompt -->
Write an apology letter to my old friend Sarah Carmichael
(email: sarah.carmichael@example.com) acknowledging I moved 
from 92 Lakeview Avenue and haven't stayed in touch.
```

```markdown
<!-- Pseudonymized Prompt -->
Write an apology letter to my old friend Jane Doe
(email: jane.doe@example.com) acknowledging I moved 
from 123 Elm Street and haven't stayed in touch.
```

The AI can suggest a thoughtful letter, and once it’s ready, Private Prompts restores your friend’s real name and your actual former address in the final draft, ensuring your personal details were never sent to external servers.

You can then proceed to adjust the letter according to your needs.

### Children’s Party Invitations

Planning a child’s birthday party often involves sharing a child’s name, your address, and private details about the event. **Private Prompts** helps mask this information so you can still let AI generate creative invitation messages without disclosing personal data.

```markdown
<!-- Sensitive Data Prompt -->
Generate a fun birthday invitation for my daughter, Lucy Chen,
turning 7 on February 14. The party will be at our home,
123 Apple Lane, starting at 2 PM, with a unicorn theme
and cupcakes for snacks.
```

```markdown
<!-- Pseudonymized Prompt -->
Generate a fun birthday invitation for my child, Jane Doe,
turning 7 on March 7. The party will be at our home,
999 Placeholder Street, starting at 2 PM, with a unicorn theme
and cupcakes for snacks.
```

### Real Estate

Real estate professionals can use Private Prompts to create detailed property listings without revealing actual addresses. The AI drafts the text with placeholder addresses, which can be replaced with the real addresses locally after the AI processing.

```markdown
<!-- Sensitive Data Prompt -->
Create a real estate listing for my property at 123 Maple Street, Springfield, IL 62704,
featuring 4 bedrooms, 3 bathrooms, and a spacious backyard.
```

```markdown
<!-- Pseudonymized Prompt -->
Create a real estate listing for my property at 456 Oak Avenue, Spring City, MA 12345,
featuring 4 bedrooms, 3 bathrooms, and a spacious backyard.
```

### Legal & NDAs
Legal professionals frequently draft documents containing highly confidential client details. **Private Prompts** masks this information—like names, addresses, or sensitive project specifics—before sending the document to AI services for initial drafting or language polishing.

```markdown
<!-- Sensitive Data Prompt -->
Draft a Non-Disclosure Agreement between the new hire, Alice Johnson,
and InnovateX Inc., addressing intellectual property, confidentiality,
and non-compete clauses.
```

```markdown
<!-- Pseudonymized Prompt -->
Draft a Non-Disclosure Agreement between the new hire, Jane Doe,
and SomeCompany Inc., addressing intellectual property, confidentiality,
and non-compete clauses.
```

This approach ensures the real names and organization details never go beyond your computer. Once the AI suggests improved legal language, you can revert the placeholders to reveal the actual client or employee data in the final text.




## Navigating Private Prompts: A UI Overview

The user interface (UI) of **Private Prompts** is designed to be user-friendly and efficient, ensuring that users can easily navigate and utilize all available features. The application is structured into multiple tabs, each serving a specific function and arranged by importance to improve usability and workflow efficiency. This structure allows users to access the most critical features quickly while providing a clear pathway to additional functionalities as needed.

Each tab in the application has a specific function, allowing users to easily find tools for managing, pseudonymizing, and organizing prompts. The intuitive layout allows users to focus on their tasks without feeling overwhelmed by excessive options. By breaking down the interface into well-defined sections, **Private Prompts** offers a streamlined and logical approach to prompt management, ensuring that all essential features are readily accessible and easy to use.

### Main Workspace: The Protected Workbench of Private Prompts

The **Private Prompts** workbench is the primary area where you create, refine, and manage your AI prompts. This workspace is designed to provide a structured and user-friendly experience, helping you maintain privacy while working with AI-generated content.

#### Key Features of Private Prompts

1. **Prompt Input Field**  
   - This is where you type in your AI prompt. It supports multiple lines and automatically grows as you write.
   - Prompts can be edited, refined, and modified before being sent to the AI.
   - Quick-action buttons provide convenient input management:
     - **Copy to Clipboard**: Instantly copy your prompt for use elsewhere.
     - **Delete Prompt**: Clear the input field with one click.

2. **AI Processing & History Tracking**  
   - Every time you send a prompt, the system saves a history of your input and the AI’s response.
   - These history entries appear as conversation bubbles, allowing you to easily track past interactions.
   - Entries are color-coded for easy differentiation:
     - **User Input (Source)**: Shown on the right.
     - **AI Responses (Result)**: Displayed on the left.
   - Each entry has a set of action buttons:
     - **Copy Entry**: Copy the text to your clipboard.
     - **Insert into Input Field**: Reuse the entry by pasting it into the input field.
     - **Delete from History**: Remove unwanted entries from your records.

3. **Data Privacy & Security Controls**  
   - **Mark Sensitive Data**: Highlights confidential information in your prompt for further processing.
   - **Mask Data**: Replaces sensitive details with placeholders to protect your privacy before sending the prompt to an AI.
   - **Unmask Data**: Restores the original details in AI responses after processing.

4. **AI Integration & Sending Prompts**  
   - Once a prompt is ready, it can be securely processed using the **Send to AI** button.
   - The process is carried out automatically in the following steps:
     1. Saves a copy of your original prompt.
     2. Masks any sensitive information (if defined).
     3. Sends the pseudonymized prompt to the AI.
     4. Receives and displays the AI’s response.
     5. Unmasks sensitive data in the response, if applicable.
   - This ensures that private data remains protected and is only shared with external AI services when explicitly permitted.

5. **Workbench History Management**  
   - Your past prompts and responses are stored for easy reference.
   - The **Clear History** button allows you to delete all past entries at once if needed.

#### Summary
The workbench of **Private Prompts** is a secure and user-friendly environment designed for crafting AI prompts while maintaining full control over your data privacy. With built-in history tracking, sensitive data masking, and AI processing controls, it offers an efficient and structured workflow for managing your interactions with AI.

### Prompt Manager: Easily Organize Your AI Prompts

The **Prompt Manager** is a dedicated section where users can maintain a comprehensive collection of their saved prompts. This feature is designed to help users organize and quickly access their prompts for future use. Each prompt in the library includes several key properties to enhance organization and retrieval:

#### Benefits of a Dedicated Prompt Library

A dedicated Prompt Library offers several advantages over keeping all your prompts in a single text file or notepad:

1. **Organization and Retrieval**: In a text file or notepad, prompts can quickly become a disorganized list, making it difficult to find specific prompts when you need them. **Private Prompts** makes it easy to maintain a personal prompt library allowing you to organize prompts with titles, descriptions, and tags. This structure makes it easy to locate and manage your prompts.

2. **Tagging System**: Tags are an incredibly powerful tool for organizing prompts. When working with different projects, platforms, and versions of language models (LLMs), tags allow you to categorize prompts based on their specific use case. For example, you can tag prompts as "ChatGPT," "Claude," "Image generation," "fun," or "finance," making it simple to filter and find the prompts relevant to a particular task or context.

3. **Efficiency**: With the ability to quickly search and filter prompts, the Prompt Library saves time and reduces frustration. Instead of scrolling through a long text file, you can use keywords and tags to instantly find the prompt you need.

4. **Editability**: The library allows for easy editing of prompts, titles, descriptions, and tags. This flexibility ensures that your prompts remain up-to-date and accurately categorized.

5. **Import and Export**: The ability to import and export prompts provides additional convenience. You can back up your prompts, share them with colleagues, or import prompts from other sources, all within a user-friendly interface.

6. **Consistency**: Keeping your prompts in a dedicated library helps maintain consistency in how you create and use prompts. This is particularly useful when working with different versions of LLMs or across multiple platforms.

#### Key Features

1. **Prompt Library**  
   - Store and manage all your AI prompts in one place.
   - Quickly access frequently used prompts without having to rewrite them.
   - Save time by organizing prompts for different use cases.

2. **Import & Export Prompts**  
   - **Import Prompt Sets**: Load predefined prompts from external files. Duplicate entries will be detected on import and ignored.
   - **Export Prompt Sets**: Save and share your curated prompt collections.

3. **Tagging & Categorization**  
   - Assign tags to prompts for better organization.
   - Filter prompts by tags to quickly find relevant ones.
   - Manage and rename tags as needed.

4. **Search & Filter**  
   - Use the search bar to find specific prompts quickly.
   - Filter by text content, assigned tags, or platforms.
   - Option to display only pinned (favorite) prompts for easy access.
   - Can be opened or hidden to save space on screen

5. **Editing & Management**  
   - Modify prompt descriptions, text, and associated metadata. Users can update the title, description, tags, and the prompt text itself without navigating away from the library.
   - Duplicate prompts to create variations. This feature facilitates iterative refinement of prompts without losing the original version.
   - Delete unwanted prompts with a single action.

6. **Drag & Drop Reordering**  
   - Arrange prompts in a custom order by dragging them.
   - Helps prioritize frequently used prompts at the top.

7. **Favorite (Pinned) Prompts**  
   - Mark important prompts as favorites for quick access.
   - Toggle between viewing all prompts or only pinned ones.

#### Summary
The **Prompt Manager** ensures an efficient and structured way to store, organize, and retrieve AI prompts. With powerful filtering, tagging, and import/export features, it provides a seamless experience for managing large prompt collections efficiently.

### Rule Manager: Customizing Your Privacy Rules

The **Rule Manager** allows users to define rules for masking and replacing sensitive information within AI prompts. This ensures that private data remains protected during AI processing.  **Private Prompts** comes with a predefined list of example rules, but the purpose of **Private Prompts** is that you define your own rules to suit your specific needs.

#### How Privacy Rules Are Structured

Each rule consists of two parts:

- **Left Hand Side (Sensitive Data Pattern)**: Specifies what to look for in the unmasked input.
- **Right Hand Side (Replacement Placeholder)**: Defines the temporary replacement.

##### Different Methods for Replacing Sensitive Data

- **Static Replacement Rules**: 

  These kinds of rules replace specific strings with predetermined placeholders.

  - Examples:
    - "Marten Solbeck" ➔ "John Doe"
    - "Nalea Thornfeld" ➔ "Jane Doe"
    - "marten.solbeck@gmail.com" ➔ "dummy@example.com"

- **Smart Matchers**: Dynamic Sensitive Data Patterns

   When using Smart Matchers as "Sensitive Data Pattern," **Private Prompts** will automatically scan your input for matching sensitive information. Four types of Smart Matchers are currently supported:

   | Matcher              | Description                |
   | -------------------- | -------------------------- |
   | `{email}`            | matches and email address  |
   | `{iban}`             | matches iban numbers       |
   | `{ipv4}`             | matches ipv4 addresses     |
   | `{creditcardnumber}` | matches credit card number |

   On the right-hand side of the rule, you can also use dynamic expressions as temporary replacement placeholders. These will generate random values in the selected format. The following expressions are supported:

   | Expression                         | Example Output                    | Description                                                 |
   | ---------------------------------- | --------------------------------- | ----------------------------------------------------------- |
   | `{number}`                         | 325                               | random number between 0 and 1000                            |
   | `{number(10,99)}`                  | 74                                | random number between 10 and 99                             |
   | `{word}`                           | Zotepori                          | random readable word with alternating vowels and consonants |
   | `{date}`                           | 2024-06-18                        | random date in format YYYY-MM-DD                            |
   | `{date(1990, 2025, "DD.MM.YYYY")}` | 03.07.2010                        | random date in specified format                             |
   | `{futureDate}`                     | 2027-02-14                        | random future date                                          |
   | `{futureDate(10, "YYYY/MM/DD")}`   | 2031/05/22                        | random future date within next 10 years in specified format |
   | `{pastDate}`                       | 2017-09-08                        | random past date                                            |
   | `{pastDate(5, "MM-DD-YYYY")}`      | 03-12-2019                        | random past date within past 5 years in specified format    |
   | `{city}`                           | Berlin                            | random city name                                            |
   | `{iso2}`                           | DE                                | random ISO 3166-1 alpha-2 country code                      |
   | `{iso3}`                           | USA                               | random ISO 3166-1 alpha-3 country code                      |
   | `{currency}`                       | EUR                               | random currency code                                        |
   | `{price}`                          | 479.99                            | random price                                                |
   | `{price(10, 500, "USD")}`          | 125.50 USD                        | random price in the specified range and currency            |
   | `{creditCardNumber}`               | 4532 7890 1234 5678               | random credit card number                                   |
   | `{cvc}`                            | 847                               | random credit card CVC                                      |
   | `{iban}`                           | DE44 5001 0517 5407 3249 31       | random IBAN                                                 |
   | `{iban("FR")}`                     | FR76 3000 6000 0112 3456 7890 189 | random IBAN for the specified country                       |
   | `{email}`                          | max.muster@example.com            | random email address                                        |
   | `{email("gmail.com")}`             | anna.schmidt@gmail.com            | random email address with the specified domain              |
   | `{phonenumber}`                    | +4915123456789                    | random german phone number                                  |
   | `{ipv4}`                           | 192.168.0.1                       | random IP V4 address                                        |
   | `{loremIpsum}`                     | Lorem ipsum dolor sit amet...     | random lorem ipsum text to fill in the blank                |

   In the background, **Private Prompts** ensures that no duplicates are created accidentally.

- **Regex Rules**: 
  
  These use regular expressions on the left hand side to identify patterns and replace them with placeholders.
  
  Here are some examples:
    - Email: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` ➔ `some@uid@mail.com`
    - IP Address: `[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}` ➔ `127.0.0.1`
    - Phone Number with Country Prefix: `(\+|00)49[0-9]{10}` ➔ `+49 123 456 7890`

   If you are not familiar with regular expressions, then start with simple rules or use smart matchers.


##### Using Macros for Custom Tasks

Though this is not an officially supported feature, users can utilize static replacement rules to define **macros** for common tasks.

  - Example:
    - `@toGerman` ➔ `Translate the following text into German: `

##### How Private Prompts Handles Data Masking

When you mask a text, **Private Prompts** maintains an internal list of replacements, allowing you to undo the masking later (using the "Unmask" button). Note that this internal list has a short lifetime and is intended for immediate use.

Conflicts may occur but are handled automatically in the background to prevent unexpected results after unmasking prompts.

#### Key Features

1. **Custom Replacement Rules**  
   - Define specific words, phrases, or patterns to be replaced before sending prompts.
   - Customize how private data is handled to ensure compliance with privacy policies.

2. **Import & Export Rules**  
   - **Import Rule Sets**: Load predefined rules from external files.
   - **Export Rule Sets**: Save and share customized rule configurations.

3. **Smart Matchers**  
   - Smart matchers automatically mask data using predefined placeholders like `{email}` or `{creditcardnumber}`.
   - Replace sensitive data with random or user-defined placeholders.

4. **Advanced Data Masking with Regex**  
  Regex-based data masking enables the creation of complex detection patterns for precise data protection. You can customize rules for different types of data, such as phone numbers, addresses, or financial information.

6. **Drag & Drop Reordering**  
   - Organize rules in a custom order to define processing priority.

7. **Real-Time Editing & Management**  
   - Modify, duplicate, or delete rules dynamically.
   - Validate rules in real-time to ensure accurate data masking.

#### Summary

The **Rule Manager** provides a structured way to define and apply privacy-focused data transformation rules. With support for import/export, smart matchers, and regex patterns, it enables a flexible and powerful approach to safeguarding private data within AI interactions.

### Settings / Import & Export

The **Settings / Import & Export** page serves as the central management interface for key settings in **Private Prompts**. It allows customization of the design, language selection, data import/export, and the management of sensitive information.

#### Design & Language Settings

##### Theme (Dark-/Light-Mode)

- Toggle between **dark and light mode** for an optimized user experience.
- The current mode is displayed, and the button dynamically adapts.

##### Change Language

- Choose between **English, German, French, and Polish**.
- Clicking the respective button sets the language globally for the application.

#### Data Export & Import

This section enables the backup and restoration of important data in **Private Prompts**.

##### Safeguarding Your Data with Backups

- **Export**: Saves the entire application configuration.
- **Import**: Restores a previously saved configuration into the application.

##### Exporting and Importing Prompt Collections

- **Export Prompt Sets**: Saves stored prompts as a file.
- **Import Prompt Sets**: Loads a file with predefined prompts.

##### Organizing and Sharing Privacy Rules

- **Export Rules**: Saves defined privacy rules.
- **Import Rules**: Restores saved privacy rules into the application.

##### Where Private Prompts Stores Your Settings

- Displays the **file path** where the current configuration file is stored.
- Helps with backup or manual editing of settings.

##### Handling Your OpenAI API Key Securely

This section allows storing or deleting the **OpenAI API key**.

**Features:**
- **Save API Key**: Required for interaction with OpenAI.
- **Toggle Password Visibility**: Allows displaying or masking the API key.
- **Delete API Key**: Removes the stored API key from the configuration.

Please note: Although the key is Base64-encoded, it is not truly encrypted, just obfuscated in the JSON file. Treat it as plain text from a security perspective.

##### Restoring Private Prompts to Default Settings

You may want to use the backup feature mentioned above before you make use of this feature.

- **Reset to Factory Settings**: Resets all settings to default values.
- **Warning Before Reset**: Requires confirmation as all personal configurations will be lost.

#### Summary

The **SetupTab** page provides comprehensive management functions for **Private Prompts**, including **design customization, language management, data import/export, and API key management**. Highly sensitive actions like **deleting the API key or resetting the application** are protected with additional security confirmations.

## Installing Private Prompts: A Step-by-Step Guide

### Download

**Precreated binaries** can be downloaded for multiple platforms (Windows/Linux/macOS). Navigate to [privateprompts.org](https://privateprompts.org) for further information or visit the [releases page on GitHub](https://github.com/fboerncke/private-prompts-prototype/releases)

Three versions of the application are available:

- **Windows**: Binary works on both 32-bit and 64-bit platforms
- **Linux**: Binary packaged as AppImage 
- **macOS**: Binary packaged as dmg (due to Apple’s strict security policies, additional steps are required after unzipping, see below).

### Installation and Launch Instructions

#### **Windows**
- Simply double-click the file to launch the application.

#### **Linux**
- Before launching, you may need to make the file executable:
  ```bash
  chmod u+x PrivatePrompts-Beta-002.AppImage
  ```
- Once executable, you can launch it with a double-click.

#### **macOS**
macOS has strict security measures to protect users from unknown or untrusted applications. Because `PrivatePrompts` is distributed outside the App Store, it may be incorrectly labeled as "damaged" or "unsafe." Rest assured, the app is completely safe. Just follow these steps to fix the issue and get started:

1. **Download the `.dmg` File**
   - Click the provided link to download the latest DMG File.
   - Save it to your **Downloads** folder or another location of your choice.

2. **Open the `.dmg` File**
   - Double-click the downloaded `.dmg` file.
   - A new window will appear showing the app.

3. **Move the App to the Applications Folder**
   - Drag the app icon into the **Applications** folder.

4. **Open the Terminal**
   - Press **Command (⌘) + Space** to open **Spotlight Search**.
   - Type **Terminal** and press **Enter** to open the Terminal app.

5. **Run the Fix Command**
   - Copy and paste the following command into the Terminal, then press **Enter**:
     ```bash
     xattr -r -d com.apple.quarantine /Applications/PrivatePrompts-Beta-002.app
     ```
   - This command removes a security tag added by macOS that may prevent the app from running.

6. **Start the App**
   - Open the **Applications** folder, locate `PrivatePrompts`, and double-click it.
   - The app should now open and function without any issues.

### Uninstall Private Prompts

To uninstall **Private Prompts**, simply delete the application file.

A configuration file is generated to store state and user settings. This JSON file can be edited using any text editor. 
You may want to clean up these files if you no longer want to use **Private Prompts**. 

The file paths are as follows:
- **Linux**: `~/.config/private-prompts-app-electron/config.json`
- **Windows**: `C:\Users\<UserName>\AppData\Roaming\Private Prompts`
- **Mac**; `/Users/<UserName>/Library/Application Support/Private Prompts/config.json`

You can also look up the configuration file paths within the app in the `Management Console`.

## Under the Hood: Technical Details & Development

### How Private Prompts Is Built: Architecture Overview

This monorepo arranges the code so that core logic resides in the `shared` directory, enabling consistent reuse across different environments (Web, Browser Extension, and Electron).

- **Vue 3, Pinia & Vuetify**  
  Modern frontend libraries power the UI, state management, and styling.

- **`shared` Directory**  
  Houses core components, services, stores, interfaces, and utilities. Each platform imports from this single codebase.

- **`apps` Directories**  
  - `apps/electron-app`: Desktop application using Electron.
  - `apps/vue-app`: Single page application for browsers (recommended for fast development only, not to be used in production).
  - `apps/browser-extension`: Web extension for Chrome/Firefox (experimental).

### Technology Stack: Tools Behind Private Prompts

**Private Prompts** leverages a robust and modern technology stack to ensure optimal performance, cross-platform compatibility, and ease of development. The application is built using the following frameworks and tools:

- **Electron**: A framework for building cross-platform desktop applications using web technologies. Electron enables developers to use familiar web technologies (HTML, CSS, JavaScript) to create desktop applications, which can run consistently across multiple operating systems. By integrating Chromium and Node.js into a single runtime, Electron provides a stable environment for development and execution.

- **Node.js and npm**: A JavaScript runtime and package manager that offer a scalable, event-driven architecture. Node.js is particularly effective when used with Electron. npm, the Node package manager, offers a vast repository of modules, facilitating efficient development and code reuse.

- **TypeScript**: TypeScript extends JavaScript by adding static types, which helps in identifying potential runtime errors during development. This enhancement improves code quality and makes the codebase easier to maintain. Its seamless integration with modern IDEs provides advanced developer tooling and auto-completion, enhancing the overall development experience.

- **Vue 3**: Vue 3 provides a flexible and approachable API that can be easily integrated into various projects. Its efficient reactivity system and support for component-based architecture make it a robust choice for developing complex user interfaces and single-page applications.

- **Vuetify 3**: Vuetify 3 is a popular Material Design component framework for Vue.js. It offers a wide range of pre-designed components that follow the Material Design guidelines, enabling developers to create visually appealing and consistent user interfaces quickly. Vuetify 3 also includes extensive customization options, making it easy to adapt the design to specific project requirements while maintaining a cohesive look and feel. 

- **Vite**: A build tool that offers a faster and more efficient development experience for modern web projects. Vite is known for its quick development server start times and instant hot module replacement (HMR). By leveraging native ES modules, Vite reduces the need for bundling during development, which accelerates the development process.

- **Webpack**: A module bundler for JavaScript applications. Webpack is valued for its powerful configuration options and support for features like code splitting, lazy loading, and hot module replacement. Its extensibility through loaders and plugins makes it well-suited for complex applications that require advanced build processes.

- **wxt framework from [wxt.dev](https://wxt.dev/)**: A lightweight framework designed specifically for building browser plugins. The wxt framework reduces the overhead associated with larger frameworks, offering a streamlined and efficient development experience tailored for browser plugin development.

- **Jest**: A testing framework for JavaScript that emphasizes simplicity and ease of use. Jest includes features such as zero configuration, parallel test running, and snapshot testing. These capabilities make it a reliable tool for ensuring code quality and maintaining robustness in software projects.

### Building Private Prompts from Source

If you prefer to build the binaries yourself then this section is for you:

**Recommended: The Electron App**  

**Private Prompts** is designed to run seamlessly across various operating systems and environments, ensuring a broad range of compatibility and flexibility. Therefore the best way to use **Private Prompts** is as a **standalone Electron desktop application**. This ensures full offline functionality, local data privacy, and the best user experience.

For development and testing, alternative modes (Web and Browser Extension) are available but not recommended for production.

#### Prerequisites

- Node.js (LTS recommended)  
- NPM  
- git (if cloning directly)

#### Initial Setup

1. **Clone the repository:**
    ```bash
   git clone https://github.com/fboerncke/private-prompts-monorepo.git
   cd private-prompts-monorepo
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

    Installs all dependencies across the entire monorepo, including shared components and platform-specific `apps`.

3. **Run the Web App in Development Mode:**
    ```bash
    cd apps/vue-app
    npm run dev
    ```

    Open http://localhost:5173 (or the displayed port) in your browser.

    **Not recommended for production use**, but useful for development and maintenance.

4. **Run Browser Extension in Development Mode (experimental):**
    ```bash
    cd ../browser-extension
    npm run dev
    ```
  
    Follow the `wxt` setup instructions to load the extension as a temporary add-on in Chrome or Firefox.

    **Not recommended for production use**, but may be used to test a subset of **Private Prompts**' functionality.


5. **Run Electron App in Development Mode:**

    ```bash
    cd ../electron-app
    npm run dev
    ```

    This will:
    - Run Vite for the **renderer**.
    - Launch **Electron**.
    - Open the **desktop application window**.

#### Production Builds

- **Electron App (Recommended)**
    ```bash
    cd ../electron-app
    npm run build:linux # build linux binary 
    npm run build:win32 # build windows binary 
    npm run build:mac # build macOS binary 
     ```

    Builds the renderer and uses `electron-builder` to produce installer binaries (Windows/Mac/Linux).

- **Web App**  
    ```bash
    cd apps/vue-app
    npm run build
    ```

    Outputs **production files** to the `dist` folder.  Again, this is **not recommended for deployment** due to privacy concerns.

- **Browser Extension (experimental)**
    ```bash
    cd ../browser-extension
    npm run build
    ```
    
    Creates a `dist` folder with your extension, ready for packaging.

## Private Prompts: Open Source and Transparency

**Private Prompts** is committed to the open-source community, ensuring transparency, collaboration, and accessibility for developers and users alike.

- **AGPL License**: The Affero General Public License (AGPL) is a free software license that ensures that the source code of a program is available to users. It is a strong copyleft license, meaning that any derivative work must also be distributed under the same license. The AGPL is specifically designed to close the "Application Service Provider" loophole, which allows modified versions of software to be used over a network without releasing the source code. Under the AGPL, if you modify the software and use it over a network, you must make the source code available to the users of that network service.
  
- **Source Code Availability**: The source code for **Private Prompts** is available on GitHub. This allows developers to contribute to the project, report issues, and suggest improvements. By adopting an open-source model, **Private Prompts** encourages community involvement and continuous improvement, fostering an environment where innovative ideas and collaborative development can thrive.

- **Transparency and Trust**: By being open-source, **Private Prompts** allows anyone to inspect the code, ensuring that the application is not doing anything malicious with private information. This transparency helps build trust among users, as they can verify for themselves that their data remains secure and private.

## Learn More and Get in Touch

Visit [privateprompts.org](https://privateprompts.org) or contact the author Frank Börncke <frank.boerncke@gmail.com> for more information.

## Acknowledgements

This project receives funding from the [German Federal Ministry of Education and Research](https://www.bmbf.de/) (1.9.2024-28.02.2025, FKZ 01IS24S44)

[![Logo Bundesministerium für Bildung und Forschung](./resources/assets/bmbf_en.jpg)](https://www.bmbf.de/)
&nbsp; &nbsp;
[![Logo Open Knowledge Foundation](./resources/assets/logo-okfn.svg)](https://okfn.de)
&nbsp; &nbsp;
[![Logo Prototype Fund](./resources/assets/PrototypeFund_Logo_smallest.svg)](https://prototypefund.de/)

The Prototype Fund is a project of the Open Knowledge Foundation Germany, funded by the German Federal Ministry of Education and Research (BMBF).
