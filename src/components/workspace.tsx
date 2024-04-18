import { Allotment } from "allotment";
import "allotment/dist/style.css";
import View from "./view";
import Points from "./points";
import { ConfigProvider, theme } from "antd";

const Workspace = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {},
        components: {
          Button: {
            colorPrimary: "#007bff",
          },
        },
      }}
      componentSize="small"
    >
      <Allotment>
        <Allotment.Pane>
          <View />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300}>
          <Points />
        </Allotment.Pane>
      </Allotment>
    </ConfigProvider>
  );
};

export default Workspace;
