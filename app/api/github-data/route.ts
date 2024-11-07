import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const token = process.env.GITHUB_ACCESS_TOKEN
    if (!token) {
        return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    let url = ''
    if (type === 'issues') {
        url = 'https://api.github.com/issues?filter=assigned&state=open&per_page=5'
    } else if (type === 'activities') {
        url = 'https://api.github.com/user/events?per_page=5'
    } else {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json'
        }
    })

    const data = await response.json()
    return NextResponse.json(data)
}