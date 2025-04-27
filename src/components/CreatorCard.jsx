import Link from 'next/link'
import Image from 'next/image'

export default function CreatorCard({ 
  name, 
  description, 
  subscribers = 0,  // Default value
  imageUrl 
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <Image
            src={imageUrl || '/default-avatar.png'}
            alt={name || 'Creator'}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{name || 'Unnamed Creator'}</h3>
          <p className="text-sm text-muted-foreground">
            {subscribers?.toLocaleString() || '0'} subscribers
          </p>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {description || 'No description available'}
      </p>
      <Link
        href={`/creators/${name?.toLowerCase()?.replace(/\s+/g, '-') || 'unknown'}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        View Profile
      </Link>
    </div>
  )
}