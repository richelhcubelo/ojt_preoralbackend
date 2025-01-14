import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import "./image-upload.scss";

interface PhotoUploadButtonProps {
  onPhotoUpload: (file: File) => void; // Callback to pass the file to parent component
  imgDirectory?: string;
}

const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({
  onPhotoUpload,
  imgDirectory,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(
    imgDirectory ? `http://localhost:3001/uploads/${imgDirectory}` : null
  );

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Display a preview of the photo
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Pass the file to the parent component
      onPhotoUpload(file);
    }
  };

  return (
    <div className="photo-upload-button">
      <div className="photo-preview" onClick={handleButtonClick}>
        {photoURL ? (
          <img src={photoURL} alt="Uploaded" className="photo" />
        ) : (
          <div className="upload-placeholder">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
            Add Image
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
    </div>
  );
};

export default PhotoUploadButton;
