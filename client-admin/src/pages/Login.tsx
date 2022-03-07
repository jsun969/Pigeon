import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useRequest, useTitle } from 'ahooks';
import API from '../services/apis';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  useTitle('登录 - 飞鸽传书后台');

  const navigate = useNavigate();

  useRequest(API.init, {
    ready: localStorage.getItem('token') !== null,
    onError() {
      localStorage.removeItem('token');
    },
    onSuccess() {
      navigate('/welcome');
    },
  });

  const { run } = useRequest(API.login, {
    manual: true,
    onSuccess(response) {
      localStorage.setItem('token', response.data.token);
      message.success('登录成功');
      navigate('/welcome');
    },
  });

  return (
    <div className="flex h-screen">
      <Form className="max-w-sm m-auto" onFinish={(formData) => run(formData)}>
        <Form.Item label="后台KEY" name="key">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
