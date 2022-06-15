import { css } from '@emotion/css';
import { hot } from 'react-hot-loader/root';
import { RecoilRoot } from 'recoil';
import { COLORS } from '../styles';
import World from './World';

const App = () => {
    return (
        <RecoilRoot>
            <div
                className={css`
                    width: 100%;
                    height: 100%;
                `}
            >
                <div
                    className={css`
                        width: 100%;
                        height: env(titlebar-area-height);
                        background-color: ${COLORS.BASE_BLACK};
                        border-bottom: 1px solid ${COLORS.L_BLACK};
                        box-sizing: border-box;
                        color: ${COLORS.BASE_WHITE};
                        -webkit-app-region: drag;
                    `}
                />
                <div
                    className={css`
                        width: 100%;
                        height: calc(100% - env(titlebar-area-height));
                    `}
                >
                    <World />
                </div>
            </div>
        </RecoilRoot>
    );
};

export default hot(App);
