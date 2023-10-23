import React from 'react';
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

const fetchBundle = async (url: string, _requires: any) => {
  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const exports = {};
      const module = {exports};
      const func = new Function('require', 'module', 'exports', data);
      func(_requires, module, exports);
      return module.exports;
    });
};

// 远程加载组件
export const remoteImport = async (url: string) => {
  const external: any = {
    react: React,
  };

  const _requires = (id: string) => {
    return external[id];
  };

  const component = await fetchBundle(url, _requires).catch(() => ({
    default: () => '组件加载失败',
  }));

  return {default: component};
};
