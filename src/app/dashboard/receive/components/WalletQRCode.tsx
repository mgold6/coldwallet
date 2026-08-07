"use client";

import { QRCodeCanvas } from "qrcode.react";


interface WalletQRCodeProps {
  address: string;
}


export default function WalletQRCode({
  address,
}: WalletQRCodeProps) {

  return (
    <div className="
      flex
      justify-center
      rounded-3xl
      bg-white
      p-6
    ">

      <QRCodeCanvas
        value={address}
        size={220}
        level="H"
      />

    </div>
  );

}