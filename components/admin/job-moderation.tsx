'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/app/supabase-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface Job {
  id: string
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  employer: {
    name: string
    email: string
  }
}

export function JobModeration() {
  const [jobs, setJobs] = useState<Job[]>([])
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:profiles(name, email)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
    } else {
      setJobs(data)
    }
  }

  const handleStatusUpdate = async (jobId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', jobId)

      if (error) throw error

      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status } : job
      ))

      toast({
        title: 'Success',
        description: `Job ${status} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Moderation</CardTitle>
        <CardDescription>Review and moderate job postings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.employer.name}</TableCell>
                <TableCell>
                  <Badge variant={
                    job.status === 'approved' ? 'success' :
                    job.status === 'rejected' ? 'destructive' :
                    'default'
                  }>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(job.id, 'approved')}
                    disabled={job.status === 'approved'}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(job.id, 'rejected')}
                    disabled={job.status === 'rejected'}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

