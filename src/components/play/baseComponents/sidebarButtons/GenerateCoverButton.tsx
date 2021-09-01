import React from 'react';
import axios from 'axios';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface GenerateCoverButtonProps {
    brickId: number;
    sidebarRolledUp: boolean;
}

const GenerateCoverButton: React.FC<GenerateCoverButtonProps> = props => {
    const [hovered, setHover] = React.useState(false);

    const [numberOfScans, setNumberOfScans] = React.useState(0);
    React.useEffect(() => {
        (async () => {
            const { data: { count } } = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/scans/${props.brickId}`, { withCredentials: true });
            setNumberOfScans(count);
        })();
    }, [props.brickId]);

    const generateCover = React.useCallback(async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/brick/${props.brickId}/pdf/cover`, { withCredentials: true, responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `cover-${props.brickId}.pdf`);
        document.body.appendChild(link);
        link.click();
    }, [props.brickId]);

    if (props.sidebarRolledUp) {
        return (
            <div className="generate-cover-small">
                <button onClick={generateCover} className="assign-class-button svgOnHover blue" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <SpriteIcon name="heroicons-qrcode" className="active" />
                </button>
                {hovered && <div className="custom-tooltip">
                    <div>Create QR Cover</div>
                </div>}
            </div>
        );
    }

    return (
        <>
            <div style={{ marginTop: "1vw" }}>You have had {numberOfScans} scans.</div>
            <button onClick={generateCover} className="assign-class-button svgOnHover blue">
                <span>Create QR Cover</span>
            </button>
        </>
    );
};

export default GenerateCoverButton;