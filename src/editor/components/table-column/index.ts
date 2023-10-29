import {Context} from '../../interface';
import Dev from './dev';
import Prod from './prod';

export default (ctx: Context) => {
  ctx.registerComponent('TableColumn', {
    name: 'TableColumn',
    desc: '表格列',
    defaultProps: () => {
      return {
        dataIndex: {type: 'static', value: `col_${new Date().getTime()}`},
        title: {type: 'static', value: '标题'},
        type: 'text',
      };
    },
    dev: Dev,
    prod: Prod,
    setter: [
      {
        name: 'type',
        label: '类型',
        type: 'select',
        options: [
          {
            label: '文本',
            value: 'text',
          },
          {
            label: '日期',
            value: 'date',
          },
        ],
      },
      {
        name: 'title',
        label: '标题',
        type: 'input',
      },
      {
        name: 'dataIndex',
        label: '字段',
        type: 'input',
      },
    ],
    order: 5,
  });
};
