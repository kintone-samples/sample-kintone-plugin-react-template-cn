import { FC } from "react";
import { ButtonReact } from "../../kucComponent";
import useSyncToOut from "../hooks/useSyncToOut";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const SubButton = styled(ButtonReact)`
  --kuc-button-width: 100px;
  margin-right: 30px;
`;

const SyncData: FC = () => {
  const { loading, syncStatus, handleSync } = useSyncToOut();

  return (
    <Wrapper>
      <SubButton onClick={handleSync} text="同步" disabled={loading} />
      <div>syncStatus: {syncStatus}</div>
    </Wrapper>
  );
};

export default SyncData;
