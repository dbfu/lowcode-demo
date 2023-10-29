import { useMemo } from 'react';
import ComponentItem from '../../common/component-item';
import { ComponentConfig } from '../../interface';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponetsStore } from '../../stores/components';

const Material: React.FC = () => {

  const { addComponent } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  /**
   * 拖拽结束，添加组件到画布
   * @param dropResult 
   */
  const onDragEnd = (dropResult: { name: string, id?: number, props: any }) => {
    addComponent({
      id: new Date().getTime(),
      name: dropResult.name,
      props: dropResult.props,
    }, dropResult.id);
  }

  const components = useMemo(() => {
    // 加载所有组件
    const coms = Object.values(componentConfig).map((config: ComponentConfig) => {
      return {
        name: config.name,
        description: config.desc,
        order: config.order,
      }
    })

    // 排序
    coms.sort((x, y) => x.order - y.order);
    return coms;
  }, [componentConfig]);

  return (
    <div className='flex p-[10px] gap-4 flex-wrap'>
      {components.map(item => <ComponentItem key={item.name} onDragEnd={onDragEnd} {...item} />)}
    </div>
  )
}

export default Material;