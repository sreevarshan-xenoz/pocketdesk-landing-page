import QRCode from 'qrcode'

/** A QR code as one SVG path (a unit square per dark module), computed synchronously so it prerenders. */
export function qrPath(text: string): { size: number; d: string } {
  const { size, data } = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules
  let d = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) d += `M${x} ${y}h1v1h-1z`
    }
  }
  return { size, d }
}
