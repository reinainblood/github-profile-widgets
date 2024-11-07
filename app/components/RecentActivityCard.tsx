'use client'

import { useEffect, useState } from 'react'
import { GitCommit, GitFork, MessageSquare, Star } from 'lucide-react'

type Activity = {
    type: string
    repo: {
        name: string
    }
    payload: {
        commits?: Array<{ message: string }>
    }
    created_at: string
}

export default function RecentActivityCard() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const response = await fetch('/api/github-data?type=activities')
                const data = await response.json()
                if (data.error) {
                    setError(data.error)
                } else {
                    setActivities(data)
                }
            } catch (error) {
                console.error('Error fetching recent activity:', error)
                setError('Failed to fetch recent activity. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchRecentActivity()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'PushEvent':
                return <GitCommit color="#9D00FF" />
            case 'ForkEvent':
                return <GitFork color="#9D00FF" />
            case 'IssueCommentEvent':
            case 'CommitCommentEvent':
                return <MessageSquare color="#9D00FF" />
            case 'WatchEvent':
                return <Star color="#9D00FF" />
            default:
                return null
        }
    }

    const getActivityDescription = (activity: Activity): string => {
        switch (activity.type) {
            case 'PushEvent':
                return `Pushed ${activity.payload.commits?.length || 0} commit(s) to ${activity.repo.name}`
            case 'ForkEvent':
                return `Forked ${activity.repo.name}`
            case 'IssueCommentEvent':
                return `Commented on issue in ${activity.repo.name}`
            case 'CommitCommentEvent':
                return `Commented on commit in ${activity.repo.name}`
            case 'WatchEvent':
                return `Starred ${activity.repo.name}`
            default:
                return `Activity in ${activity.repo.name}`
        }
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', background: '#1A1B26', color: '#FFFFFF', borderRadius: '10px', width: '400px' }}>
            <h2 style={{ color: '#9D00FF', marginBottom: '15px' }}>Recent Activity</h2>
            {activities.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {activities.map((activity, index) => (
                        <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>{getActivityIcon(activity.type)}</span>
                            <span>{getActivityDescription(activity)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recent activity found.</p>
            )}
        </div>
    )
}