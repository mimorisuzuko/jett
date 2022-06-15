import { css } from '@emotion/css';
import BlockContainer from './BlockContainer';
import { blocksState } from '../atoms';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../styles';

const ViewBlock = (props) => {
    const blocks = useRecoilValue(blocksState);
    const { block } = props;

    const value = () => {
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
                    background-color: ${COLORS.L_BLACK};
                    padding: 2px;
                    display: inline-block;
                `}
            >
                Result
            </div>
            <div
                className={css`
                    padding: 4px;
                `}
            >
                {value()}
            </div>
        </BlockContainer>
    );
};

export default ViewBlock;
