"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export function QRCodeModal({ isOpen, onClose, postId, postTitle, onQRCodeGenerated }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [error, setError] = useState(null)

  // Generate the URL for the post
  const postUrl = `${window.location.origin}/post/${postId}`

  // Generate QR code using QR Server API
  useEffect(() => {
    console.log("QRCodeModal useEffect triggered", { isOpen, postUrl, postId, postTitle });
    
    if (isOpen && postId) {
      try {
        // Reset error state
        setError(null);
        
        // Use QR Server API which is more reliable
        const encodedUrl = encodeURIComponent(postUrl);
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
        console.log("Generated QR code URL:", qrCodeUrl);
        setQrCodeUrl(qrCodeUrl);
        
        // If onQRCodeGenerated callback is provided, call it with the QR code URL
        if (onQRCodeGenerated) {
          onQRCodeGenerated(qrCodeUrl);
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
        setError("Failed to generate QR code");
      }
    }
  }, [isOpen, postUrl, postId, onQRCodeGenerated]);

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `qrcode-${postTitle || "post"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      setError("Failed to download QR code");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {error ? (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          ) : qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64"
              onError={(e) => {
                console.error("Error loading QR code image");
                setError("Failed to load QR code image");
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center">
              <p>Generating QR code...</p>
            </div>
          )}
          <div className="text-sm text-muted-foreground text-center">
            Scan this QR code to view the post
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={downloadQRCode}
              disabled={isDownloading || !qrCodeUrl || !!error}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download QR Code"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 