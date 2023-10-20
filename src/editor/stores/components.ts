import {create} from 'zustand';
import {getComponentById} from '../utils/utils';

export interface Component {
  /**
   * 组件唯一标识
   */
  id: number;
  /**
   * 组件名称
   */
  name: string;
  /**
   * 组件属性
   */
  props: any;
  /**
   * 子组件
   */
  children?: Component[];
}

interface State {
  components: Component[];
  curComponentId?: number | null;
  curComponent: Component | null;
  mode: 'edit' | 'preview';
}

interface Action {
  /**
   * 添加组件
   * @param component 组件属性
   * @param parentId 上级组件id
   * @returns
   */
  addComponent: (component: Component, parentId?: number) => void;
  /**
   * 设置当前组件id
   * @param componentId 当前组件id
   * @returns
   */
  setCurComponentId: (componentId: number | null) => void;
  /**
   * 更新组件属性
   * @param componentId 组件id
   * @param props 新组件属性
   * @returns
   */
  updateComponentProps: (componentId: number, props: any) => void;
  /**
   * 设置模式
   * @param mode 模式
   * @returns
   */
  setMode: (mode: State['mode']) => void;
}

export const useComponets = create<State & Action>((set) => ({
  components: [],
  curComponent: null,
  mode: 'edit',
  addComponent: (component, parentId) =>
    set((state) => {
      // 如果有上级id，把当前组件添加到父组件的子组件中
      if (parentId) {
        // 通过父id递归查找父组件
        const parentComponent = getComponentById(parentId, state.components);

        if (parentComponent) {
          if (parentComponent?.children) {
            parentComponent?.children?.push(component);
          } else {
            parentComponent.children = [component];
          }
        }
        return {components: [...state.components]};
      }
      return {components: [...state.components, component]};
    }),
  setCurComponentId: (componentId) =>
    set((state) => ({
      curComponentId: componentId,
      curComponent: getComponentById(componentId, state.components),
    })),
  updateComponentProps: (componentId, props) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        component.props = {...component.props, ...props};

        if (componentId === state.curComponentId) {
          return {
            curComponent: component,
            components: [...state.components],
          };
        }

        return {components: [...state.components]};
      }

      return {components: [...state.components]};
    }),
  setMode: (mode) => set({mode}),
}));
