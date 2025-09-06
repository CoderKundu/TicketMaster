"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, X, CheckCircle, XCircle, Scan } from "lucide-react"

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanResult: (result: string) => void
}

export function QRScanner({ isOpen, onClose, onScanResult }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsScanning(false)
  }

  const simulateScan = () => {
    // Simulate QR code detection
    const mockTicketId = `TM-${Date.now()}`
    setScanResult(mockTicketId)
    setIsValid(Math.random() > 0.3) // 70% chance of valid ticket
    onScanResult(mockTicketId)
    stopScanning()
  }

  useEffect(() => {
    if (!isOpen) {
      stopScanning()
      setScanResult(null)
      setIsValid(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md terminal-card terminal-glow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">QR Code Scanner</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!isScanning && !scanResult && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Scan className="h-12 w-12 text-primary" />
              </div>
              <p className="text-muted-foreground">Scan QR codes on tickets to validate entry</p>
              <Button onClick={startScanning} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">Position QR code within the frame</p>
              <div className="flex space-x-2">
                <Button onClick={simulateScan} className="flex-1">
                  Simulate Scan
                </Button>
                <Button variant="outline" onClick={stopScanning}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="text-center space-y-4">
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  isValid ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                {isValid ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              <div>
                <h4 className={`text-lg font-semibold ${isValid ? "text-green-500" : "text-red-500"}`}>
                  {isValid ? "Valid Ticket" : "Invalid Ticket"}
                </h4>
                <p className="text-sm text-muted-foreground">Ticket ID: {scanResult}</p>
                {isValid && <p className="text-sm text-green-600 mt-2">Entry authorized • Museum Tour • 2:00 PM</p>}
              </div>
              <Button
                onClick={() => {
                  setScanResult(null)
                  setIsValid(null)
                }}
                className="w-full"
              >
                Scan Another
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
