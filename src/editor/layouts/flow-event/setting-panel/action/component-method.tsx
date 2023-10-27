import { Form, Input, Select, TreeSelect } from 'antd';
import { useComponetsStore } from '../../../../stores/components';
import { ItemType } from '../../../../item-type';
import { useMemo } from 'react';
import { getComponentById } from '../../../../utils/utils';

const FormItem = Form.Item;

const componentMethodsMap = {
  [ItemType.Button]: [{
    name: 'startLoading',
    label: '开始loading',
  }, {
    name: 'endLoading',
    label: '结束loading',
  }],
}

const ComponentMethodSetting = ({ values }: { values: any }) => {

  const { components } = useComponetsStore();

  const component = useMemo(() => {
    if (values?.config?.componentId) {
      return getComponentById(values?.config?.componentId, components);
    }
  }, [values?.config?.componentId])

  return (
    <>
      <FormItem label="组件" name={['config', 'componentId']}>
        <TreeSelect
          style={{ width: 240 }}
          treeData={components}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
        />
      </FormItem>
      {componentMethodsMap[component?.name || ''] && (
        <FormItem label="方法" name={['config', 'method']}>
          <Select
            style={{ width: 240 }}
            options={componentMethodsMap[component?.name || ''].map(
              method => ({ label: method.label, value: method.name })
            )}
          />
        </FormItem>
      )}
    </>
  )
}

export default ComponentMethodSetting;