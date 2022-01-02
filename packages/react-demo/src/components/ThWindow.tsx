
import React, { Children, useState, FC, useRef, useEffect } from 'react';
import { useMouse } from 'ahooks';

import closeGif from './../../assets/images/close.gif';
import minimizeGif from './../../assets/images/minimize.gif';
import maximizeGif from './../../assets/images/maximize.gif';
import normalizeGif from './../../assets/images/normalize.gif';
import './window.less';
import { createPortal } from 'react-dom';

export function ThWindow(props) {

    const [pos, setPos] = useState({
        offsetX: 0,
        offsetY: 0,
    });
    const thwin = useRef();
    const { clientX, clientY } = useMouse();
    const [moving, setMoving] = useState(false);
    // const mxwin = ref();
    const onMouseDown = (evt: any) => {
        console.log(evt.nativeEvent)
        const { offsetX,
            offsetY } = evt.nativeEvent
        setPos({
            offsetX,
            offsetY
        });
        setMoving(true)
    };

    const onMouseup = (evt) => {
        console.log('----------', 'mous upd');
        setMoving(false);
    };

    useEffect(() => {
        if (moving && thwin.current) {
            (thwin.current as HTMLElement).style.left = clientX - pos.offsetX + 'px';
            (thwin.current as HTMLElement).style.top = clientY - pos.offsetY + 'px'
        }
    }, [clientX, clientY, moving])


    return (
        createPortal(
            <div className="mx-window" ref={thwin}>
                <div
                    className="mx-window-header"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseup}
                >
                    <div className="mx-window-header-title">
                        {props.title}
                    </div>
                    <div className="mx-window-header-actions">
                        <img src={maximizeGif} alt="" className="action" />
                        <img src={normalizeGif} alt="" className="action" />
                        <img src={minimizeGif} alt="" className="action" />
                        <img src={closeGif} alt="" className="action" />
                    </div>
                </div>
                <div className="mx-window-body">
                    {props.children}
                </div>
            </div>
        ,document.body)

    )
}

