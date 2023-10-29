import { Form as AntdForm, Input } from 'antd';
import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemType } from '../../item-type';


interface Props {
  id: number;
  children?: any[];
  onSearch?: (values: any) => void;
}

const Form: React.FC<Props> = ({ id, children, onSearch }) => {

  const [form] = AntdForm.useForm();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: [ItemType.FormItem],
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


  const searchItems = useMemo(() => {
    return React.Children.map(children, (item: any) => {

      console.log(item);

      return {
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
      }
    });
  }, [children]);

  const search = (values: any) => {
    onSearch && onSearch(values);
  }


  if (!children?.length) {
    return (
      <div
        data-component-id={id}
        ref={drop}
        className='p-[16px] flex justify-center'
        style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
      >
        暂无内容
      </div>
    )
  }


  return (
    <div className='w-[100%] py-[20px]' ref={drop} data-component-id={id} style={{ border: canDrop ? '1px solid #ccc' : 'none' }}>
      <AntdForm labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form} onFinish={search}>
        {searchItems.map((item: any) => {
          return (
            <AntdForm.Item key={item.name} data-component-id={item.id} name={item.name} label={item.label} >
              <Input />
            </AntdForm.Item>
          )
        })}
      </AntdForm>
    </div >
  );
}

export default Form;