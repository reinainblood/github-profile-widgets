import { useEffect, useState } from 'react'
import axios from 'axios'

type Issue = {
    title: string
    html_url: string
    repository_url: string
}

export default function AssignedIssuesCard({ username = 'reinainblood' }: { username?: string }) {
    const [issues, setIssues] = useState<Issue[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAssignedIssues = async () => {
            try {
                const response = await axios.get<{ items: Issue[] }>(`https://api.github.com/search/issues?q=assignee:${username}+is:open`)
                setIssues(response.data.items.slice(0, 5))
            } catch (error) {
                console.error('Error fetching assigned issues:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAssignedIssues()
    }, [username])

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', background: '#1A1B26', color: '#FFFFFF', borderRadius: '10px', width: '400px' }}>
            <h2 style={{ color: '#9D00FF', marginBottom: '15px' }}>Assigned Issues</h2>
            {loading ? (
                <p>Loading...</p>
            ) : issues.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {issues.map((issue, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <a href={issue.html_url} target="_blank" rel="noopener noreferrer" style={{ color: '#9D00FF', textDecoration: 'none' }}>
                                {issue.title}
                            </a>
                            <span style={{ color: '#888', fontSize: '0.8em', marginLeft: '5px' }}>
                ({issue.repository_url.split('/').slice(-1)[0]})
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