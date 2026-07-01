import { useEffect, useState } from 'react'

export function useHTMLImage(url: string | undefined): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!url) {
      setImage(null)
      return
    }
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = url
    return () => {
      img.onload = null
    }
  }, [url])

  return image
}
