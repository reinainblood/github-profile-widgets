'use client'
import styles from './RepositoryShowcaseCard.module.css';
import { useEffect, useState } from 'react'

type Repository = {
    name: string
    html_url: string
    stargazers_count: number
    forks_count: number
    watchers_count: number
}

export default function RepositoryShowcaseCard() {
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await fetch('/api/github-data?type=repositories')
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
    }, [])

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
                                {repo.name}
                            </a>
                            <div className={styles.repositoryStats}>
                                <span>⭐ {repo.stargazers_count}</span>
                                <span>🍴 {repo.forks_count}</span>
                                <span>👁️ {repo.watchers_count}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No repositories found.</p>
            )}
        </div>
    )
}