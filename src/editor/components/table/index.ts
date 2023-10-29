import {Context} from '../../interface';
import TableDev from './dev';
import TableProd from './prod';

export default (ctx: Context) => {
  ctx.registerComponent('Table', {
    name: 'Table',
    desc: '表格',
    defaultProps: {},
    dev: TableDev,
    prod: TableProd,
    setter: [
      {
        name: 'url',
        label: 'url',
        type: 'input',
      },
    ],
    methods: [
      {
        name: 'search',
        desc: '搜索',
      },
      {
        name: 'reload',
        desc: '刷新',
      },
    ],
    order: 4,
  });
};
