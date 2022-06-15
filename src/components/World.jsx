import { useMemo, useState, useRef } from 'react';
import { css } from '@emotion/css';
import { useRecoilState } from 'recoil';
import { blocksState } from '../atoms';
import { FileBlockModel, FunctionBlockModel, ViewBlockModel } from '../models';
import FileBlock from './FileBlock';
import ViewBlock from './ViewBlock';
import { calculatePinDeltaPosition } from '../utils';
import { BLOCK, PIN } from '../constants';
import { List } from 'immutable';
import FunctionBlock from './FunctionBlock';
import BlockCreator from './BlockCreator';
import { COLORS } from '../styles';
import { dialog } from '@electron/remote';

const World = () => {
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
    const [selectedBlockAndPinIndexes, setSelectedBlockAndPinIndexes] =
        useState(null);
    const [mouseDownXY, setMouseDownXY] = useState(null);
    const [mosueXY, setMouseXY] = useState(null);
    const divRef = useRef(null);
    const [blocks, setBlocks] = useRecoilState(blocksState);

    const background = useMemo(() => {
        const size = 31;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = size;
        canvas.height = size;
        context.fillStyle = COLORS.BASE_BLACK;
        context.fillRect(0, 0, size, size);
        context.fillStyle = COLORS.SL_BLACK;
        context.fillRect(Math.floor(size / 2), 0, 1, size);
        context.fillRect(0, Math.floor(size / 2), size, 1);

        return canvas.toDataURL('image/png');
    });

    const getMousePosition = (e) => {
        const { clientX, clientY } = e;
        const { left, top } = divRef.current.getBoundingClientRect();

        return [clientX - left, clientY - top];
    };

    const deleteBlock = (index) => {
        return () => {
            setBlocks(blocks.delete(index));
        };
    };

    const selectBlock = (index) => {
        return (e) => {
            e.stopPropagation();
            setSelectedBlockIndex(index);
        };
    };

    const selectBlockAndPin = (blockIndex0) => {
        return (e, pinIndex0, pin0) => {
            e.stopPropagation();

            const connected = pin0.get('connectWithBlockAndPinIndexes');

            if (connected) {
                const blockIndex1 = connected.get(0);
                const pinIndex1 = connected.get(1);
                const isPin0Input = pin0.get('type') === PIN.TYPE.INPUT;

                setBlocks(
                    blocks
                        .updateIn(
                            [
                                blockIndex0,
                                isPin0Input ? 'inputPins' : 'outputPins',
                                pinIndex0
                            ],
                            (pin) =>
                                pin.merge({
                                    connectWithBlockAndPinIndexes: null
                                })
                        )
                        .updateIn(
                            [
                                blockIndex1,
                                isPin0Input ? 'outputPins' : 'inputPins',
                                pinIndex1
                            ],
                            (pin) =>
                                pin.merge({
                                    connectWithBlockAndPinIndexes: null
                                })
                        )
                );
            }

            setSelectedBlockAndPinIndexes([blockIndex0, pinIndex0, pin0]);
        };
    };

    const connectPins = (blockIndex0) => {
        return (pinIndex0, pin0) => {
            if (!selectedBlockAndPinIndexes) {
                return;
            }

            const [blockIndex1, pinIndex1, pin1] = selectedBlockAndPinIndexes;

            if (
                blockIndex0 !== blockIndex1 &&
                ((pin0.get('type') === PIN.TYPE.INPUT &&
                    pin1.get('type') === PIN.TYPE.OUTPUT) ||
                    (pin0.get('type') === PIN.TYPE.OUTPUT &&
                        pin1.get('type') === PIN.TYPE.INPUT))
            ) {
                const isPin1Input = pin1.get('type') === PIN.TYPE.INPUT;

                setBlocks(
                    blocks
                        .updateIn(
                            [
                                blockIndex1,
                                isPin1Input ? 'inputPins' : 'outputPins',
                                pinIndex1
                            ],
                            (pin) =>
                                pin.merge({
                                    connectWithBlockAndPinIndexes: List([
                                        blockIndex0,
                                        pinIndex0
                                    ])
                                })
                        )
                        .updateIn(
                            [
                                blockIndex0,
                                isPin1Input ? 'outputPins' : 'inputPins',
                                pinIndex0
                            ],
                            (pin) =>
                                pin.merge({
                                    connectWithBlockAndPinIndexes: List([
                                        blockIndex1,
                                        pinIndex1
                                    ])
                                })
                        )
                );
            }
        };
    };

    const createBlock = (BlockModel) => {
        if (BlockModel === FileBlockModel) {
            const path = dialog.showOpenDialogSync({
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Text',
                        extensions: ['txt', 'json']
                    }
                ]
            });

            if (path) {
                setBlocks(
                    blocks.push(
                        new BlockModel({
                            x: mosueXY[0] - BLOCK.SIZE.MIN_WIDTH / 2,
                            y: mosueXY[1],
                            path: path[0]
                        })
                    )
                );
            }
        } else {
            setBlocks(
                blocks.push(
                    new BlockModel({
                        x:
                            mosueXY[0] -
                            (BlockModel === FunctionBlockModel
                                ? BLOCK.SIZE.MIN_FUNCTION_WIDTH
                                : BLOCK.SIZE.MIN_WIDTH) /
                                2,
                        y: mosueXY[1]
                    })
                )
            );
        }
    };

    const TemporaryLineBetweenPins = () => {
        if (selectedBlockAndPinIndexes) {
            const [blockIndex, pinIndex, pin] = selectedBlockAndPinIndexes;
            const block = blocks.get(blockIndex);
            const [dx, dy] = calculatePinDeltaPosition(block, pinIndex, pin);

            return (
                <line
                    x1={block.get('x') + dx + Math.floor(PIN.SIZE.WIDTH / 2)}
                    y1={block.get('y') + dy + Math.floor(PIN.SIZE.WIDTH / 2)}
                    x2={mosueXY[0]}
                    y2={mosueXY[1]}
                    stroke='lightblue'
                />
            );
        }

        return null;
    };

    const renderBlocks = [];
    const renderLines = [];

    blocks.forEach((block0, i) => {
        if (block0.constructor === FileBlockModel) {
            renderBlocks.push(
                <FileBlock
                    block={block0}
                    key={`block-${i}`}
                    updateBlock={(updater) => {
                        setBlocks(blocks.update(i, updater));
                    }}
                    deleteBlock={deleteBlock(i)}
                    onMouseDownBlock={selectBlock(i)}
                    onMouseDownPin={selectBlockAndPin(i)}
                    onMouseUpPin={connectPins(i)}
                />
            );
        } else if (block0.constructor === ViewBlockModel) {
            renderBlocks.push(
                <ViewBlock
                    block={block0}
                    key={`block-${i}`}
                    onMouseDownBlock={selectBlock(i)}
                    onMouseDownPin={selectBlockAndPin(i)}
                    onMouseUpPin={connectPins(i)}
                />
            );
        } else if (block0.constructor === FunctionBlockModel) {
            renderBlocks.push(
                <FunctionBlock
                    block={block0}
                    key={`block-${i}`}
                    updateBlock={(updater) => {
                        setBlocks(blocks.update(i, updater));
                    }}
                    deleteBlock={deleteBlock(i)}
                    onMouseDownBlock={selectBlock(i)}
                    onMouseDownPin={selectBlockAndPin(i)}
                    onMouseUpPin={connectPins(i)}
                />
            );
        }

        block0.get('inputPins').forEach((pin0, pinIndex0) => {
            const connectWithBlockAndPinIndexes = pin0.get(
                'connectWithBlockAndPinIndexes'
            );

            if (connectWithBlockAndPinIndexes) {
                const [dx0, dy0] = calculatePinDeltaPosition(
                    block0,
                    pinIndex0,
                    pin0
                );
                const block1 = blocks.get(connectWithBlockAndPinIndexes.get(0));
                const pinIndex1 = connectWithBlockAndPinIndexes.get(1);
                const pin1 = block1.getIn(['outputPins', pinIndex1]);
                const [dx1, dy1] = calculatePinDeltaPosition(
                    block1,
                    pinIndex1,
                    pin1
                );

                renderLines.push(
                    <line
                        key={`line-${i}-${pinIndex0}`}
                        x1={
                            block0.get('x') +
                            dx0 +
                            Math.floor(PIN.SIZE.WIDTH / 2)
                        }
                        y1={
                            block0.get('y') +
                            dy0 +
                            Math.floor(PIN.SIZE.WIDTH / 2)
                        }
                        x2={
                            block1.get('x') +
                            dx1 +
                            Math.floor(PIN.SIZE.WIDTH / 2)
                        }
                        y2={
                            block1.get('y') +
                            dy1 +
                            Math.floor(PIN.SIZE.WIDTH / 2)
                        }
                        stroke='lightblue'
                    />
                );
            }
        });
    });

    return (
        <div
            ref={divRef}
            className={css`
                width: 100%;
                height: 100%;
                background-image: url(${background});
                position: relative;
                user-select: none;
            `}
            onMouseDown={(e) => {
                setMouseDownXY(getMousePosition(e));
            }}
            onMouseMove={(e) => {
                const xy = getMousePosition(e);

                if (selectedBlockIndex !== null) {
                    setBlocks(
                        blocks.update(selectedBlockIndex, (b) =>
                            b.merge({
                                x: b.get('x') + xy[0] - mosueXY[0],
                                y: b.get('y') + xy[1] - mosueXY[1]
                            })
                        )
                    );
                }

                setMouseXY(xy);
            }}
            onMouseUp={() => {
                setMouseDownXY(null);
                setSelectedBlockIndex(null);
                setSelectedBlockAndPinIndexes(null);
            }}
        >
            <svg
                className={css`
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    width: 100%;
                    height: 100%;
                `}
            >
                <TemporaryLineBetweenPins />
                {renderLines}
            </svg>
            {renderBlocks}
            {mouseDownXY ? (
                <BlockCreator
                    mouseDownXY={mouseDownXY}
                    mosueXY={mosueXY}
                    createBlock={createBlock}
                />
            ) : null}
        </div>
    );
};

export default World;
