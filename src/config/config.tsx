import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FC, useContext } from "react";
import { ButtonReact, TextReact } from "../kucComponent";
import { PluginIdContext } from "./pluginIdContext";
import _ from "lodash";

type Inputs = {
  url: string;
  syncId: string;
  token: string;
};

const Config: FC = () => {
  const pluginId = useContext(PluginIdContext);
  //kintone.plugin.app.getConfig 是js api，而且是同步的，并非异步，保证这是一个纯函数。
  const settingInfo = kintone.plugin.app.getConfig(pluginId);
  let defalutInput: Inputs = {
    url: "",
    syncId: "",
    token: "",
  };
  let headerInfo: any = null;
  let defaultToken: string;
  if (!_.isEmpty(settingInfo)) {
    headerInfo = kintone.plugin.app.getProxyConfig(settingInfo!.url, "GET");
    defaultToken = headerInfo.headers.Authorization;
    defalutInput = { ...settingInfo };
  }

  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<Inputs>({ defaultValues: defalutInput });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const apiHeader = {
      "X-Cybozu-API-Token": `${data.token}`,
    };
    kintone.plugin.app.setConfig(data, () => {
      kintone.plugin.app.setProxyConfig(data.url, "POST", apiHeader, {}, () => {
        kintone.plugin.app.setProxyConfig(
          data.url,
          "GET",
          apiHeader,
          {},
          () => {
            kintone.plugin.app.setProxyConfig(
              data.url,
              "PUT",
              apiHeader,
              {},
              () => {
                kintone.plugin.app.setProxyConfig(
                  data.url,
                  "DELETE",
                  apiHeader,
                  {}
                );
              }
            );
          }
        );
      });
    });
  };

  const handleCancel = () => {
    window.location.href = `../../${kintone.app.getId()}/plugin/`;
  };

  return (
    <>
      <div>
        <h2 className="m-2 p-2 text-3xl font-bold">信息参数配置</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="kintoneplugin-row">
            <Controller
              name="token"
              control={control}
              render={({ field }) => (
                <TextReact
                  defaultValue={defaultToken}
                  label="token信息:"
                  {...register("token")}
                  {...field}
                ></TextReact>
              )}
            />
          </p>
          <p className="kintoneplugin-row">
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <TextReact
                  label="接口的地址:"
                  {...register("url")}
                  {...field}
                ></TextReact>
              )}
            />
          </p>
          <p className="kintoneplugin-row">
            <Controller
              name="syncId"
              control={control}
              render={({ field }) => (
                <TextReact
                  label="同步应用id:"
                  {...register("syncId")}
                  {...field}
                ></TextReact>
              )}
            />
          </p>
          <p className="kintoneplugin-row">
            <ButtonReact
              className="my-button mr-4"
              onClick={handleCancel}
              text="取消"
            />
            <ButtonReact
              className="my-button"
              onClick={handleSubmit(onSubmit)}
              text="保存"
              type="submit"
            />
          </p>
        </form>
      </div>
    </>
  );
};
export default Config;
