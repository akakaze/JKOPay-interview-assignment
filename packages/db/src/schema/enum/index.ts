import { pgEnum } from "drizzle-orm/pg-core";
import { getCountries } from "libphonenumber-js";

export const phoneCountryCodePgEnum = pgEnum("phoneCountryCode", [
  "TW",
  ...getCountries(),
]);
