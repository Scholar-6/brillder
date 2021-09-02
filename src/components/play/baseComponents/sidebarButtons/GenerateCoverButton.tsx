import React from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';

import { Brick } from 'model/brick';
import { stripHtml } from 'components/build/questionService/ConvertService';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Grid } from '@material-ui/core';


interface GenerateCoverButtonProps {
    brick: Brick;

    // ways to display
    sidebarRolledUp?: boolean;
    isSvg?: boolean;
    isMenuItem?: boolean;
    isFinal?: boolean;
}

const GenerateCoverButton: React.FC<GenerateCoverButtonProps> = props => {
    const [hovered, setHover] = React.useState(false);

    const [numberOfScans, setNumberOfScans] = React.useState(0);
    React.useEffect(() => {
        (async () => {
            const { data: { count } } = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/scans/${props.brick.id}`, { withCredentials: true });
            setNumberOfScans(count);
        })();
    }, [props.brick]);

    const generateCover = React.useCallback(async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/brick/${props.brick.id}/pdf/cover`, { withCredentials: true, responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${stripHtml(props.brick.title)}.pdf`);
        document.body.appendChild(link);
        link.click();
    }, [props.brick]);

    if (props.isSvg) {
        return <SpriteIcon name="heroicons-qrcode" onClick={generateCover} />;
    }

    if (props.isMenuItem) {
        return (
            <MenuItem onClick={generateCover}>
                Create QR Cover
            </MenuItem>
        )
    }

    if (props.isFinal) {
        return (
            <Grid className="share-column final-assign-brick-column" onClick={generateCover} container item xs={6} justify="center">
            <div>
              <div className="button-container">
                <SpriteIcon name="heroicons-qrcode" className="active" />
              </div>
              <div className="link-text">Create QR Cover</div>
            </div>
          </Grid>
        )
    }

    if (props.sidebarRolledUp) {
        return (
            <div>
                <div className="generate-cover-small">
                    <button onClick={generateCover} className="assign-class-button svgOnHover blue" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                        <SpriteIcon name="heroicons-qrcode" className="active" />
                    </button>
                    {hovered && <div className="custom-tooltip">
                        <div>Create QR Cover</div>
                    </div>}
                </div>
                <div className="generate-cover-label text-center italic">{numberOfScans}</div>
                <div className="generate-cover-label text-center italic">{numberOfScans === 1 ? 'Scan' : 'Scans'}</div>
            </div>
        );
    }

    return (
        <>
            <button onClick={generateCover} className="assign-class-button svgOnHover blue">
                <span>Create QR Cover</span>
            </button>
            <div className="generate-cover-label italic">{numberOfScans} {numberOfScans === 1 ? 'Scan' : 'Scans'}</div>
        </>
    );
};

export default GenerateCoverButton;