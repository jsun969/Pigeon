import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  return <Result icon={<SmileOutlined />} title="欢迎您, 管理员" />;
};

export default Welcome;
