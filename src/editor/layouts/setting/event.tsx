import { Button, Collapse, Drawer } from 'antd';
import { useRef, useState } from 'react';
import { ItemType } from '../../item-type';
import { useComponetsStore } from '../../stores/components';

import FlowEvent from '../flow-event';

export const componentEventMap = {
  [ItemType.Button]: [{
    name: 'onClick',
    label: '点击事件',
  }],
}

const ComponentEvent = () => {

  const { curComponent, curComponentId, updateComponentProps } = useComponetsStore();

  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState('');

  const flowEventRef = useRef<any>();


  function save() {
    if (!curComponentId) return;

    const value = flowEventRef.current?.save();
    console.log(value);

    updateComponentProps(curComponentId, {
      [eventName]: value,
    });

    setOpen(false);
  }

  if (!curComponent) return null;

  return (
    <div className='px-[12px]'>
      {(componentEventMap[curComponent.name] || []).map(setting => {
        return (
          <Collapse key={setting.name} defaultActiveKey={setting.name}>
            <Collapse.Panel header={setting.label} key={setting.name}>
              <div className='text-center'>
                <Button
                  onClick={() => {
                    setEventName(setting.name);
                    setOpen(true);
                  }}
                  type='primary'
                >
                  设置事件流
                </Button>
              </div>
            </Collapse.Panel>
          </Collapse>
        )
      })}
      <Drawer
        title="设置事件流"
        width="100vw"
        open={open}
        zIndex={1005}
        onClose={() => { setOpen(false); }}
        extra={(
          <Button
            type='primary'
            onClick={save}
          >
            保存
          </Button>
        )}
        push={false}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        <FlowEvent flowData={curComponent?.props?.[eventName]} ref={flowEventRef} />
      </Drawer>
    </div>
  )
}




export default ComponentEvent;