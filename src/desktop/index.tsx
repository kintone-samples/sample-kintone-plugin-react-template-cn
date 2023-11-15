import React from "react";
import ReactDOM from "react-dom/client";
import SyncData from "./components/syncData";

interface KintoneEvent {
  record: kintone.types.appASavedFields;
}

kintone.events.on("app.record.index.show", async (event: KintoneEvent) => {
  ReactDOM.createRoot(kintone.app.getHeaderMenuSpaceElement()!).render(
    <React.StrictMode>
      <SyncData />
    </React.StrictMode>
  );
  return event;
});
