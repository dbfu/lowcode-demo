import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemType } from '../../item-type';


const Modal: React.FC<any> = ({ id, children, title }) => {

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: [ItemType.Form, ItemType.Table],
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      return {
        id,
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));


  if (!children?.length) {
    return (
      <div data-component-id={id} className='p-[10px]'>
        <h4>{title}</h4>
        <div
          ref={drop}
          className='p-[16px] flex justify-center'
          style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
        >
          暂无内容
        </div>
      </div>
    )
  }


  return (
    <div data-component-id={id} className='p-[10px]'>
      <h4>{title}</h4>
      <div
        ref={drop}
        className='p-[16px]'
        style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;