// src/services/DefaultDataProvider.ts

import { Prompt } from "../interfaces/PromptInterface";
import type { Rule } from "../interfaces/RuleInterface";

/**
 * Default prompts that can be used for initialization
 * 
 * It is important that every entry has an unique id
 */
export const defaultPrompts: Prompt[] = [
  {
    id: 0,
    isFavorite: false,
    description: "Example sensitive prompt - Job application letter",
    prompt: `Write a friendly job application letter.
My name: Marten Solbeck
My address: Bahnhofstraße 12
33602 Bielefeld
Phone: 05202/3333333
Mail: marten.solbeck@gmail.com
Job description: Manager Position in a fast food restaurant.`,
    comment: "This prompt can be used to demonstrate the functionality of the application.",
    platforms: ["ChatGPT", "Claude"],
    tags: ["Demo case"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1,
    isFavorite: false,
    description: "Beispielprompt mit sensitiven Daten - Bewerbungsanschreiben",
    prompt: `Schreibe ein freundliches Anschreiben für eine Bewerbung.
Mein Name: Marten Solbeck
Meine Adresse: Bahnhofstraße 12, 33602 Bielefeld
Telefon: 05202/3333333
E-Mail: marten.solbeck@gmail.com
Stellenbeschreibung: Manager-Position in einem Fast-Food-Restaurant.`,
    comment: "Dieser Prompt kann verwendet werden, um die Funktionalität der Anwendung zu demonstrieren.",
    platforms: ["ChatGPT", "Claude"],
    tags: ["Demo case"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    isFavorite: false,
    description: "Test values for smart expressions",
    prompt: `The following values are meant for testing smart expressions:
--- some test ip numbers ---
IP: 192.168.12.3
IP: 192.168.12.4
--- some test creditcardnumbers ---
Creditcardnumber: 3782-8224-6310-1005
Creditcardnumber: 1182-8224-6310-1005
Visa: 4000000000001000
--- some test ibans ---
IBAN: GB33BUKB20201555555555
IBAN: DE02120300000000202051
--- some test mail addresses ---
Mail: Tania86@gmail.com
Mail: peter.parker@gmail.com
Mail: elon.musk@gmail.com
--- some secret information ---
OpenAI-Api-Key: MY_SECRET_KEY`,
    comment: "Use this prompt to show the power of smart expressions in Private Prompts",
    platforms: ["Claude", "OpenAI", "Mistral"],
    tags: ["Demo Case"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    isFavorite: false,
    description: "Joke generator",
    prompt: `Tell me a funny joke.`,
    comment: "Let the AI generate a joke for you.",
    platforms: ["Claude", "OpenAI", "Mistral"],
    tags: ["Fun", "Demo Case"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Default rules that can be used for initialization
export const defaultRules: Rule[] = [
  {
    id: 0,
    userDefinedSensitiveDataPattern: "Marten Solbeck",
    userDefinedTemporaryPlaceholder: "Max Mustermann",
  },
  {
    id: 1,
    userDefinedSensitiveDataPattern: "Nalea Thornfeld",
    userDefinedTemporaryPlaceholder: "Jane Doe",
  },
  {
    id: 2,
    userDefinedSensitiveDataPattern: "Bahnhofstraße 12",
    userDefinedTemporaryPlaceholder: "Musterstrasse {number(10,99)}",
  },
  {
    id: 3,
    userDefinedSensitiveDataPattern: "33602 Bielefeld",
    userDefinedTemporaryPlaceholder: "12345 Musterstadt",
  },
  {
    id: 4,
    userDefinedSensitiveDataPattern: "05202/3333333",
    userDefinedTemporaryPlaceholder: "0851/4711",
  },
  {
    id: 5,
    userDefinedSensitiveDataPattern: "{email}",
    userDefinedTemporaryPlaceholder: "{email}",
  },
  {
    id: 6,
    userDefinedSensitiveDataPattern: "{iban}",
    userDefinedTemporaryPlaceholder: "{iban}",
  },
  {
    id: 7,
    userDefinedSensitiveDataPattern: "{creditcardnumber}",
    userDefinedTemporaryPlaceholder: "{creditcardnumber}",
  },
  {
    id: 8,
    userDefinedSensitiveDataPattern: "{ipv4}",
    userDefinedTemporaryPlaceholder: "{ipv4}",
  },
  {
    id: 9,
    userDefinedSensitiveDataPattern: "MY_IBAN",
    userDefinedTemporaryPlaceholder: "{iban}",
  },
  {
    id: 10,
    userDefinedSensitiveDataPattern: "MY_CREDITCARD",
    userDefinedTemporaryPlaceholder: "{creditcardnumber}",
  },
  {
    id: 11,
    userDefinedSensitiveDataPattern: "MY_SECRET_KEY",
    userDefinedTemporaryPlaceholder: "{word}-{word}-{word}-{word}",
  },

];
