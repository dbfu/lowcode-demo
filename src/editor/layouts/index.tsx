import { Allotment } from "allotment";
import "allotment/dist/style.css";
import React, { useEffect, useState } from 'react';

import { Spin } from 'antd';
import { ComponentConfig } from '../interface';
import { useComponentConfigStore } from '../stores/component-config';
import { useComponetsStore } from '../stores/components';
import Header from './header';
import Material from './material';
import Setting from './setting';
import EditStage from './stage/edit';
import ProdStage from './stage/prod';

const Layout: React.FC = () => {

  const { mode } = useComponetsStore();
  const { setComponentConfig } = useComponentConfigStore();
  const [loading, setLoading] = useState(true);

  const componentConfigRef = React.useRef<any>({});

  // 注册组件
  function registerComponent(name: string, componentConfig: ComponentConfig) {
    componentConfigRef.current[name] = componentConfig;
  }

  // 加载组件配置
  async function loadComponentConfig() {
    // 加载组件配置模块代码
    const modules = import.meta.glob('../components/*/index.ts', { eager: true });

    const tasks = Object.values(modules).map((module: any) => {
      if (module?.default) {
        // 执行组件配置里的方法，把注册组件方法传进去
        return module.default({ registerComponent });
      }
    });

    // 等待所有组件配置加载完成
    await Promise.all(tasks);
    // 注册组件到全局
    setComponentConfig(componentConfigRef.current);
    setLoading(false);
  }


  useEffect(() => {
    loadComponentConfig();
  }, []);


  if (loading) {
    return (
      <div className='text-center mt-[100px]'>
        <Spin />
      </div>
    )
  }

  return (
    <div className='h-[100vh] flex flex-col'>
      <div className='h-[50px] flex items-centen border-solid border-[1px] border-[#ccc]'>
        <Header />
      </div>
      {mode === 'edit' ? (
        <Allotment>
          <Allotment.Pane preferredSize={240} maxSize={400} minSize={200}>
            <Material />
          </Allotment.Pane>
          <Allotment.Pane>
            <EditStage />
          </Allotment.Pane>
          <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
            <Setting />
          </Allotment.Pane>
        </Allotment>
      ) : (
        <ProdStage />
      )}
    </div>
  )
}

export default Layout;