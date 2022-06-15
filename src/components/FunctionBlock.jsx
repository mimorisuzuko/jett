import { css } from '@emotion/css';
import BlockContainer from './BlockContainer';
import BlockButton from './BlockButton';
import { Fragment, useMemo } from 'react';
import { COLORS, FONT_SIZE } from '../styles';

const ArgumentBox = ({ onChange, value }) => {
    const width = useMemo(() => {
        let ret = 0;

        const $s = document.createElement('span');
        $s.style.fontFamily = 'monospace';
        $s.style.fontSize = FONT_SIZE;
        $s.style.display = 'inline-block';
        $s.style.padding = '0 4px;';
        $s.innerText = value;
        document.body.appendChild($s);
        ret = $s.getBoundingClientRect().width;
        document.body.removeChild($s);

        return ret;
    }, [value]);

    return (
        <input
            className={css`
                font: inherit;
                border: none;
                background-color: ${COLORS.L_BLACK};
                color: inherit;
                border-radius: 4px;
                outline: none;
                width: ${width}px;
                padding: 0 4px;
                display: inline-block;
            `}
            type='text'
            spellCheck={false}
            value={value}
            onChange={onChange}
        />
    );
};

const FunctionBlock = (props) => {
    const { block, updateBlock, deleteBlock } = props;
    const argumentNames = block.get('argumentNames');

    return (
        <BlockContainer {...props}>
            <div
                className={css`
                    * {
                        margin-right: 1px;
                    }
                `}
            >
                <BlockButton
                    className={css`
                        background-color: ${COLORS.BASE_RED};
                    `}
                    onClick={() => {
                        deleteBlock();
                    }}
                >
                    ×
                </BlockButton>
                <BlockButton
                    onClick={() => {
                        updateBlock((block) => block.addArgument());
                    }}
                >
                    +
                </BlockButton>
                <BlockButton
                    onClick={() => {
                        updateBlock((block) => block.deleteArgument());
                    }}
                >
                    -
                </BlockButton>
            </div>
            <div
                className={css`
                    padding: 4px;
                    font-family: monospace;
                `}
            >
                <div
                    className={css`
                        display: flex;
                    `}
                >
                    {`function (`}
                    {argumentNames.map((a, i) => (
                        <Fragment key={`argument-${i}`}>
                            <ArgumentBox
                                value={a}
                                onChange={({ currentTarget: { value } }) => {
                                    updateBlock((block) =>
                                        block.setIn(['argumentNames', i], value)
                                    );
                                }}
                            />
                            {i < argumentNames.size - 1 ? ', ' : null}
                        </Fragment>
                    ))}
                    {') {'}
                </div>
                <textarea
                    className={css`
                        width: calc(100% - ${FONT_SIZE}px);
                        box-sizing: border-box;
                        border: 1px solid ${COLORS.L_BLACK};
                        background-color: none;
                        color: inherit;
                        outline: none;
                        display: block;
                        margin: 2px 0 2px ${FONT_SIZE}px;
                    `}
                    value={block.get('code')}
                    onChange={({ currentTarget: { value } }) => {
                        updateBlock((a) => a.set('code', value));
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                />
                <div>{`}`}</div>
            </div>
        </BlockContainer>
    );
};

export default FunctionBlock;
