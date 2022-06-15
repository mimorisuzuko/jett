import { css } from '@emotion/css';
import libpath from 'path';
import { BLOCK } from '../constants';
import BlockButton from './BlockButton';
import BlockContainer from './BlockContainer';
import { COLORS } from '../styles';

const FileBlock = (props) => {
    const { block, updateBlock, deleteBlock } = props;

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
                <select
                    value={block.get('type')}
                    className={css`
                        background-color: ${COLORS.L_BLACK};
                        font: inherit;
                        border: none;
                        color: inherit;
                        outline: none;
                        display: inline-block;
                    `}
                    onChange={({ currentTarget: { value } }) => {
                        updateBlock((a) => a.set('type', value));
                    }}
                >
                    {Object.keys(BLOCK.FILE_TYPE).map((k) => (
                        <option key={k} value={BLOCK.FILE_TYPE[k]}>
                            {BLOCK.FILE_TYPE[k]}
                        </option>
                    ))}
                </select>
            </div>
            <div
                className={css`
                    padding: 4px;
                `}
            >
                {libpath.basename(block.get('path'))}
            </div>
        </BlockContainer>
    );
};

export default FileBlock;
