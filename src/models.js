import { List, Record } from 'immutable';
import { BLOCK, PIN } from './constants';
import fs from 'fs';

export class PinModel extends Record({
    connectWithBlockAndPinIndexes: null,
    type: PIN.TYPE.INPUT
}) {}

export class FileBlockModel extends Record({
    type: BLOCK.TYPE.FILE,
    x: 0,
    y: 0,
    width: BLOCK.SIZE.MIN_WIDTH,
    path: '',
    fileType: BLOCK.FILE_TYPE.TXT,
    inputPins: List([]),
    outputPins: List([new PinModel({ type: PIN.TYPE.OUTPUT })])
}) {
    static fromJS = (a) => {
        return new FileBlockModel({
            x: a.x,
            y: a.y,
            width: a.width,
            outputPins: List(
                a.outputPins.map(
                    (b) =>
                        new PinModel({
                            type: PIN.TYPE.OUTPUT,
                            connectWithBlockAndPinIndexes:
                                b.connectWithBlockAndPinIndexes
                                    ? List(b.connectWithBlockAndPinIndexes)
                                    : null
                        })
                )
            )
        });
    };

    value() {
        const file = fs.readFileSync(this.path, { encoding: 'utf-8' });

        if (this.fileType === BLOCK.FILE_TYPE.JSON) {
            return `\`${JSON.parse(file).replace(/`/g, '\\`')}\``;
        }

        return `\`${file.replace(/`/g, '\\`')}\``;
    }
}

export class ViewBlockModel extends Record({
    type: BLOCK.TYPE.VIEW,
    x: 0,
    y: 0,
    width: BLOCK.SIZE.MIN_WIDTH,
    inputPins: List([new PinModel()]),
    outputPins: List([])
}) {
    static fromJS = (a) => {
        return new ViewBlockModel({
            x: a.x,
            y: a.y,
            width: a.width,
            inputPins: List(
                a.inputPins.map(
                    (b) =>
                        new PinModel({
                            connectWithBlockAndPinIndexes:
                                b.connectWithBlockAndPinIndexes
                                    ? List(b.connectWithBlockAndPinIndexes)
                                    : null
                        })
                )
            )
        });
    };
}

export class FunctionBlockModel extends Record({
    type: BLOCK.TYPE.FUNCTION,
    x: 0,
    y: 0,
    width: BLOCK.SIZE.MIN_FUNCTION_WIDTH,
    inputPins: List([new PinModel()]),
    outputPins: List([new PinModel({ type: PIN.TYPE.OUTPUT })]),
    code: '',
    argumentNames: List(['_arg0'])
}) {
    static fromJS = (a) => {
        return new FunctionBlockModel({
            x: a.x,
            y: a.y,
            width: a.width,
            inputPins: List(
                a.inputPins.map(
                    (b) =>
                        new PinModel({
                            connectWithBlockAndPinIndexes:
                                b.connectWithBlockAndPinIndexes
                                    ? List(b.connectWithBlockAndPinIndexes)
                                    : null
                        })
                )
            ),
            outputPins: List(
                a.outputPins.map(
                    (b) =>
                        new PinModel({
                            type: PIN.TYPE.OUTPUT,
                            connectWithBlockAndPinIndexes:
                                b.connectWithBlockAndPinIndexes
                                    ? List(b.connectWithBlockAndPinIndexes)
                                    : null
                        })
                )
            ),
            code: a.code,
            argumentNames: List(a.argumentNames)
        });
    };

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
