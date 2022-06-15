import { atom } from 'recoil';
import { List } from 'immutable';
import { ViewBlockModel, FileBlockModel, FunctionBlockModel } from './models';
import { BLOCK } from './constants';

const storagedBlocks = JSON.parse(localStorage.getItem('storagedBlocks'));
const autoReload = JSON.parse(localStorage.getItem('autoReload'));

export const blocksState = atom({
    key: 'blocksState',
    default:
        storagedBlocks === null
            ? List([
                  new ViewBlockModel({
                      x: innerWidth / 2 - BLOCK.SIZE.MIN_WIDTH / 2,
                      y: innerHeight / 2
                  })
              ])
            : List(
                  storagedBlocks.map((a) => {
                      if (a.type === BLOCK.TYPE.VIEW) {
                          return ViewBlockModel.fromJS(a);
                      } else if (a.type === BLOCK.TYPE.FILE) {
                          return FileBlockModel.fromJS(a);
                      } else if (a.type === BLOCK.TYPE.FUNCTION) {
                          return FunctionBlockModel.fromJS(a);
                      }
                  })
              )
});

export const autoReloadState = atom({
    key: 'autoReloadState',
    default: autoReload === null ? true : autoReload
});
