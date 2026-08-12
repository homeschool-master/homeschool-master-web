import { QRCodeSVG } from 'qrcode.react'

interface InstallQrCardProps {
  title: string
  url?: string
  caption: string
  note: string
  comingSoonText: string
}

const InstallQrCard = ({ title, url, caption, note, comingSoonText }: InstallQrCardProps) => {
  return (
    <div className='install-card'>
      <h3 className='install-card__title'>{title}</h3>

      <div className='install-card__code'>
        {url ? (
          <QRCodeSVG
            value={url}
            size={220}
            level='M'
            bgColor='transparent'
            fgColor='#231f20'
            className='install-card__qr'
          />
        ) : (
          <div className='install-card__placeholder'>{comingSoonText}</div>
        )}
      </div>

      <p className='install-card__caption'>{caption}</p>
      <p className='install-card__note'>{note}</p>
    </div>
  )
}

export default InstallQrCard
