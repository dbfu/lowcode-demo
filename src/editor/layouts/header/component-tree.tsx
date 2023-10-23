import { Modal, Tree } from 'antd';
import { useComponetsStore } from '../../stores/components';

interface ComponentTreeProps {
  open: boolean,
  onCancel: () => void,
}

const ComponentTree = ({ open, onCancel }: ComponentTreeProps) => {

  const { components, setCurComponentId } = useComponetsStore();

  function componentSelect([selectedKey]: any[]) {
    setCurComponentId(selectedKey);
    onCancel && onCancel();
  }

  return (
    <Modal
      open={open}
      title="组件树"
      onCancel={onCancel}
      destroyOnClose
      footer={null}
    >
      <Tree
        fieldNames={{ title: 'name', key: 'id' }}
        treeData={components as any}
        showLine
        defaultExpandAll
        onSelect={componentSelect}
      />
    </Modal>
  )
}

export default ComponentTree;