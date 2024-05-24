import { Dictionary, i18n } from "@nivo/i18n";
import { serverContext } from "./server-context";

export const [getLocale, setLocale] = serverContext(i18n.defaultLocale);
export const [getDictionary, setDictionary] = serverContext({} as Dictionary)
