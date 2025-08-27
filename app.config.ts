// This file has some limitations placed on it. See the expo docs for more info:
// https://docs.expo.dev/guides/typescript/#appconfigjs
// https://docs.expo.dev/workflow/configuration/#using-typescript-for-configuration-appconfigts-instead-of-appconfigjs

import { ConfigContext, ExpoConfig } from "expo/config";

export default function transformAppConfig({
  config,
}: ConfigContext): ExpoConfig {
  if (!config.slug || !config.name)
    throw new Error("app.json must have slug and name");

  // TypeScript for some reason is having trouble understanding that we just narrowed
  // name and slug to string
  const configNarrowed = config as Partial<ExpoConfig> &
    Pick<ExpoConfig, "name" | "slug">;

  return {
    ...configNarrowed,
    experiments: {
      // split out building web preview vs web production because
      // this baseUrl thing messes up the local serve of the code
      // https://docs.expo.dev/tutorial/eas/multiple-app-variants/#update-dynamic-values-based-on-environment
      baseUrl: process.env.WEB_PROD ? "/transferable-discipleship/app" : "",
    },
  };
}
