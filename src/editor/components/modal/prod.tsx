import { Modal as AntdModal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const Modal = ({ children, title, onOk }: any, ref: any) => {

  const [open, setOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);


  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true);
      },
      close: () => {
        setOpen(false);
      },
      startConfirmLoading: () => {
        setConfirmLoading(true);
      },
      endConfirmLoading: () => {
        setConfirmLoading(false);
      },
    }
  }, []);


  return (
    <AntdModal
      title={title}
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      onOk={onOk}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      {children}
    </AntdModal>
  );
}

export default forwardRef(Modal);