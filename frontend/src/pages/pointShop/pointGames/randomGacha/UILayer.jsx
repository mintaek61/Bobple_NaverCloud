import React, {forwardRef} from 'react';
import Prize from './Prize';
import '../../../../assets/style/pointGame/gacha/UILayer.scss';

const UILayer = forwardRef((props, ref) => {
    return (
        <div className="ui-layer" ref={ref}>
            <div className="title-container">
                <div className="title">
                </div>
            </div>
            <Prize />
        </div>
    );
});

export default UILayer;
