import { css, cx } from '@emotion/css';
import { PIN } from '../constants';
import { boxShadow, COLORS } from '../styles';
import { FunctionBlockModel, FileBlockModel } from '../models';

const boxWidth = 120;
const boxHeight = 40;

const Box = ({ x, y, children, onMouseUp }) => {
    return (
        <div
            className={cx(
                css`
                    position: absolute;
                    border: 1px solid ${COLORS.L_BLACK};
                    color: white;
                    background-color: ${COLORS.BASE_BLACK};
                    width: ${boxWidth}px;
                    height: ${boxHeight}px;
                    display: grid;
                    place-items: center;
                    box-sizing: border-box;
                    &:hover {
                        background-color: ${COLORS.SL_BLACK};
                    }
                `,
                boxShadow
            )}
            style={{
                left: x,
                top: y
            }}
            onMouseUp={onMouseUp}
        >
            {children}
        </div>
    );
};

const BlockCreator = ({ mouseDownXY, mosueXY, createBlock }) => {
    const margin = 30;

    return (
        <>
            <Box
                x={mouseDownXY[0] + margin}
                y={mouseDownXY[1] - boxHeight / 2}
                onMouseUp={() => {
                    createBlock(FunctionBlockModel);
                }}
            >
                Function Block
            </Box>
            <Box
                x={mouseDownXY[0] - boxWidth - margin}
                y={mouseDownXY[1] - boxHeight / 2}
                onMouseUp={() => {
                    createBlock(FileBlockModel);
                }}
            >
                File Block
            </Box>
            <svg
                pointerEvents='none'
                className={css`
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    display: block;
                    width: 100%;
                    height: 100%;
                `}
            >
                <circle
                    cx={mouseDownXY[0]}
                    cy={mouseDownXY[1]}
                    r={PIN.SIZE.WIDTH / 2}
                    fill={COLORS.BASE_WHITE}
                />
                <line
                    x1={mouseDownXY[0]}
                    y1={mouseDownXY[1]}
                    x2={mosueXY[0]}
                    y2={mosueXY[1]}
                    stroke={COLORS.BASE_WHITE}
                />
            </svg>
        </>
    );
};

export default BlockCreator;
