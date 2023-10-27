import { Form, Select } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useUpdateEffect } from 'ahooks'
import ShowMessageSetting from './show-message';
import ComponentMethodSetting from './component-method';
import SetVariableSetting from './set-variable';
import ExecScriptSetting from './exec-script';
import AsyncTaskSetting from './async-task';

const FormItem = Form.Item;

const actionMap: any = {
  ShowMessage: ShowMessageSetting,
  ComponentMethod: ComponentMethodSetting,
  SetVariable: SetVariableSetting,
  ExecScript: ExecScriptSetting,
  AsyncTask: AsyncTaskSetting,
}

const EventActionTypesDesc: any = {
  ShowMessage: '显示消息',
  ComponentMethod: '组件方法',
  SetVariable: '设置变量',
  ExecScript: '执行脚本',

}

const ActionSettingPanel = (
  { graphRef, curModel, setSettingOpen }: { graphRef: any, curModel: any, setSettingOpen: any },
  ref: any
) => {

  const [values, setValues] = useState<any>(curModel.current?.config || {});

  const [form] = Form.useForm();

  useUpdateEffect(() => {
    form.setFieldsValue({
      config: null,
    });
  }, [values.type, form]);

  useImperativeHandle(ref, () => {
    return {
      save: () => {
        form.submit();
      }
    }
  }, [form])

  function save(config: any) {
    graphRef.current.updateItem(curModel.current.id, {
      ...curModel.current,
      config,
      label: EventActionTypesDesc[values.type],
      menus: [{
        label: '成功',
        key: 'success',
        nodeType: 'event',
        nodeName: '成功',
        eventKey: 'success',
      }, {
        label: '失败',
        key: 'error',
        nodeType: 'event',
        nodeName: '失败',
        eventKey: 'error',
      }, {
        label: '成功或失败',
        key: 'finally',
        nodeType: 'event',
        nodeName: '成功或失败',
        eventKey: 'finally',
      }],
    });
    setSettingOpen(false);
  }


  function valueChange(_: any, allValues: any) {
    setValues(allValues);
  }

  console.log(curModel.current?.config, 'curModel.current?.config');


  return (
    <Form
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      onFinish={save}
      initialValues={curModel.current?.config}
    >
      <FormItem label="动作类型" name="type">
        <Select
          style={{ width: 240 }}
          options={[
            { label: '显示提示', value: 'ShowMessage' },
            { label: '组件方法', value: 'ComponentMethod' },
            { label: '设置变量', value: 'SetVariable' },
            { label: '执行脚本', value: 'ExecScript' },
          ]}
        />
      </FormItem>
      {actionMap[values.type] && React.createElement(actionMap[values.type], { values })}
    </Form>
  )
}

export default forwardRef(ActionSettingPanel);