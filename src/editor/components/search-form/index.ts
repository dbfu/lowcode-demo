import {Context} from '../../interface';
import Dev from './dev';
import Prod from './prod';

export default (ctx: Context) => {
  ctx.registerComponent('SearchForm', {
    name: 'SearchForm',
    desc: '搜索区',
    defaultProps: {},
    dev: Dev,
    prod: Prod,
    events: [
      {
        name: 'onSearch',
        desc: '搜索',
      },
    ],
    order: 8,
  });
};
