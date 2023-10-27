import { Space, message } from 'antd';
import React, { useRef } from 'react';
import Button from '../../components/button';
import { Component, useComponetsStore } from '../../stores/components';
import { usePageDataStore } from '../../stores/page-data';
import { useVariablesStore } from '../../stores/variable';
import { componentEventMap } from '../setting/event';
import { loadRemoteComponent } from '../../utils/utils';
import { ItemType } from '../../item-type';
import { Node } from '../flow-event/data';

const ComponentMap: { [key: string]: any } = {
  Button: Button,
  Space: Space,
  [ItemType.RemoteComponent]:
    React.lazy(() => loadRemoteComponent('https://cdn.jsdelivr.net/npm/dbfu-remote-component@1.0.5/dist/bundle.umd.js')),
}


const ProdStage: React.FC = () => {

  const { components } = useComponetsStore();
  const { variables } = useVariablesStore();
  const { setData, data } = usePageDataStore();

  const componentRefs = useRef<any>({});

  const eventHandleMap: any = {
    ShowMessage: showMessageHandle,
    ComponentMethod: componentMethodHandle,
    SetVariable: setVariableHandle,
    ExecScript: execScriptHandle,
  };


  function getData(key: string) {
    return data[key] || variables.find(o => o.name === key)?.defaultValue;
  }

  // 执行脚本
  async function execScriptHandle(item: any, actionConfig: any) {
    const { script } = actionConfig || {};

    if (script) {
      try {
        // 执行脚本
        execScript(script);

        // 执行成功后，执行后续成功success事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'success')
        execEventFlow(nodes);
      } catch {
        // 执行失败后，执行后续error事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'error')
        execEventFlow(nodes);
      } finally {
        // 执行后续成功或失败finally事件
        const nodes = item.children?.filter((o: any) => o.eventKey === "finally")
        execEventFlow(nodes);
      }
    }
  }

  // 设置变量
  async function setVariableHandle(item: any, actionConfig: any) {
    const { variable, value } = actionConfig || {};

    if (variable && value) {
      try {
        // 变量设置
        setData(variable, value);

        // 执行成功后，执行后续成功success事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'success')
        execEventFlow(nodes);
      } catch {
        // 执行失败后，执行后续error事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'error')
        execEventFlow(nodes);
      } finally {
        // 执行后续成功或失败finally事件
        const nodes = item.children?.filter((o: any) => o.eventKey === "finally")
        execEventFlow(nodes);
      }
    }
  }

  // 组件方法
  async function componentMethodHandle(item: any, actionConfig: any) {
    const { componentId, method } = actionConfig || {};

    if (componentId && actionConfig) {
      try {
        // 执行组件方法
        await componentRefs.current[componentId][method]();

        // 执行成功后，执行后续成功success事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'success')
        execEventFlow(nodes);
      } catch {
        // 执行失败后，执行后续error事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'error')
        execEventFlow(nodes);
      } finally {
        // 执行后续成功或失败finally事件
        const nodes = item.children?.filter((o: any) => o.eventKey === "finally")
        execEventFlow(nodes);
      }
    }
  }

  // 显示提示
  function showMessageHandle(item: any, actionConfig: any) {
    if (actionConfig?.type && actionConfig?.text) {
      try {
        if (actionConfig.type === 'success') {
          message.success(actionConfig.text);
        } else if (actionConfig.type === 'error') {
          message.error(actionConfig.text);
        }

        // 执行成功后，执行后续成功success事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'success');
        execEventFlow(nodes);
      } catch {
        // 执行失败后，执行后续error事件
        const nodes = item.children?.filter((o: any) => o.eventKey === 'error')
        execEventFlow(nodes);
      } finally {
        // 执行后续成功或失败finally事件
        const nodes = item.children?.filter((o: any) => o.eventKey === "finally")
        execEventFlow(nodes);
      }
    }
  }

  // 执行脚本
  function execScript(script: string) {
    const func = new Function('ctx', `return ${script}`);

    const ctx = { setData, getComponentRef, getData };
    return func(ctx)
  }



  // 获取组件引用
  function getComponentRef(componentId: number) {
    return componentRefs.current[componentId];
  }

  // 处理组件props
  function formatProps(component: Component) {
    const props = Object.keys(component.props || {})
      .reduce<any>((prev, cur) => {
        // 如果组件属性是对象，则判断是静态值还是变量
        if (typeof component.props[cur] === 'object') {
          // 如果是静态值，则直接赋值。 如果是变量，则取变量中的默认值
          if (component.props[cur]?.type === 'static') {
            prev[cur] = component.props[cur].value;
          } else if (component.props[cur]?.type === 'variable') {
            const variableName = component.props[cur].value;
            const variable = variables.find((item) => item.name === variableName);
            // 如果data中有值，则取data中的值。否则取变量的默认值
            prev[cur] = data[variableName] || variable?.defaultValue;
          }
        } else {
          prev[cur] = component.props[cur];
        }

        return prev;
      }, {});

    return props;
  }

  /**
   * 执行事件流
   * @param nodes 事件流
   */
  function execEventFlow(nodes: Node[] = []) {

    if (!nodes.length) return;

    nodes.forEach(async item => {
      // 判断是否是动作节点，如果是动作节点并且条件结果不为false，则执行动作
      if (item.type === 'action' && item.conditionResult !== false) {
        // 根据不同动作类型执行不同动作
        await eventHandleMap[item.config.type](item, item.config.config);
      } else if (item.type === 'condition') {
        // 如果是条件节点，执行条件脚本，把结果注入到子节点conditionResult属性中
        const conditionResult = (item.config || []).reduce((prev: any, cur: any) => {
          const result = execScript(cur.condition);
          prev[cur.id] = result;
          return prev;
        }, {});

        (item.children || []).forEach((c: any) => {
          c.conditionResult = !!conditionResult[c.conditionId];
        });
        // 递归执行子节点事件流
        execEventFlow(item.children);
      } else if (item.type === 'event') {
        // 如果是事件节点，执行事件子节点事件流
        execEventFlow(item.children);
      }
    })
  }


  // 处理事件
  function handleEvent(component: Component) {
    const props: any = {};

    if (componentEventMap[component.name]?.length) {
      componentEventMap[component.name].forEach((event) => {
        const eventConfig = component.props[event.name];

        if (eventConfig) {
          props[event.name] = () => {
            eventConfig.children && execEventFlow(eventConfig.children);
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

      let props = formatProps(component);

      props = { ...props, ...handleEvent(component) };

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
      <React.Suspense fallback="loading...">
        {renderComponents(components)}
      </React.Suspense>
    </div>
  );
}

export default ProdStage;