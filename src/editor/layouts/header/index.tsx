import { Button, Space } from 'antd';
import { useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { usePageDataStore } from '../../stores/page-data';
import ComponentTree from './component-tree';
import DefineVariable from './define-variable';

const Header: React.FC = () => {

  const { mode, setMode, setCurComponentId } = useComponetsStore();
  const { resetData } = usePageDataStore();

  const [componentTreeVisible, setComponentTreeVisible] = useState(false);
  const [variableVisible, setVariableVisible] = useState(false);


  return (
    <div className='flex justify-end w-[100%] px-[24px]'>
      <Space>
        {mode === 'edit' && (
          <>
            <Button
              onClick={() => {
                setComponentTreeVisible(true);
              }}
              type='primary'
            >
              查看大纲
            </Button>
            <Button
              onClick={() => {
                setVariableVisible(true);
              }}
              type='primary'
            >
              定义变量
            </Button>
            <Button
              onClick={() => {
                setMode('preview');
                setCurComponentId(null);
                resetData();
              }}
              type='primary'
            >
              预览
            </Button>
          </>
        )}
        {mode === 'preview' && (
          <Button
            onClick={() => { setMode('edit') }}
            type='primary'
          >
            退出预览
          </Button>
        )}
      </Space>
      <ComponentTree
        open={componentTreeVisible}
        onCancel={() => { setComponentTreeVisible(false) }}
      />
      <DefineVariable
        open={variableVisible}
        onCancel={() => {
          setVariableVisible(false);
        }}
      />
    </div>
  )
}

export default Header;