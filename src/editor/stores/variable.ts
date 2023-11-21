import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
export interface Variable {
  /**
   * 变量名
   */
  name: string;
  /**
   * 默认值
   */
  defaultValue: string;
  /**
   * 备注
   */
  remark: string;
}

interface State {
  variables: Variable[];
}

interface Action {
  /**
   * 添加组件
   * @param component 组件属性
   * @param parentId 上级组件id
   * @returns
   */
  setVariables: (variables: Variable[]) => void;
}

export const useVariablesStore = create(
  persist<State & Action>(
    (set) => ({
      variables: [],
      setVariables: (variables) => set({variables}),
    }),
    {
      name: 'variables',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
