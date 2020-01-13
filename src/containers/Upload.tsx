import '@reshuffle/code-transform/macro';
import React, {
  FC,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import ReactCrop, { Crop } from 'react-image-crop';
import { useFileUpload } from '@reshuffle/react-storage';
import 'react-image-crop/dist/ReactCrop.css';
import '../styles/Upload.scss';
import { uploadUserImage } from '../../backend/user';

/**
 * Calculate margin (m) between container (C) and centered object (O)
 *
 * CCCCCCCCCCCC
 * mmmmOOOOmmmm
 */
function calcMargin(containerLen: number, objLen: number) {
  return (containerLen - objLen) / 2;
}

/**
 * Calculate object (O) crop (X) without given margin (m) => (D)
 *
 * mmmmOOOOmmmm
 *   XXXX
 *     DD
 */
function dropMargin(
  objLen: number,
  margin: number,
  cropStart: number,
  cropSize: number,
) {
  const cropEnd = cropSize + cropStart;

  const cropStartWithoutMargin =
    Math.min(Math.max(cropStart - margin, 0), objLen);
  const cropEndWithoutMargin =
    Math.min(Math.max(cropEnd - margin, 0), objLen);
  const cropSizeWithoutMargin =
    cropEndWithoutMargin - cropStartWithoutMargin;

  return {
    start: cropStartWithoutMargin,
    size: cropSizeWithoutMargin,
  };
}

const keysDef = (obj: any, keys: string[]): boolean => {
  return keys.every((key) => obj[key] !== undefined);
}

interface Dim {
  height: number;
  width: number;
}

interface DimPos extends Dim {
  x: number;
  y: number;
}

function getCroppedImg(
  image: HTMLImageElement,
  cropOrig: Crop,
  resizeToOrig: Crop,
): Promise<Blob> {
  if (
    !keysDef(cropOrig, ['x', 'y', 'width', 'height']) ||
    !keysDef(resizeToOrig, ['width', 'height'])
  ) {
    throw new Error('Missing defined keys');
  }
  const crop = cropOrig as DimPos;
  const resizeTo = resizeToOrig as Dim;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const scaleRatio = Math.max(scaleX, scaleY);
  const cropWidth = crop.width * scaleRatio;
  const cropHeight = crop.height * scaleRatio;

  const marginX = calcMargin(image.width * scaleRatio, image.naturalWidth);
  const cropX = dropMargin(image.naturalWidth, marginX, crop.x * scaleRatio, cropWidth);
  const marginY = calcMargin(image.height * scaleRatio, image.naturalHeight);
  const cropY = dropMargin(image.naturalHeight, marginY, crop.y * scaleRatio, cropHeight);

  const resizedWidth = cropX.size / cropWidth * resizeTo.width;
  const resizedOffsetX = cropX.start < marginX ? resizeTo.width - resizedWidth : 0;
  const resizedHeight = cropY.size / cropHeight * resizeTo.height;
  const resizedOffsetY = cropY.start < marginY ? resizeTo.height - resizedHeight : 0;

  const canvas = document.createElement('canvas');

  canvas.width = resizeTo.width;
  canvas.height = resizeTo.height;
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    throw new Error('Invalid 2d context');
  }

  ctx.drawImage(
    image,
    cropX.start,
    cropY.start,
    cropX.size,
    cropY.size,
    resizedOffsetX,
    resizedOffsetY,
    resizedWidth,
    resizedHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
      canvas.remove();
    }, 'image/jpeg');
  });
}

const resizedImageSize = { width: 40, height: 40 };

interface SuperBlob extends Blob {
  name: string;
}

export const Upload: FC = () => {
  const [src, setSrc] = useState<string | ArrayBuffer | null>();
  const [imageRef, setImageRef] = useState();
  const [blob, setBlob] = useState<SuperBlob | undefined>(undefined);
  const [submittedToken, setSubmittedToken] = useState<string | undefined>(undefined);
  const { startUpload, uploads, status,  } = useFileUpload();
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 30,
  });

  const onSelectFile = useCallback((files) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(files[0]);
    }
  }, [setSrc]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: onSelectFile,
    multiple: false,
    accept: 'image/*',
  });

  useLayoutEffect(() => {
    (async () => {
      const rand = Math.ceil(Math.random() * 1000000);
      const name = `profile-${rand}.jpg`;

      if (imageRef && crop.width && crop.height) {
        const cropped: any = await getCroppedImg(
          imageRef, crop, { width: crop.width, height: crop.height });
        cropped.name = name;
        // Generate a unique name to reset useFileUpload state
        setBlob(cropped);
      }
    })();
  }, [imageRef, crop, setBlob]);

  const uploadImage = useCallback(() => {
    startUpload([blob as File]);
  }, [startUpload, blob]);
  useEffect(() => {
    (async () => {
      if (status === 'complete' && submittedToken !== uploads[0].token) {
        setSubmittedToken(uploads[0].token);
        await uploadUserImage(uploads[0].token);
        setBlob(undefined);
        setCrop({
          unit: '%',
          width: 30,
        });
        setImageRef(undefined);
        setSrc(undefined);
      }
    })();
  }, [status, uploads, submittedToken]);

  return (
    <div className='upload'>
      {status === 'error' && <h3>Upload failed</h3>}
      {src ? (
        <>
          <div className='actions'>
            <input type='button' disabled={!blob || status === 'uploading'} onClick={uploadImage} value='Upload' />
            <input type='button' onClick={() => setSrc(undefined)} value='Clear' />
          </div>
          <ReactCrop
            src={src as string}
            crop={crop}
            ruleOfThirds
            minWidth={resizedImageSize.width}
            minHeight={resizedImageSize.height}
            onImageLoaded={setImageRef}
            onChange={setCrop}
            onComplete={setCrop}
          />
        </>
      ) : (
        <div className={clsx('dropzone', isDragActive && 'active', isDragAccept && 'accept', isDragReject && 'reject')} {...getRootProps()}>
          <input {...getInputProps()} />
          {
            src
              ? null
              : isDragReject
                ? <h2>Please upload only 1 image file</h2>
                : isDragActive
                  ? <h2>Drop the files here ...</h2>
                  : <h2>Drag 'n' drop some files here, or click to select files</h2>
          }
        </div>
    )}
    </div>
  );
};
