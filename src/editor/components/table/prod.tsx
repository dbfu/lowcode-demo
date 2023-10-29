import { Table as AntdTable } from 'antd';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import axios from 'axios';

interface Props {
  url: string;
  children: any;
}

const Table = ({ url, children }: Props, ref: any) => {

  const [data, setData] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({});

  const [loading, setLoading] = useState(false);


  const getData = async (params?: any) => {
    if (url) {
      setLoading(true);
      const { data } = await axios.get(url, { params });
      setData(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    getData(searchParams);
  }, [searchParams]);

  useImperativeHandle(ref, () => {
    return {
      search: setSearchParams,
      reload: () => {
        getData(searchParams)
      },
    }
  }, [searchParams])

  const columns: any = useMemo(() => {
    return React.Children.map(children, (item: any) => {

      if (item?.props?.type === 'date') {
        return {
          title: item.props?.title,
          dataIndex: item.props?.dataIndex,
          render: (value: any) => dayjs(value).format('YYYY-MM-DD')
        }
      }

      return {
        title: item.props?.title,
        dataIndex: item.props?.dataIndex,
      }
    })
  }, [children]);


  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      loading={loading}
    />
  );
}

export default forwardRef(Table);