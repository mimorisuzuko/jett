import { css, cx } from '@emotion/css';
import { PIN } from '../constants';
import { boxShadow, COLORS } from '../styles';
import { calculatePinDeltaPosition } from '../utils';

const Pin = ({ x, y, pin, onMouseDown, onMouseUp }) => {
    return (
        <div
            className={css`
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${PIN.SIZE.WIDTH}px;
                height: ${PIN.SIZE.WIDTH}px;
                border: 1px solid lightblue;
                box-sizing: border-box;
            `}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            {pin.get('connectWithBlockAndPinIndexes') ? (
                <div
                    className={css`
                        position: absolute;
                        left: 1px;
                        top: 1px;
                        width: ${PIN.SIZE.WIDTH - 4}px;
                        height: ${PIN.SIZE.WIDTH - 4}px;
                        background-color: lightblue;
                        box-sizing: border-box;
                    `}
                />
            ) : null}
        </div>
    );
};

const BlockContainer = ({
    children,
    block,
    onMouseDownBlock,
    onMouseDownPin,
    onMouseUpPin
}) => {
    return (
        <div
            className={css`
                position: absolute;
                font-size: 12px;
            `}
            style={{
                left: block.get('x'),
                top: block.get('y')
            }}
        >
            <div
                onMouseDown={onMouseDownBlock}
                className={cx(
                    css`
                        border: 1px solid ${COLORS.L_BLACK};
                        background-color: ${COLORS.BASE_BLACK};
                        color: ${COLORS.BASE_WHITE};
                        width: ${block.get('width')}px;
                        box-sizing: border-box;
                    `,
                    boxShadow
                )}
            >
                {children}
            </div>
            {block.get('inputPins').map((pin, i) => {
                const [x, y] = calculatePinDeltaPosition(block, i, pin);

                return (
                    <Pin
                        key={`inputpin-${i}`}
                        pin={pin}
                        x={x}
                        y={y}
                        onMouseDown={(e) => {
                            onMouseDownPin(e, i, pin);
                        }}
                        onMouseUp={() => {
                            onMouseUpPin(i, pin);
                        }}
                    />
                );
            })}
            {block.get('outputPins').map((pin, i) => {
                const [x, y] = calculatePinDeltaPosition(block, i, pin);

                return (
                    <Pin
                        key={`outputpin-${i}`}
                        pin={pin}
                        x={x}
                        y={y}
                        onMouseDown={(e) => {
                            onMouseDownPin(e, i, pin);
                        }}
                        onMouseUp={() => {
                            onMouseUpPin(i, pin);
                        }}
                    />
                );
            })}
        </div>
    );
};

export default BlockContainer;
