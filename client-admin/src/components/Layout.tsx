import {
  MessageOutlined,
  SmileOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import ProLayout from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import API from '../services/apis';

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { run } = useRequest(API.init, {
    manual: true,
    onError() {
      navigate('/login');
    },
  });

  return (
    <ProLayout
      className="min-h-screen"
      title="飞鸽传书后台"
      navTheme="light"
      fixSiderbar
      fixedHeader
      route={{
        routes: [
          { path: '/welcome', name: '欢迎', icon: <SmileOutlined /> },
          {
            path: '/invite-codes',
            name: '邀请码管理',
            icon: <SolutionOutlined />,
          },
          {
            path: '/generate-invite-codes',
            name: '生成邀请码',
            icon: <UsergroupAddOutlined />,
          },
          { path: '/messages', name: '消息管理', icon: <MessageOutlined /> },
        ],
      }}
      menuItemRender={(menuDataItem, defaultDom) => (
        <Link to={menuDataItem.path!}>{defaultDom}</Link>
      )}
      onPageChange={() => run()}
      location={{ pathname }}
    >
      <Outlet />
    </ProLayout>
  );
};

export default Layout;
