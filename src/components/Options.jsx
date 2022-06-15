import { css, cx } from '@emotion/css';
import { COLORS, boxShadow, FONT_SIZE } from '../styles';
import { useRecoilState } from 'recoil';
import { autoReloadState } from '../atoms';

const CheckBox = ({ checked = false, onClick }) => {
    return (
        <svg
            className={css`
                display: inline-block;
                width: ${FONT_SIZE}px;
                height: ${FONT_SIZE}px;
                margin-right: 4px;
                box-sizing: border-box;
                vertical-align: text-top;
                cursor: pointer;
            `}
            onClick={onClick}
        >
            <rect
                x={0}
                y={0}
                width={FONT_SIZE}
                height={FONT_SIZE}
                stroke={COLORS.LL_BLACK}
                fill='none'
            />
            {checked ? (
                <>
                    <line
                        x1={0}
                        y1={0}
                        x2={FONT_SIZE}
                        y2={FONT_SIZE}
                        stroke={COLORS.LL_BLACK}
                    />
                    <line
                        x1={FONT_SIZE}
                        y1={0}
                        x2={0}
                        y2={FONT_SIZE}
                        stroke={COLORS.LL_BLACK}
                    />
                </>
            ) : null}
        </svg>
    );
};

const Options = () => {
    const [autoReload, setAutoReload] = useRecoilState(autoReloadState);

    return (
        <div
            className={cx(
                css`
                    position: absolute;
                    right: 30px;
                    bottom: 0px;
                    background-color: ${COLORS.BASE_BLACK};
                    color: white;
                    border: 1px solid ${COLORS.L_BLACK};
                    padding: 4px;
                    input {
                        font: inherit;
                    }
                `,
                boxShadow
            )}
        >
            <div>Options</div>
            <div
                className={css`
                    border-bottom: 1px solid ${COLORS.L_BLACK};
                    margin-top: 4px;
                    margin-bottom: 4px;
                `}
            />
            <div>
                <CheckBox
                    checked={autoReload}
                    onClick={() => {
                        const next = !autoReload;

                        localStorage.setItem(
                            'autoReload',
                            JSON.stringify(next)
                        );
                        setAutoReload(next);
                    }}
                />
                Auto Reload
            </div>
            <div>
                <CheckBox
                    checked={false}
                    onClick={() => {
                        localStorage.clear();
                        location.reload();
                    }}
                />
                Clear
            </div>
        </div>
    );
};

export default Options;
