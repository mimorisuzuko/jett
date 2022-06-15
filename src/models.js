import { List, Record } from 'immutable';
import { BLOCK, PIN } from './constants';
import fs from 'fs';

export class PinModel extends Record({
    connectWithBlockAndPinIndexes: null,
    type: PIN.TYPE.INPUT
}) {}

export class FileBlockModel extends Record({
    x: 0,
    y: 0,
    width: BLOCK.SIZE.MIN_WIDTH,
    path: '',
    type: BLOCK.FILE_TYPE.TXT,
    inputPins: List([]),
    outputPins: List([new PinModel({ type: PIN.TYPE.OUTPUT })])
}) {
    value() {
        const file = fs.readFileSync(this.path, { encoding: 'utf-8' });

        if (this.type === BLOCK.FILE_TYPE.JSON) {
            return `\`${JSON.parse(file).replace(/`/g, '\\`')}\``;
        }

        return `\`${file.replace(/`/g, '\\`')}\``;
    }
}

export class ViewBlockModel extends Record({
    x: 0,
    y: 0,
    width: BLOCK.SIZE.MIN_WIDTH,
    inputPins: List([new PinModel()]),
    outputPins: List([])
}) {}

export class FunctionBlockModel extends Record({
    x: 0,
    y: 0,
    width: BLOCK.SIZE.MIN_FUNCTION_WIDTH,
    inputPins: List([new PinModel()]),
    outputPins: List([new PinModel({ type: PIN.TYPE.OUTPUT })]),
    code: '',
    argumentNames: List(['_arg0'])
}) {
    value(blocks) {
        return `(function(${this.argumentNames.join(', ')}){${
            this.code
        }})(${this.inputPins
            .map((a) => {
                const connected = a.get('connectWithBlockAndPinIndexes');

                if (connected) {
                    return blocks.get(connected.get(0)).value(blocks);
                }

                return 'undefined';
            })
            .join(', ')})`;
    }

    addArgument() {
        return this.update('inputPins', (a) => a.push(new PinModel())).update(
            'argumentNames',
            (a) => a.push(`_arg${a.size}`)
        );
    }

    deleteArgument() {
        const i = this.get('inputPins').size - 1;

        return this.update('inputPins', (a) => a.delete(i)).update(
            'argumentNames',
            (a) => a.delete(i)
        );
    }
}
