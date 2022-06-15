import { css } from '@emotion/css';
import BlockContainer from './BlockContainer';
import { blocksState, autoReloadState } from '../atoms';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleExclamation,
    faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../styles';
import { useState } from 'react';

const ViewBlock = (props) => {
    const [viewResult, setViewResult] = useState('null');
    const autoReload = useRecoilValue(autoReloadState);
    const blocks = useRecoilValue(blocksState);
    const { block } = props;

    const calculate = () => {
        const connected = block.getIn([
            'inputPins',
            0,
            'connectWithBlockAndPinIndexes'
        ]);

        if (connected) {
            try {
                const result = eval(
                    `${blocks.get(connected.get(0)).value(blocks)}`
                );

                if (result === undefined) {
                    return 'undefined';
                }

                return JSON.stringify(result);
            } catch (err) {
                return (
                    <>
                        <FontAwesomeIcon
                            icon={faCircleExclamation}
                            color={COLORS.BASE_RED}
                            className={css`
                                margin-right: 2px;
                            `}
                        />
                        {err.message}
                    </>
                );
            }
        }

        return 'null';
    };

    return (
        <BlockContainer {...props}>
            <div
                className={css`
                    > * {
                        background-color: ${COLORS.L_BLACK};
                        display: inline-block;
                        margin-right: 1px;
                        padding: 0 2px;
                    }
                `}
            >
                <div>Result</div>
                {autoReload ? null : (
                    <div
                        className={css`
                            text-align: center;
                        `}
                        onClick={() => {
                            setViewResult(calculate());
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faRefresh}
                            className={css`
                                width: 18px;
                            `}
                        />
                    </div>
                )}
            </div>
            <div
                className={css`
                    padding: 4px;
                `}
            >
                {autoReload ? calculate() : viewResult}
            </div>
        </BlockContainer>
    );
};

export default ViewBlock;
