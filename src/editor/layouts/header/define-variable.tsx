import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space } from 'antd';
import React from 'react';


const DefineVariable: React.FC<{ open: boolean, onCancel: () => void }> = ({ open, onCancel }) => {

  const [form] = Form.useForm();


  function onFinish(values: any) {
    console.log('Received values of form:', values);
  }


  return (
    <Modal
      open={open}
      title="定义变量"
      onCancel={onCancel}
      destroyOnClose
      onOk={() => { form.submit() }}
    >
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        className='py-[20px]'
        form={form}
      >
        <Form.List name="variables">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: '变量名不能为空' }]}
                  >
                    <Input placeholder="变量名" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'defaultValue']}
                  >
                    <Input placeholder="默认值" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加变量
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
};

export default DefineVariable;