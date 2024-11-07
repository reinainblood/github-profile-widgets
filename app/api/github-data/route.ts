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
        url = 'https://api.github.com/users/reinainblood/events?per_page=5'
    } else if (type === 'repositories') {
        // This will be handled in the POST method
        return NextResponse.json({ error: 'Use POST method for fetching repositories' }, { status: 400 })
    } else {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.full+json'
            }
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`GitHub API error: ${response.status} - ${errorText}`)
            return NextResponse.json({ error: 'Failed to fetch data from GitHub' }, { status: response.status })
        }

        const data = await response.json()

        // Ensure we always return an array
        return NextResponse.json(Array.isArray(data) ? data : [])
    } catch (error) {
        console.error('Error fetching data from GitHub:', error)
        return NextResponse.json({ error: 'Failed to fetch data from GitHub' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const { repositoryUrls } = await request.json()

    if (!Array.isArray(repositoryUrls) || repositoryUrls.length === 0) {
        return NextResponse.json({ error: 'Invalid repository URLs' }, { status: 400 })
    }

    const token = process.env.GITHUB_ACCESS_TOKEN
    if (!token) {
        return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    try {
        const repositories = await Promise.all(
            repositoryUrls.map(async (url) => {
                const urlParts = url.split('/')
                const owner = urlParts[urlParts.length - 2]
                const repo = urlParts[urlParts.length - 1]
                const apiUrl = `https://api.github.com/repos/${owner}/${repo}`

                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `token ${token}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch repository data for ${url}`)
                }

                return response.json()
            })
        )

        return NextResponse.json(repositories)
    } catch (error) {
        console.error('Error fetching repository data:', error)
        return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 500 })
    }
}