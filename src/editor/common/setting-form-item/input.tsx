import { SettingOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const SettingFormItemInput: React.FC<any> = ({ value, onChange }) => {


  function valueChange(e: any) {
    onChange({
      type: 'static',
      value: e?.target?.value,
    })
  }




  return (
    <div className='flex gap-[8px]'>
      <Input disabled={value?.type === 'variable'} value={(value?.type === 'static' || !value) ? value?.value : ''} onChange={valueChange} />
      <SettingOutlined style={{ color: value?.type === 'variable' ? 'blue' : '' }} />
    </div>
  )



}


export default SettingFormItemInput;