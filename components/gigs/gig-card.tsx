import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistance } from 'date-fns'

interface GigCardProps {
  gig: {
    id: string
    title: string
    description: string
    rate: number
    location: string
    created_at: string
    category: string
  }
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{gig.title}</CardTitle>
            <CardDescription>{gig.location}</CardDescription>
          </div>
          <Badge>{gig.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{gig.description}</p>
        <div className="flex justify-between items-center">
          <div className="font-semibold">${gig.rate}/hr</div>
          <div className="text-sm text-muted-foreground">
            Posted {formatDistance(new Date(gig.created_at), new Date(), { addSuffix: true })}
          </div>
        </div>
        <Button className="w-full mt-4">Apply Now</Button>
      </CardContent>
    </Card>
  )
}

