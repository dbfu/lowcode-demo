import { Form as AntdForm, Input } from 'antd';
import axios from 'axios';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';


const Form = ({ children, onSaveSuccess, onSaveFail, url }: any, ref: any) => {

  const [form] = AntdForm.useForm();

  useImperativeHandle(ref, () => {
    return {
      submit: () => {
        form.submit();
      }
    }
  }, [form]);

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



  async function save(values: any) {
    try {
      if (url) {
        await axios.post(url, values);
        onSaveSuccess && onSaveSuccess();
      }
    } catch {
      onSaveFail && onSaveFail();
    }
  }



  return (
    <AntdForm name='form' labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form} onFinish={save}>
      {searchItems.map((item: any) => {
        return (
          <AntdForm.Item key={item.name} name={item.name} label={item.label} >
            <Input />
          </AntdForm.Item>
        )
      })}
    </AntdForm>
  );
}

export default forwardRef(Form);