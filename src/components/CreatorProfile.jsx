import Image from 'next/image'
import PropTypes from 'prop-types'

export default function CreatorProfile({ creator }) {
  if (!creator) {
    return <div className="rounded-lg border bg-card p-6 shadow-sm">Loading...</div>
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={creator.imageUrl || '/default-avatar.png'}
            alt={creator.name || 'Creator'}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{creator.name || 'Unnamed Creator'}</h2>
          <p className="text-muted-foreground">
            {(creator.subscribers || 0).toLocaleString()} subscribers
          </p>
        </div>
      </div>
      <p className="mb-6 text-muted-foreground">{creator.description || 'No description available'}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Subscription Tiers</h3>
          <ul className="space-y-2">
            {creator.tiers?.map((tier) => (
              <li key={tier.id} className="flex items-center justify-between">
                <span>{tier.name}</span>
                <span className="font-medium">
                  {(tier.price || 0).toLocaleString()} ETH
                </span>
              </li>
            )) || <li className="text-muted-foreground">No tiers available</li>}
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Recent Content</h3>
          <ul className="space-y-2">
            {creator.recentContent?.map((content) => (
              <li key={content.id} className="flex items-center justify-between">
                <span>{content.title}</span>
                <span className="text-sm text-muted-foreground">
                  {content.date}
                </span>
              </li>
            )) || <li className="text-muted-foreground">No recent content</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

CreatorProfile.propTypes = {
  creator: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    subscribers: PropTypes.number,
    tiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
      })
    ),
    recentContent: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
      })
    )
  })
} 