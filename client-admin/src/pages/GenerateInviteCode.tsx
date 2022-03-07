import { useRequest } from 'ahooks';
import {
  Button,
  Divider,
  Form,
  InputNumber,
  List,
  message,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import API from '../services/apis';

const GenerateInviteCode: React.FC = () => {
  const { run } = useRequest(API.generateInviteCodes, {
    manual: true,
    onSuccess(response) {
      setNewInviteCodes([...response.data, ...newInviteCodes]);
      message.success('生成成功');
    },
  });

  const [newInviteCodes, setNewInviteCodes] = useState<string[]>([]);

  return (
    <>
      <Form layout="inline" onFinish={(formData) => run(formData)}>
        <Form.Item label="数量" name="count">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            生成
          </Button>
        </Form.Item>
      </Form>
      <Divider orientation="left">生成的邀请码</Divider>
      <List
        dataSource={newInviteCodes}
        bordered
        size="small"
        renderItem={(item) => (
          <List.Item className="odd:bg-gray-200">
            <Typography.Paragraph copyable>{item}</Typography.Paragraph>
          </List.Item>
        )}
      />
    </>
  );
};

export default GenerateInviteCode;
