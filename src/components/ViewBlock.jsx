import { css } from '@emotion/css';
import BlockContainer from './BlockContainer';
import { blocksState, autoReloadState } from '../atoms';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleExclamation,
    faCheckCircle,
    faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../styles';
import { useState } from 'react';

const Calculateed = ({ result: { error, value } }) => {
    return (
        <div
            className={css`
                display: flex;
                padding: 4px;
            `}
        >
            <div
                className={css`
                    margin-top: 4px;
                    margin-right: 2px;
                `}
            >
                {error ? (
                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        color={COLORS.BASE_RED}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        color={COLORS.BASE_GREEN}
                    />
                )}
            </div>
            <textarea
                readOnly
                className={css`
                    display: block;
                    font: inherit;
                    border: 1px solid ${COLORS.L_BLACK};
                    background: none;
                    color: inherit;
                    outline: none;
                `}
                value={value}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
            />
        </div>
    );
};

const ViewBlock = (props) => {
    const [manualResult, setManualResult] = useState({
        error: false,
        value: 'null'
    });
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
                    return { error: false, value: 'undefined' };
                }

                return { error: false, value: JSON.stringify(result) };
            } catch (err) {
                return { error: true, value: err.message };
            }
        }

        return { error: false, value: 'null' };
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
                            setManualResult(calculate());
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
            <Calculateed result={autoReload ? calculate() : manualResult} />
        </BlockContainer>
    );
};

export default ViewBlock;
