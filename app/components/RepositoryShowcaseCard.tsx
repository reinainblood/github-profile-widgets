'use client'

import { useEffect, useState } from 'react'
import styles from './RepositoryShowcaseCard.module.css'

type Repository = {
    name: string
    html_url: string
    description: string
    stargazers_count: number
    forks_count: number
    watchers_count: number
    language: string
}

type RepositoryShowcaseCardProps = {
    repositoryUrls: string[]
}

export default function RepositoryShowcaseCard({ repositoryUrls }: RepositoryShowcaseCardProps) {
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await fetch('/api/github-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ repositoryUrls }),
                })
                const data = await response.json()
                if (data.error) {
                    setError(data.error)
                } else {
                    setRepositories(data)
                }
            } catch (error) {
                console.error('Error fetching repositories:', error)
                setError('Failed to fetch repositories. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchRepositories()
    }, [repositoryUrls])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className={styles.repositoryShowcaseCard}>
            <h2 className={styles.showcaseTitle}>Repository Showcase</h2>
            {repositories.length > 0 ? (
                <ul className={styles.repositoryList}>
                    {repositories.map((repo, index) => (
                        <li key={index} className={styles.repositoryItem}>
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={styles.repositoryLink}>
                                <h3>{repo.name}</h3>
                            </a>
                            <p className={styles.repositoryDescription}>{repo.description}</p>
                            <div className={styles.repositoryStats}>
                                <span>⭐ {repo.stargazers_count}</span>
                                <span>🍴 {repo.forks_count}</span>
                                <span>👁️ {repo.watchers_count}</span>
                            </div>
                            {repo.language && <span className={styles.repositoryLanguage}>{repo.language}</span>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No repositories found.</p>
            )}
        </div>
    )
}