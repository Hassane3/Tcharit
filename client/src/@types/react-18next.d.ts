import "i18next";
import { locales } from "../translation/i18n";

declare module "i18next" {
  // and extend them!
  interface CustomTypeOptions {
    defaultNS: keyof typeof locales["en"];
    resources: typeof locales["en"];
  }
}