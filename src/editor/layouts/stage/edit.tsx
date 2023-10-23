import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import SelectedMask from '../../common/selected-mask';
import Button from '../../components/button';
import Space from '../../components/space';
import { ItemType } from '../../item-type';
import { Component, useComponetsStore } from '../../stores/components';

const ComponentMap: { [key: string]: any } = {
  Button: Button,
  Space: Space,
}


const EditStage: React.FC = () => {

  const { components, curComponentId, setCurComponentId } = useComponetsStore();

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

  function formatProps(component: Component) {
    const props = Object.keys(component.props || {}).reduce<any>((prev, cur) => {

      if (typeof component.props[cur] === 'object') {
        if (component.props[cur]?.type === 'static') {
          prev[cur] = component.props[cur].value;
        } else if (component.props[cur]?.type === 'variable') {

          const variableName = component.props[cur].value;

          prev[cur] = `\${${variableName}}`;
        }
      } else {
        prev[cur] = component.props[cur];
      }

      return prev;

    }, {});

    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {

      if (!ComponentMap[component.name]) {
        return null;
      }


      const props = formatProps(component);


      if (ComponentMap[component.name]) {
        return React.createElement(
          ComponentMap[component.name],
          {
            key: component.id,
            id: component.id,
            "data-component-id": component.id,
            ...component.props,
            ...props,
            useDrop,
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


  return (
    <div ref={drop} style={{ border: canDrop ? '1px solid blue' : 'none' }} className='p-[24px] h-[100%] stage'>
      <React.Suspense fallback="loading...">
        {renderComponents(components)}
      </React.Suspense>
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