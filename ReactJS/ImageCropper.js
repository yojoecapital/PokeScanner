import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import ReactCrop, {
  centerCrop,
  makeAspectCrop
} from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

function ImageCropper({src, handleCroppedImage}) {
  const [crop, setCrop] = useState();
  
  const [imageRef, setImageRef] = useState();
  const [hideCropper, setHideCropper] = React.useState(false)

  async function cropImage() {
    if (imageRef && crop && crop.width && crop.height) {
        setHideCropper(true);
        const croppedImage = await getCroppedImage(
            imageRef,
            crop,
            'croppedImage.jpeg' // destination filename
        );
        handleCroppedImage(croppedImage);
    }
  }

  function onImageLoad(e) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    let crop = centerCrop(
      makeAspectCrop(
        {
          // You don't need to pass a complete crop into
          // makeAspectCrop or centerCrop.
          unit: '%',
          width: 100,
          aspect: 1,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
    setImageRef(e.currentTarget);
  }

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        sourceImage,
        cropConfig.x * scaleX,
        cropConfig.y * scaleY,
        cropConfig.width * scaleX,
        cropConfig.height * scaleY,
        0,
        0,
        cropConfig.width,
        cropConfig.height
    );
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                // returning an error
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }

                blob.name = fileName;
                // creating a Object URL representing the Blob object given
                const croppedImageUrl = window.URL.createObjectURL(blob);

                resolve(croppedImageUrl);
            }, 'image/jpeg'
        );
    });
}

  return (<div>{
      !hideCropper && 
      <div>
        <ReactCrop 
          src={src}
          crop={crop} 
          aspect={1}
          onChange={c => setCrop(c)}
          ruleOfThirds
          onComplete={c => setCrop(c)}>
          <img src={src} onLoad={onImageLoad}/>
        </ReactCrop>
        <Button title="Submit" onPress={cropImage}></Button>
      </div>
    }
    {
      hideCropper && <Text>Loading...</Text>
    }
  </div>);
}

export default ImageCropper;