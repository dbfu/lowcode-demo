import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import SettingFormItemInput from '../../common/setting-form-item/input';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponetsStore } from '../../stores/components';




const ComponentAttr = () => {

  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentProps } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    console.log(curComponent);

    // 初始化表单
    form.setFieldsValue(curComponent?.props);
  }, [curComponent])

  // 监听表单值变化，更新组件属性
  function valueChange(changeValues: any) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  }

  /**
 * 动态渲染表单元素
 * @param setting 元素配置
 * @returns 
 */
  function renderFormElememt(setting: any) {
    const { type, options } = setting;

    if (type === 'select') {
      return (
        <Select options={options} />
      )
    } else if (type === 'input') {
      return (
        <SettingFormItemInput />
      )
    }
  }

  if (!curComponentId || !curComponent) return null;

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>
      {((componentConfig[curComponent?.name])?.setter || []).map((setting: any) => {
        return (
          <Form.Item key={setting.name} name={setting.name} label={setting.label}>
            {renderFormElememt(setting)}
          </Form.Item>
        )
      })}
    </Form>
  )
}

export default ComponentAttr;