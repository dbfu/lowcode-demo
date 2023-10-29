import { Button as AntdButton } from 'antd';

const Button = (props: any) => {
  return (
    <AntdButton data-component-id={props.id} type={props.type}>{props.text}</AntdButton>
  )
}

export default (Button);