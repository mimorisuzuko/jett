import { atom } from 'recoil';
import { List } from 'immutable';
import { ViewBlockModel } from './models';
import { BLOCK } from './constants';

export const blocksState = atom({
    key: 'blocksState',
    default: List([
        new ViewBlockModel({
            x: innerWidth / 2 - BLOCK.SIZE.MIN_WIDTH / 2,
            y: innerHeight / 2
        })
    ])
});
