import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

type Issue = {
    title: string
    html_url: string
    repository: {
        name: string
        private: boolean
    }
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
    try {
        const searchParams = req.nextUrl.searchParams
        const type = searchParams.get('type') || 'issues'
        const count = parseInt(searchParams.get('count') || '5', 10)

        let content
        try {
            const response = await fetch(`${req.nextUrl.origin}/api/github-data?type=${type}`)
            const data = await response.json()
            if ('error' in data) {
                new Error(data.error)
            }
            content = renderContent(type, data)
        } catch (error) {
            console.error('Error fetching data:', error)
            content = <p style={{ color: '#FF6B6B' }}>Error: {error instanceof Error ? error.message : 'An unknown error occurred'}</p>
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
                            display: 'flex',
                            flexDirection: 'column',
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
    } catch (error) {
        console.error('Error generating image:', error)
        return new Response(`Failed to generate image: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, { status: 500 })
    }
}

function renderContent(type: string, data: Issue[] | Activity[]) {
    if (type === 'issues') {
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
                {(data as Issue[]).slice(0, 5).map((issue, index) => (
                    <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9D00FF', marginRight: '10px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{issue.title}</span>
                            <span style={{ color: '#888', fontSize: '0.8em' }}>
                ({issue.repository.name})
              </span>
                        </div>
                    </li>
                ))}
            </ul>
        )
    } else {
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
                {(data as Activity[]).slice(0, 5).map((activity, index) => (
                    <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9D00FF', marginRight: '10px' }} />
                        <div style={{ color: '#FFFFFF' }}>{getActivityDescription(activity)}</div>
                    </li>
                ))}
            </ul>
        )
    }
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