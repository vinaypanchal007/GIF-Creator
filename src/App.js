import React, { useState } from 'react';
import Webcam from 'react-webcam';
import gifshot from 'gifshot';

const App = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [generatedGif, setGeneratedGif] = useState(null);

  const webcamRef = React.useRef(null);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prevImages) => [...prevImages, imageSrc]);
    }
  };

  const handleUpload = (event) => {
    const files = event.target.files;
    const fileUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...fileUrls]);
  };

  const createGif = () => {
    const allImages = [...capturedImages, ...uploadedImages];

    if (allImages.length > 0) {
      gifshot.createGIF(
        {
          images: allImages,
          gifWidth: 300,
          gifHeight: 300,
          interval: 0.5,
        },
        (obj) => {
          if (!obj.error) {
            setGeneratedGif(obj.image);
          }
        }
      );
    } else {
      alert('No images to create GIF.');
    }
  };

  const downloadGif = () => {
    if (generatedGif) {
      const link = document.createElement('a');
      link.href = generatedGif;
      link.download = 'generated.gif';
      link.click();
    } else {
      alert('No GIF to download.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">GIF Creator</h1>

      {/* Webcam Section */}
      <div className="mb-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg shadow-lg"
          width={300}
        />
      </div>
      <button
        onClick={captureImage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Capture Image
      </button>

      {/* File Upload Section */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Upload Images:
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="block w-full text-gray-700 border rounded p-2"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-x-4 mb-6">
        <button
          onClick={createGif}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create GIF
        </button>
        <button
          onClick={downloadGif}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Download GIF
        </button>
      </div>

      {/* Display Captured and Uploaded Images */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Selected Images:</h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {[...capturedImages, ...uploadedImages].map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Selected ${index}`}
              className="w-24 h-24 rounded border"
            />
          ))}
        </div>
      </div>

      {/* Display Generated GIF */}
      <div>
        {generatedGif && (
          <>
            <h2 className="text-xl font-semibold">Generated GIF:</h2>
            <img
              src={generatedGif}
              alt="Generated GIF"
              className="rounded border mt-4 w-64"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
