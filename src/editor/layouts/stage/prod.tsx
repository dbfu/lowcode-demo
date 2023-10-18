import { Button, Space } from 'antd';
import React from 'react';
import { Component, useComponets } from '../../stores/components';

const ComponentMap: { [key: string]: any } = {
  Button: Button,
  Space: Space,
}

const ProdStage: React.FC = () => {

  const { components } = useComponets();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {

      if (!ComponentMap[component.name]) {
        return null;
      }

      if (ComponentMap[component.name]) {
        return React.createElement(
          ComponentMap[component.name],
          {
            key: component.id,
            id: component.id,
            ...component.props,
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