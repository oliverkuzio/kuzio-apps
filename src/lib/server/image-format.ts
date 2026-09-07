export interface ImageInfo {
  contentType: string
  extension: string
  width: number
  height: number
}

/**
 * Identifies a PNG/JPEG/WebP image and reads its dimensions straight from the file
 * header — no decoding library needed, which keeps this safe to run in the Workers
 * runtime. Trusts the file's own magic bytes rather than the browser-supplied MIME
 * type, since that's easy to spoof.
 */
export function detectImage(bytes: Uint8Array): ImageInfo | null {
  return readPng(bytes) ?? readJpeg(bytes) ?? readWebp(bytes)
}

function readPng(bytes: Uint8Array): ImageInfo | null {
  if (bytes.length < 24) {
    return null
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  // 8-byte signature, then the IHDR chunk: 4-byte length + "IHDR" + width + height.
  if (view.getUint32(0) !== 0x89504E47 || view.getUint32(4) !== 0x0D0A1A0A) {
    return null
  }
  return {
    contentType: 'image/png',
    extension: 'png',
    width: view.getUint32(16),
    height: view.getUint32(20),
  }
}

function readJpeg(bytes: Uint8Array): ImageInfo | null {
  if (bytes.length < 4) {
    return null
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (view.getUint16(0) !== 0xFFD8) {
    return null
  }

  let offset = 2
  while (offset + 9 < bytes.length) {
    if (view.getUint8(offset) !== 0xFF) {
      offset++
      continue
    }
    const marker = view.getUint8(offset + 1)
    if (marker === 0xFF) {
      offset++ // fill byte
      continue
    }
    if (marker === 0xD8 || marker === 0xD9 || (marker >= 0xD0 && marker <= 0xD7)) {
      offset += 2 // markers with no payload
      continue
    }
    if (marker === 0xDA) {
      break // SOS — entropy-coded scan data follows, no more frame headers
    }

    const segmentLength = view.getUint16(offset + 2)
    // SOF0-SOF15 carry the frame dimensions, except the DHT/JPG/DAC marker numbers
    // that fall in the same range.
    const isFrameHeader = marker >= 0xC0 && marker <= 0xCF
      && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC
    if (isFrameHeader) {
      return {
        contentType: 'image/jpeg',
        extension: 'jpg',
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
      }
    }
    offset += 2 + segmentLength
  }
  return null
}

function readWebp(bytes: Uint8Array): ImageInfo | null {
  if (bytes.length < 30) {
    return null
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (view.getUint32(0) !== 0x52494646 || view.getUint32(8) !== 0x57454250) {
    return null // not "RIFF"···"WEBP"
  }

  const format = view.getUint32(12)
  let width: number
  let height: number
  if (format === 0x56503820) {
    // "VP8 " (lossy): 14-bit dimensions (plus a 2-bit scale factor we ignore) at 26/28.
    width = view.getUint16(26, true) & 0x3FFF
    height = view.getUint16(28, true) & 0x3FFF
  }
  else if (format === 0x5650384C) {
    // "VP8L" (lossless): dimensions packed into a little-endian uint32 at offset 21.
    const bits = view.getUint32(21, true)
    width = (bits & 0x3FFF) + 1
    height = ((bits >> 14) & 0x3FFF) + 1
  }
  else if (format === 0x56503858) {
    // "VP8X" (extended): 24-bit little-endian canvas dimensions at 24/27.
    width = (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1
    height = (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1
  }
  else {
    return null
  }

  return { contentType: 'image/webp', extension: 'webp', width, height }
}
