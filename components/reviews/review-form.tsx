'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from './star-rating'
import { useToast } from '@/components/ui/use-toast'

interface ReviewFormProps {
  gigId: string
  onSubmit: () => void
}

export function ReviewForm({ gigId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gigId,
          rating,
          comment,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit review')

      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      })
      
      setRating(0)
      setComment('')
      onSubmit()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Comment
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          required
        />
      </div>
      <Button type="submit" disabled={rating === 0}>
        Submit Review
      </Button>
    </form>
  )
}

