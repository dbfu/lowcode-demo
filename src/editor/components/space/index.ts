import {Context} from '../../interface';
import SpaceDev from './dev';
import SpaceProd from './prod';

export default (ctx: Context) => {
  ctx.registerComponent('Space', {
    name: 'Space',
    desc: '间距',
    defaultProps: {
      size: {type: 'static', value: 'middle'},
    },
    dev: SpaceDev,
    prod: SpaceProd,
    setter: [
      {
        name: 'direction',
        label: '间距方向',
        type: 'select',
        options: [
          {label: '水平', value: 'horizontal'},
          {label: '垂直', value: 'vertical'},
        ],
      },
      {
        name: 'size',
        label: '间距大小',
        type: 'select',
        options: [
          {label: '大', value: 'large'},
          {label: '中', value: 'middle'},
          {label: '小', value: 'small'},
        ],
      },
    ],
    order: 1,
  });
};
