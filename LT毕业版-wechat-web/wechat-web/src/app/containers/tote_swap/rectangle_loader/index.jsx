import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_500_750 } from 'src/assets/placeholder'

export default function RectangleLoader({
  src,
  alt = '...img',
  className = 'image',
  placeholder = placeholder_500_750
}) {
  return !_.isEmpty(src) ? (
    <ProgressiveImage src={src} placeholder={placeholder}>
      {image => <img alt={alt} src={image} className={className} />}
    </ProgressiveImage>
  ) : (
    <img alt={alt} src={placeholder} className={className} />
  )
}
