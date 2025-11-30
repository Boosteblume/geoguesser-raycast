/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** NCFA Token - Your GeoGuessr _ncfa cookie value (valid for 1 year) */
  "ncfaToken": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `get-profile` command */
  export type GetProfile = ExtensionPreferences & {}
  /** Preferences accessible in the `daily-challenge` command */
  export type DailyChallenge = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `get-profile` command */
  export type GetProfile = {}
  /** Arguments passed to the `daily-challenge` command */
  export type DailyChallenge = {}
}

