import { Collapse, Input, Select, TreeSelect } from 'antd';
import { useState } from 'react';
import { ItemType } from '../../item-type';
import { Component, useComponetsStore } from '../../stores/components';
import { useVariablesStore } from '../../stores/variable';
import { getComponentById } from '../../utils/utils';

export const componentEventMap = {
  [ItemType.Button]: [{
    name: 'onClick',
    label: '点击事件',
  }],
}


const componentMethodsMap = {
  [ItemType.Button]: [{
    name: 'startLoading',
    label: '开始loading',
  }, {
    name: 'endLoading',
    label: '结束loading',
  }],
}

const ComponentEvent = () => {

  const { curComponent, curComponentId, updateComponentProps, components } = useComponetsStore();
  const { variables } = useVariablesStore();

  const [selectedComponent, setSelectedComponent] = useState<Component | null>();


  function typeChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, { [eventName]: { type: value, } })
  }

  function messageTypeChange(eventName: string, value: string) {
    if (!curComponentId) return;
    setSelectedComponent(null);
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          type: value,
        },
      }
    })
  }

  function messageTextChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          text: value,
        },
      },
    })
  }

  function componentChange(eventName: string, value: number) {
    if (!curComponentId) return;

    setSelectedComponent(getComponentById(value, components))

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          componentId: value,
        },
      },
    })
  }

  function componentMethodChange(eventName: string, value: string) {
    if (!curComponentId) return;

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          method: value,
        },
      },
    })
  }

  function variableChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          variable: value,
        },
      }
    })
  }

  function varibaleValueChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          value,
        },
      }
    })
  }

  function scriptChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          script: value,
        },
      }
    })
  }


  if (!curComponent) return null;

  return (
    <div className='px-[12px]'>
      {(componentEventMap[curComponent.name] || []).map(setting => {
        return (
          <Collapse key={setting.name} defaultActiveKey={setting.name}>
            <Collapse.Panel header={setting.label} key={setting.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div>动作：</div>
                <div>
                  <Select
                    style={{ width: 160 }}
                    options={[
                      { label: '显示提示', value: 'showMessage' },
                      { label: '组件方法', value: 'componentFunction' },
                      { label: '设置变量', value: 'setVariable' },
                      { label: '执行脚本', value: 'execScript' },
                    ]}
                    onChange={(value) => { typeChange(setting.name, value) }}
                    value={curComponent?.props?.[setting.name]?.type}
                  />
                </div>
              </div>
              {
                curComponent?.props?.[setting.name]?.type === 'showMessage' && (
                  <div className='flex flex-col gap-[12px] mt-[12px]'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>类型：</div>
                      <div>
                        <Select
                          style={{ width: 160 }}
                          options={[
                            { label: '成功', value: 'success' },
                            { label: '失败', value: 'error' },
                          ]}
                          onChange={(value) => { messageTypeChange(setting.name, value) }}
                          value={curComponent?.props?.[setting.name]?.config?.type}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>文本：</div>
                      <div>
                        <Input
                          onChange={(e) => { messageTextChange(setting.name, e.target.value) }}
                          value={curComponent?.props?.[setting.name]?.config?.text}
                        />
                      </div>
                    </div>
                  </div>
                )
              }
              {
                curComponent?.props?.[setting.name]?.type === 'componentFunction' && (
                  <div className='flex flex-col gap-[12px] mt-[12px]'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>组件：</div>
                      <div>
                        <TreeSelect
                          style={{ width: 160 }}
                          treeData={components}
                          fieldNames={{
                            label: 'name',
                            value: 'id',
                          }}
                          onChange={(value) => { componentChange(setting.name, value) }}
                          value={curComponent?.props?.[setting.name]?.config?.componentId}
                        />
                      </div>
                    </div>
                    {componentMethodsMap[selectedComponent?.name || ''] && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div>方法：</div>
                        <div>
                          <Select
                            style={{ width: 160 }}
                            options={componentMethodsMap[selectedComponent?.name || ''].map(
                              method => ({ label: method.label, value: method.name })
                            )}
                            value={curComponent?.props?.[setting.name]?.config?.method}
                            onChange={(value) => { componentMethodChange(setting.name, value) }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              {
                curComponent?.props?.[setting.name]?.type === 'setVariable' && (
                  <div className='flex flex-col gap-[12px] mt-[12px]'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>变量：</div>
                      <div>
                        <Select
                          style={{ width: 160 }}
                          options={variables.map(item => ({ label: item.remark, value: item.name }))}
                          value={curComponent?.props?.[setting.name]?.config?.variable}
                          onChange={(value) => { variableChange(setting.name, value) }}
                        />
                      </div>
                    </div>
                    {curComponent?.props?.[setting.name]?.type === 'setVariable' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div>值：</div>
                        <div>
                          <Input
                            value={curComponent?.props?.[setting.name]?.config?.value}
                            onChange={(e) => { varibaleValueChange(setting.name, e.target.value) }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              {
                curComponent?.props?.[setting.name]?.type === 'execScript' && (
                  <div className='flex flex-col gap-[12px] mt-[12px]'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>脚本：</div>
                      <div>
                        <Input.TextArea
                          defaultValue={`(function (ctx) {
// TODO


})(ctx)`}
                          style={{ width: 160 }}
                          rows={6}
                          value={curComponent?.props?.[setting.name]?.config?.script}
                          onChange={(e) => {
                            scriptChange(setting.name, e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              }
            </Collapse.Panel>
          </Collapse>
        )
      })}
    </div>
  )
}




export default ComponentEvent;