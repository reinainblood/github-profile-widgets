import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

type Issue = {
    title: string
    html_url: string
    repository_url: string
}

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

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get('type') || 'issues'
    const count = parseInt(searchParams.get('count') || '5', 10)

    const githubToken = process.env.GITHUB_ACCESS_TOKEN

    if (!githubToken) {
        return new Response('GitHub token is required', { status: 400 })
    }

    let content
    if (type === 'issues') {
        content = await getAssignedIssues(count, githubToken)
    } else if (type === 'activity') {
        content = await getRecentActivity(count, githubToken)
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
            height: 300 + (count > 5 ? (count - 5) * 30 : 0),
        }
    )
}

async function getAssignedIssues(count: number, token: string) {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.full+json',
        'Authorization': `token ${token}`
    }

    const res = await fetch(`https://api.github.com/issues?filter=assigned&state=open&per_page=${count}`, { headers })
    const issues: Issue[] = await res.json()

    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {issues.slice(0, count).map((issue, index) => (
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

async function getRecentActivity(count: number, token: string) {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
    }

    const res = await fetch(`https://api.github.com/users/authenticated/events?per_page=${count}`, { headers })
    const activities: Activity[] = await res.json()

    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activities.slice(0, count).map((activity, index) => (
                <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9D00FF', marginRight: '10px' }} />
                    <div style={{ color: '#FFFFFF' }}>{getActivityDescription(activity)}</div>
                </li>
            ))}
        </ul>
    )
}

function getActivityDescription(activity: Activity): string {
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