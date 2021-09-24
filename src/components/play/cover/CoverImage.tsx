import React, { useEffect } from 'react'

import 'components/build/buildQuestions/components/Image/Image.scss';
import { fileUrl, uploadFile } from 'components/services/uploadFile';
import ImageCloseDialog from 'components/build/buildQuestions/components/Image//ImageCloseDialog';
import ImageCoverDialog from './ImageCoverDialog';
import { ImageCoverData } from './model';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { setBrickCover } from 'services/axios/brick';
import actions from 'redux/actions/play';
import { connect } from 'react-redux';

interface ImageProps {
  locked: boolean;
  brickId: number;
  data: ImageCoverData;

  hover(fileName: string, imageSource: string): void;
  blur(): void;
}

const CoverImageComponent: React.FC<ImageProps> = ({ locked, ...props }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [hoverTimeout, setHoverTimeout] = React.useState(-1);
  const [file, setFile] = React.useState(null as File | null);
  const [fileName, setFileName] = React.useState(props.data.value);
  const [isCloseOpen, setCloseDialog] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);

  const updateCover = async (coverData: ImageCoverData) => {
    const res = await setBrickCover({
      brickId: props.brickId,
      coverImage: coverData.value,
      coverImageSource: coverData.imageSource
    });
    if (res) {
      // success
    } else {
      // fail
    }
  }

  useEffect(() => {
    return function cleanup() {
      props.hover('', '');
      props.blur();
      clearTimeout(hoverTimeout);
    }
  /*eslint-disable-next-line*/
  }, [hoverTimeout])

  useEffect(() => {
    if (!fileName) {
      setFileName(props.data.value);
    }
    if (props.data.value) {
      setInvalid(false);
    }
  /*eslint-disable-next-line*/
  }, [props]);

  const upload = (file: File, source: string) => {
    uploadFile(file, (res: any) => {
      let comp = Object.assign({}, props.data);
      comp.value = res.data.fileName;
      comp.imageSource = source;
      comp.imagePermision = true;
      updateCover(comp);
      setOpen(false);
      setFileName(comp.value);
    }, () => { });
  }

  const updateData = (source: string) => {
    let comp = Object.assign({}, props.data);
    comp.imageSource = source;
    comp.imagePermision = true;
    updateCover(comp);
    setOpen(false);
  }

  let className = 'dropzone';
  if (locked) {
    className += ' disabled';
  }

  if (invalid) {
    className += ' invalid';
  }

  return (
    <div className="image-drag-n-drop">
      <div className={className} onClick={() => {
        if (locked) { return; }
        if (props.data.value) {
          setOpen(true);
        } else {
          let el = document.createElement("input");
          el.setAttribute("type", "file");
          el.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
          el.click();

          el.onchange = () => {
            if (el.files && el.files.length >= 0) {
              setFile(el.files[0]);
              setOpen(true);
            }
          };
        }
      }}>
        {
          fileName
            ? <img alt="" style={{ width: '100%' }}
              onMouseEnter={() => {
                if (hoverTimeout >= 0) {
                  clearTimeout(hoverTimeout);
                }
                const timeout = setTimeout(() => {
                  props.hover(fileName, props.data.imageSource);
                }, 5000);
                setHoverTimeout(timeout);
              }}
              onMouseLeave={() => props.blur()}
              src={fileUrl(fileName)}
            />
            : (
              <div>
                <SpriteIcon name="image" />
                <div className="cover-image-placeholder">Click to add a cover image.</div>
              </div>
            )
        }
      </div>
      <ImageCoverDialog
        initData={props.data}
        open={isOpen}
        setDialog={() => setCloseDialog(true)}
        initFile={file}
        upload={upload}
        updateData={updateData}
      />
      <ImageCloseDialog
        open={isCloseOpen}
        submit={() => {
          setCloseDialog(false);
          setOpen(false);
        }}
        close={() => setCloseDialog(false)}
      />
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  hover: (fileName: string, imageSource: string) => dispatch(actions.setImageHover(fileName, imageSource)),
  blur: () => dispatch(actions.setImageBlur()),
});

export default connect(null, mapDispatch)(CoverImageComponent);
