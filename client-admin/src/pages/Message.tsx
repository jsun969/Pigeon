import { useBoolean, useRequest, useUpdateEffect } from 'ahooks';
import { Button, Modal, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API, { Message as MessageType } from '../services/apis';

const PAGE_SIZE = 30;
const Message: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get('page') || 1);
  const username = (
    searchParams.get('username') === null
      ? undefined
      : searchParams.get('username')
  ) as string | undefined;
  const code =
    searchParams.get('code') === null
      ? undefined
      : (searchParams.get('code') as string | undefined);

  const [ready, { set: setReady }] = useBoolean(true);
  const [pageCurrent, setPageCurrent] = useState<number>(page);
  useUpdateEffect(() => {
    setPageCurrent(+(searchParams.get('page') || 1));
    setReady(true);
  }, [searchParams]);

  const { data: response } = useRequest(API.getMessages, {
    defaultParams: [PAGE_SIZE, (page - 1) * PAGE_SIZE, username, code],
    ready,
    onFinally() {
      setReady(false);
    },
  });

  const [detailMessage, setDetailMessage] = useState<string>('');
  const [showDetailMessage, { set: setShowDetailMessage }] = useBoolean(false);

  const columns: ColumnsType<MessageType> = [
    {
      title: '时间',
      dataIndex: 'time',
      render: (time) => dayjs(time).format('YYYY年M月D日 HH:mm:ss'),
      responsive: ['md'],
    },
    { title: '姓名', dataIndex: 'fullName', responsive: ['md'] },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => (
        <Typography.Link
          onClick={() => setSearchParams({ page: '1', username })}
        >
          {username}
        </Typography.Link>
      ),
    },
    {
      title: '设备',
      dataIndex: 'devices',
      render: (devices) => (
        <>
          {devices.map(({ code }: { code: number }) => (
            <Button
              key={code}
              size="small"
              className="mr-1 last:mr-0"
              onClick={() =>
                setSearchParams({
                  page: '1',
                  code: `${code}`,
                })
              }
            >
              {code}
            </Button>
          ))}
        </>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      render: (message) => <p className="truncate w-16 sm:w-40">{message}</p>,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (_, { message }) => (
        <Typography.Link
          onClick={() => {
            setDetailMessage(message);
            setShowDetailMessage(true);
          }}
        >
          详细消息
        </Typography.Link>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={response?.data.data}
        rowKey="_id"
        pagination={{
          current: pageCurrent,
          defaultCurrent: page,
          defaultPageSize: PAGE_SIZE,
          showSizeChanger: false,
          total: response?.data.total,
          hideOnSinglePage: true,
          onChange(page) {
            if (username) {
              setSearchParams({
                username,
                page: `${page}`,
              });
            } else if (code) {
              setSearchParams({
                code,
                page: `${page}`,
              });
            } else {
              setSearchParams({
                page: `${page}`,
              });
            }
          },
        }}
      />
      <Modal
        visible={showDetailMessage}
        onOk={() => setShowDetailMessage(false)}
        onCancel={() => setShowDetailMessage(false)}
      >
        <div className="whitespace-pre-wrap">{detailMessage}</div>
      </Modal>
    </>
  );
};

export default Message;
