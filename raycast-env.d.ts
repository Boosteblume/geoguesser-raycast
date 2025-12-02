/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** NCFA Token - Your GeoGuessr _ncfa cookie value (valid for 1 year) */
  "ncfaToken": string,
  /** Your Country Code - Your 2-letter country code (e.g., DE, US, FR) */
  "countryCode": string,
  /** Number & Date Format - Choose your preferred locale for formatting numbers and dates */
  "locale": "de-DE" | "en-US" | "en-GB" | "fr-FR" | "es-ES" | "it-IT" | "pt-BR" | "nl-NL" | "sv-SE" | "nb-NO" | "da-DK" | "fi-FI"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `get-profile` command */
  export type GetProfile = ExtensionPreferences & {}
  /** Preferences accessible in the `daily-challenge` command */
  export type DailyChallenge = ExtensionPreferences & {}
  /** Preferences accessible in the `last-games` command */
  export type LastGames = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `get-profile` command */
  export type GetProfile = {}
  /** Arguments passed to the `daily-challenge` command */
  export type DailyChallenge = {}
  /** Arguments passed to the `last-games` command */
  export type LastGames = {}
}

