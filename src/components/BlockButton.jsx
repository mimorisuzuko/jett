import { css, cx } from '@emotion/css';
import { COLORS } from '../styles';

const BlockButton = ({ children, onClick, className }) => {
    return (
        <div
            className={cx(
                css`
                    width: 18.5px;
                    text-align: center;
                    cursor: pointer;
                    background-color: ${COLORS.L_BLACK};
                    display: inline-block;
                `,
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default BlockButton;
