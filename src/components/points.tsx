import { Button, Divider, Form, InputNumber, Space } from "antd";
import usePointsStore, { Point } from "../store/points";
import { useCallback } from "react";
import {
  PlusOutlined,
  StopOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const PointEditForm = ({
  point,
  pointIndex,
}: {
  point: Point;
  pointIndex: number;
}) => {
  const [editPointsForm] = Form.useForm<Point>();

  const updatePoint = usePointsStore((state) => state.updatePoint);
  const removePoint = usePointsStore((state) => state.removePoint);

  const onUpdatePoint = useCallback(async () => {
    const point = await editPointsForm.validateFields();
    updatePoint(pointIndex, point);
  }, [editPointsForm, updatePoint, pointIndex]);

  const onDeletePoint = useCallback(() => {
    removePoint(pointIndex);
  }, [pointIndex, removePoint]);

  return (
    <Form form={editPointsForm} initialValues={point}>
      <Space.Compact>
        <Form.Item name={"x"} rules={[{ required: true }]}>
          <InputNumber addonBefore={"x"} />
        </Form.Item>

        <Form.Item name={"y"} rules={[{ required: true }]}>
          <InputNumber addonBefore={"y"} />
        </Form.Item>

        <Form.Item name={"z"} rules={[{ required: true }]}>
          <InputNumber addonBefore={"z"} />
        </Form.Item>

        <Button type="primary" danger onClick={onDeletePoint}>
          <DeleteOutlined />
        </Button>

        <Button type="primary" onClick={onUpdatePoint}>
          <SaveOutlined />
        </Button>
      </Space.Compact>
    </Form>
  );
};

const Points = () => {
  const [addPointForm] = Form.useForm<Point>();

  const points = usePointsStore((state) => state.points);
  const addPoint = usePointsStore((state) => state.addPoint);

  const onAddPoint = useCallback(async () => {
    const newPoint = await addPointForm.validateFields();
    addPoint(newPoint);
    addPointForm.resetFields();
  }, [addPointForm, addPoint]);

  const onAddPointReset = useCallback(() => {
    addPointForm.resetFields();
  }, [addPointForm]);

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        padding: "1rem",
        boxSizing: "border-box",
        background: "#181c20",
      }}
    >
      <Divider>Points</Divider>

      {points.map((point, index) => (
        <PointEditForm
          point={point}
          key={`${point.x}-${point.y}-${point.z}-${index}`}
          pointIndex={index}
        />
      ))}

      <Divider />

      <Form form={addPointForm}>
        <Space.Compact>
          <Form.Item name={"x"} rules={[{ required: true }]}>
            <InputNumber addonBefore={"x"} />
          </Form.Item>

          <Form.Item name={"y"} rules={[{ required: true }]}>
            <InputNumber addonBefore={"y"} />
          </Form.Item>

          <Form.Item name={"z"} rules={[{ required: true }]}>
            <InputNumber addonBefore={"z"} />
          </Form.Item>

          <Button onClick={onAddPointReset}>
            <StopOutlined />
          </Button>

          <Button type="primary" onClick={onAddPoint}>
            <PlusOutlined />
          </Button>
        </Space.Compact>
      </Form>
    </Space>
  );
};

export default Points;
