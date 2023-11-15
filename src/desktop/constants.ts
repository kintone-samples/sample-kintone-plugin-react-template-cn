export const fields = {
  title: "title",
  detail: "detail",
};

export const PLUGIN_ID = kintone.$PLUGIN_ID;
export const appId = kintone.app.getId();
export const { code } = kintone.getLoginUser();
export const kintoneUrl = `https://${window.location.hostname}/k/${appId}/`;
export const { url, syncId } = kintone.plugin.app.getConfig(PLUGIN_ID);
