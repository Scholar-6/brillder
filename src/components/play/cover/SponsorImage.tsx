import React, { useEffect } from 'react'

import 'components/build/buildQuestions/components/Image/Image.scss';
import { fileUrl, uploadFile } from 'components/services/uploadFile';
import ImageCloseDialog from 'components/build/buildQuestions/components/Image//ImageCloseDialog';
import { checkAdmin } from 'components/services/brickService';
import { User } from 'model/user';
import ImageSponsorDialog from './ImageSponsorDialog';
import { updateBrick } from 'services/axios/brick';
import { Brick } from 'model/brick';

interface ImageProps {
  user: User;
  brick: Brick;
}

const SponsorImageComponent: React.FC<ImageProps> = ({ ...props }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null as File | null);
  const [fileName, setFileName] = React.useState(props.brick.sponsorLogo);
  const [isCloseOpen, setCloseDialog] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);

  useEffect(() => {
    setFileName(props.brick.sponsorLogo);
    if (props.brick.sponsorLogo) {
      setInvalid(false);
    }
  }, [props.brick]);

  const upload = (file: File) => {
    uploadFile(file, async (res: any) => {
      const {fileName} = res.data;
      setFileName(fileName);
      await updateBrick({...props.brick, sponsorLogo: fileName});
      setOpen(false);
    }, () => { });
  }

  let className = 'dropzone';

  if (invalid) {
    className += ' invalid';
  }

  let isAdmin = false;
  if (props.user) {
    isAdmin = checkAdmin(props.user.roles);
  }

  if (!isAdmin) {
    return (
      <div className="cover-sponsors">
        <span className="italic">Commissioned by</span>
        <img alt="scholar6" src={fileName ? fileUrl(fileName) : "/images/Scholar-6-Logo.svg"} />
      </div>
    );
  }


  return (
    <div className="cover-sponsors">
      Commissioned by
      <div className={className} onClick={() => {
        if (fileName) {
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
            ? <img alt="" style={{ width: '100%' }} src={fileUrl(fileName)} />
            : <img alt="" src="/images/Scholar-6-Logo.svg" />
        }
      </div>
      <ImageSponsorDialog
        initValue={fileName}
        open={isOpen}
        setDialog={() => setCloseDialog(true)}
        initFile={file}
        upload={upload}
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


export default SponsorImageComponent;
