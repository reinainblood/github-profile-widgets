'use client'

import { useEffect, useState } from 'react'

type Issue = {
    title: string
    html_url: string
    repository: {
        name: string
        private: boolean
    }
}

export default function AssignedIssuesCard() {
    const [issues, setIssues] = useState<Issue[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAssignedIssues = async () => {
            try {
                const response = await fetch('/api/github-data?type=issues')
                const data = await response.json()
                if (data.error) {
                    setError(data.error)
                } else {
                    setIssues(data)
                }
            } catch (error) {
                console.error('Error fetching assigned issues:', error)
                setError('Failed to fetch assigned issues. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchAssignedIssues()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', background: '#1A1B26', color: '#FFFFFF', borderRadius: '10px', width: '400px' }}>
            <h2 style={{ color: '#9D00FF', marginBottom: '15px' }}>Assigned Issues</h2>
            {issues.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {issues.map((issue, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <a href={issue.html_url} target="_blank" rel="noopener noreferrer" style={{ color: '#9D00FF', textDecoration: 'none' }}>
                                {issue.title}
                            </a>
                            <span style={{ color: '#888', fontSize: '0.8em', marginLeft: '5px' }}>
                ({issue.repository.name}) {issue.repository.private ? '🔒' : ''}
              </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No assigned issues found.</p>
            )}
        </div>
    )
}