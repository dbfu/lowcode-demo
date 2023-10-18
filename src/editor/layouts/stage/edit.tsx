import { Button } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import SelectedMask from '../../common/selected-mask';
import Space from '../../components/space';
import { ItemType } from '../../item-type';
import { Component, useComponets } from '../../stores/components';


const ComponentMap: { [key: string]: any } = {
  Button: Button,
  Space: Space,
}

const EditStage: React.FC = () => {

  const { components, curComponentId, setCurComponentId } = useComponets();

  const selectedMaskRef = useRef<any>(null);

  // 组件改变后，重新渲染遮罩
  useEffect(() => {
    if (selectedMaskRef?.current) {
      selectedMaskRef.current.updatePosition();
    }
  }, [components]);

  useEffect(() => {
    function createMask(e: any) {
      // 获取当前点击的元素
      const path = e.composedPath();
      for (let i = 0; i < path.length; i += 1) {
        const ele = path[i];
        if (ele.getAttribute) {
          if (ele.getAttribute("data-component-id")) {
            const componentId = ele.getAttribute("data-component-id");
            setCurComponentId(componentId);
            return;
          }
        }
      }
    }

    let container = document.querySelector(".stage");

    if (container) {
      container.addEventListener('click', createMask, true);
    }
    return () => {
      container = document.querySelector(".stage");
      if (container) {
        container.removeEventListener("click", createMask, true);
      }
    }
  }, []);

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
            "data-component-id": component.id,
            ...component.props,
          },
          component.props.children || renderComponents(component.children || [])
        )
      }

      return null;
    })
  }

  // 如果拖拽的组件是可以放置的，canDrop则为true，通过这个可以给组件添加边框
  const [{ canDrop }, drop] = useDrop(() => ({
    // 可以接受的元素类型
    accept: [
      ItemType.Space,
      ItemType.Button,
    ],
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      return {
        id: 0,
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  console.log(curComponentId, 'curComponentId');


  return (
    <div ref={drop} style={{ border: canDrop ? '1px solid blue' : 'none' }} className='p-[24px] h-[100%] stage'>
      {renderComponents(components)}
      {curComponentId && (
        <SelectedMask
          componentId={curComponentId}
          containerClassName='select-mask-container'
          offsetContainerClassName='stage'
          ref={selectedMaskRef}
        />
      )}
      <div className="select-mask-container" />
    </div>
  )
}

export default EditStage;