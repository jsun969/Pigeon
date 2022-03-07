import { useBoolean, useRequest, useUpdateEffect } from 'ahooks';
import { Radio, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API, { InviteCode as InviteCodeType } from '../services/apis';

const PAGE_SIZE = 30;
const FindInviteCode: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get('page') || 1);
  const used = searchParams.get('used') as 'true' | 'false' | undefined | null;

  const [usedRadio, setUsedRadio] = useState<'true' | 'false' | undefined>(
    used === null ? undefined : used,
  );
  useUpdateEffect(() => {
    if (usedRadio === undefined) {
      setSearchParams({ page: '1' });
    } else {
      setSearchParams({
        page: '1',
        used: usedRadio,
      });
    }
  }, [usedRadio]);

  const [ready, { set: setReady }] = useBoolean(true);
  const [pageCurrent, setPageCurrent] = useState<number>(page);
  useUpdateEffect(() => {
    setPageCurrent(+(searchParams.get('page') || 1));
    setReady(true);
  }, [searchParams]);

  const { data: response } = useRequest(API.getInviteCodes, {
    defaultParams: [PAGE_SIZE, (page - 1) * PAGE_SIZE, used],
    ready,
    onFinally() {
      setReady(false);
    },
  });

  const columns: ColumnsType<InviteCodeType> = [
    {
      title: '邀请码',
      dataIndex: '_id',
      render(code, { username }) {
        return (
          <Typography.Paragraph copyable={!username}>
            {code}
          </Typography.Paragraph>
        );
      },
    },
    { title: '注册用户名', dataIndex: 'username', responsive: ['md'] },
    {
      title: '注册时间',
      dataIndex: 'updatedAt',
      render(time, { username }) {
        return username
          ? dayjs(time).format('YYYY年M月D日 HH:mm:ss')
          : undefined;
      },
      responsive: ['md'],
    },
  ];

  return (
    <>
      <Radio.Group
        className="mb-4"
        value={usedRadio}
        onChange={(e) => setUsedRadio(e.target.value)}
      >
        <Radio.Button value={undefined}>全部</Radio.Button>
        <Radio.Button value="false">未使用</Radio.Button>
        <Radio.Button value="true">已使用</Radio.Button>
      </Radio.Group>
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
            if (searchParams.get('used')) {
              setSearchParams({
                page: `${page}`,
                used: searchParams.get('used')!,
              });
            } else {
              setSearchParams({ page: `${page}` });
            }
          },
        }}
      />
    </>
  );
};

export default FindInviteCode;
