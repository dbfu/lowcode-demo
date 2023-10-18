import { Button, Space } from 'antd';
import { useComponets } from '../../stores/components';

const Header: React.FC = () => {

  const { mode, setMode, setCurComponentId } = useComponets();

  return (
    <div className='flex justify-end w-[100%] px-[24px]'>
      <Space>
        {mode === 'edit' && (
          <Button
            onClick={() => {
              setMode('preview');
              setCurComponentId(null);
            }}
            type='primary'
          >
            预览
          </Button>
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
    </div>
  )
}

export default Header;