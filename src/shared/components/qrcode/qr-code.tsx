import React from "react";
import QRCode from "react-qr-code";

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ value, size = 128 }) => {
  return <QRCode value={value} size={size} />;
};

export default QRCodeComponent;
