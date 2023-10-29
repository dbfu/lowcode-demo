import { Table as AntdTable } from 'antd';
import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemType } from '../../item-type';

interface Props {
  id: number;
  children?: any[];
}

const Table: React.FC<Props> = ({ id, children }) => {

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: [ItemType.TableColumn],
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      return {
        id,
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));


  const columns: any = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      return {
        title: (
          <div className='m-[-16px] p-[16px]' data-component-id={item.props?.id}>{item.props?.title}</div>
        ),
        dataIndex: item.props?.dataIndex,
      }
    })
  }, [children]);

  return (
    <div
      className='w-[100%]'
      ref={drop}
      data-component-id={id}
      style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
    >
      <AntdTable
        columns={columns}
        dataSource={[]}
        pagination={false}
      />
    </div>
  );
}

export default Table;