import { PIN } from './constants';

export const calculatePinDeltaPosition = (block, index, pin) => {
    return [
        pin.get('type') === PIN.TYPE.INPUT
            ? -PIN.SIZE.WIDTH - 1
            : block.get('width') + 1,
        (PIN.SIZE.WIDTH + 1) * index
    ];
};
