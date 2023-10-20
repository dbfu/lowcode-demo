import {Component} from '../stores/components';

/**
 * 根据 id 递归查找组件
 *
 * @param id 组件 id
 * @param components 组件数组
 * @returns 匹配的组件或 null
 */
export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) return null;

  for (const component of components) {
    if (component.id == id) return component;
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result !== null) return result;
    }
  }
  return null;
}
