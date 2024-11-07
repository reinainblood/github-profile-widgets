import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const username = searchParams.get('username') || 'reinainblood'
    const type = searchParams.get('type') || 'issues'

    let content
    if (type === 'issues') {
        content = await getAssignedIssues(username)
    } else if (type === 'activity') {
        content = await getRecentActivity(username)
    } else {
        return new Response('Invalid type', { status: 400 })
    }

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 16,
                    background: 'linear-gradient(135deg, #2A2D3E, #1A1B26)',
                    color: '#FFFFFF',
                    width: '100%',
                    height: '100%',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    borderRadius: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                }}
            >
                <div
                    style={{
                        background: 'rgba(157, 0, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '15px',
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid rgba(157, 0, 255, 0.3)',
                        boxShadow: '0 0 10px rgba(157, 0, 255, 0.2)',
                    }}
                >
                    <h2 style={{ color: '#9D00FF', marginBottom: '15px', fontSize: '24px', fontWeight: 'bold' }}>
                        {type === 'issues' ? 'Assigned Issues' : 'Recent Activity'}
                    </h2>
                    {content}
                </div>
            </div>
        ),
        {
            width: 400,
            height: 300,
        }
    )
}

async function getAssignedIssues(username: string) {
    const res = await fetch(`https://api.github.com/search/issues?q=assignee:${username}+is:open`)
    const data = await res.json()
    const issues = data.items.slice(0, 5)

    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {issues.map((issue: any, index: number) => (
                <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9D00FF', marginRight: '10px' }} />
                    <div>
                        <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{issue.title}</span>
                        <span style={{ color: '#888', fontSize: '0.8em', marginLeft: '5px' }}>
              ({issue.repository_url.split('/').slice(-1)[0]})
            </span>
                    </div>
                </li>
            ))}
        </ul>
    )
}

async function getRecentActivity(username: string) {
    const res = await fetch(`https://api.github.com/users/${username}/events/public`)
    const activities = await res.json()

    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activities.slice(0, 5).map((activity: any, index: number) => (
                <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9D00FF', marginRight: '10px' }} />
                    <div style={{ color: '#FFFFFF' }}>{getActivityDescription(activity)}</div>
                </li>
            ))}
        </ul>
    )
}

function getActivityDescription(activity: any) {
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