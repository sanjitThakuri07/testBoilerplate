import React, { useState, useRef } from "react";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import MaterialModal from "src/components/MaterailModal";

function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const buffer = new ArrayBuffer(length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0; i < length; i++) {
    bufferView[i] = binaryString.charCodeAt(i);
  }
  return buffer;
}

function CropDemo({ file, updateFile }) {
  const [srcImg, setSrcImg] = useState(URL.createObjectURL(file?.file) || null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [result, setResult] = useState(null);
  const [showCropImage, setShowCropImage] = useState(false);

  const handleImage = async (event) => {
    setSrcImg(URL.createObjectURL(event.target.files[0]));
  };

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      const base64Image = canvas.toDataURL("image/jpeg", 1);
      setResult(base64Image);
      updateFile?.({ base64: base64Image, preview: base64Image, update: true });
    } catch (e) {
      console.log("crop the image=> error");
    }

    setShowCropImage(true);
  };

  return (
    <>
      {/* <input type="file" accept="image/*" onChange={handleImage} /> */}
      {srcImg && (
        <div className="image__cropper">
          {result && showCropImage && (
            <div className="cropped__result">
              <img src={result} alt="cropped image" />
            </div>
          )}
          <ReactCrop
            crop={crop}
            onChange={setCrop}
            style={{ display: showCropImage ? "none" : "block" }}
          >
            <img
              src={srcImg}
              alt=""
              onLoad={(e) => {
                setImage(e.currentTarget);
              }}
            />
          </ReactCrop>
          <div
            style={{ textDecoration: "underline", margin: "0.5rem 0", cursor: "pointer" }}
            className="cropButton"
            onClick={() => {
              let cropImage = showCropImage;
              setShowCropImage((prev) => !prev);
              if (!cropImage) {
                getCroppedImg();
              }
            }}
          >
            {showCropImage ? "Re-crop Image" : "Get Cropped Image"}
          </div>
        </div>
      )}

      {/* {result && showCropImage && (
        <MaterialModal
          openModal={showCropImage}
          setOpenModal={setShowCropImage}
          className={'image__cropper-container-second'}>
          <div className="cropped__result">
            <img src={result} alt="cropped image" />
          </div>
        </MaterialModal>
      )} */}
      {/* <button onClick={'getCroppedImage'}>Get Cropped Image</button> */}
    </>
  );
}

export default CropDemo;
