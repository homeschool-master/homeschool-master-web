type PlaceholderSectionProps = {
  title: string
}

const PlaceholderSection = ({ title }: PlaceholderSectionProps) => (
  <div className='dashboard__placeholder'>
    <h2 className='dashboard__placeholder-title'>{title}</h2>
    <p className='dashboard__placeholder-text'>Coming soon.</p>
  </div>
)

export default PlaceholderSection