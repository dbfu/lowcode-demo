import { Space, message } from 'antd';
import React, { useRef } from 'react';
import Button from '../../components/button';
import { Component, useComponets } from '../../stores/components';
import { componentEventMap } from '../setting/event';

const ComponentMap: { [key: string]: any } = {
  Button: Button,
  Space: Space,
}

const ProdStage: React.FC = () => {

  const { components } = useComponets();

  const componentRefs = useRef<any>({});


  // 处理事件
  function handleEvent(component: Component) {
    const props: any = {};

    if (componentEventMap[component.name]?.length) {
      componentEventMap[component.name].forEach((event) => {

        const eventConfig = component.props[event.name];

        if (eventConfig) {
          const { type, config } = eventConfig;
          props[event.name] = () => {
            if (type === 'showMessage') {
              if (config.type === 'success') {
                message.success(config.text);
              } else if (config.type === 'error') {
                message.error(config.text);
              }
            } else if (type === 'componentFunction') {
              const component = componentRefs.current[config.componentId];

              if (component) {
                component[config.method]?.();
              }
            }
          }
        }
      })
    }
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {

      if (!ComponentMap[component.name]) {
        return null;
      }

      const props = handleEvent(component);

      if (ComponentMap[component.name]) {
        return React.createElement(
          ComponentMap[component.name],
          {
            key: component.id,
            id: component.id,
            ref: (ref) => { componentRefs.current[component.id] = ref; },
            ...component.props,
            ...props,
          },
          component.props.children || renderComponents(component.children || [])
        )
      }

      return null;
    })
  }


  return (
    <div>
      {renderComponents(components)}
    </div>
  );
}

export default ProdStage;