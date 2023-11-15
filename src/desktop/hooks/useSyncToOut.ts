import { useEffect, useState } from "react";
import { appId, syncId, url, PLUGIN_ID } from "../constants";

type appAResult = {
  status: boolean;
  result: kintone.types.appASavedFields[];
};

type outerAppResult = {
  status: boolean;
  result: kintone.types.outerAppSavedFields[];
};

export default function useSyncToOut() {
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 获取外部系统的记录数，简单假设获取最后一条记录的id作为同步的最终结果
  // 使用kintone.proxy 模拟这是一个外部系统。

  //获取外部系统
  const getProxyRecords = async () => {
    const apiUrl = `${url}/k/v1/records.json?app=${syncId}`;
    let resp: outerAppResult = { status: false, result: [] };
    try {
      const [result] = await kintone.plugin.app.proxy(
        PLUGIN_ID,
        apiUrl,
        "GET",
        {},
        {}
      );
      const records = JSON.parse(result).records;
      if (records.length > 0) {
        resp.status = true;
        resp.result = records;
      }
    } catch (e) {
      console.log(e);
    }
    return resp;
  };

  //同步外部系统
  const updateProxyRecords = async (
    records: kintone.types.appASavedFields[]
  ) => {
    const updateRecords = records.map((record) => {
      return {
        id: record.$id,
        title: record.title,
        detail: record.detail,
      };
    });
    const params = {
      app: syncId,
      records: updateRecords,
    };
    const apiUrl = `${url}/k/v1/records.json`;
    try {
      await kintone.plugin.app.proxy(
        PLUGIN_ID,
        apiUrl,
        "POST",
        { "Content-Type": "application/json" },
        params
      );
    } catch (e) {
      console.log(e);
    }
  };

  //获取当前系统
  const getRecords = async () => {
    const params = {
      app: appId,
    };
    const result = await kintone.api(
      kintone.api.url("/k/v1/records", true),
      "GET",
      params
    );
    let resp: appAResult = { status: false, result: [] };
    if (result.records.length > 0) {
      resp.status = true;
      resp.result = result.records;
    }
    return resp;
  };

  //同步：取出当前应用的数据，同步到外部系统。更新同步状态
  const handleSync = async () => {
    setLoading(true);
    const { result } = await getRecords();
    await updateProxyRecords(result);
    const message = `已同步${result.length}条记录`;
    setSyncStatus(message);
    setLoading(false);
  };

  useEffect(() => {
    const getSyncStatus = async () => {
      const { result } = await getProxyRecords();
      if (result.length > 0) {
        const message = `外部系统共有${result.length}条记录`;
        setSyncStatus(message);
      } else {
        setSyncStatus("暂无同步记录");
      }
    };
    getSyncStatus();
  }, []);

  return { loading, syncStatus, handleSync };
}
