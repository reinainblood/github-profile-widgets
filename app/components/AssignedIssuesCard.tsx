'use client'
import styles from './AssignedIssuesCard.module.css';

import { useEffect, useState } from 'react';
import Card from './Card';

type Issue = {
    title: string;
    html_url: string;
    repository: {
        name: string;
        private: boolean;
    };
};

export default function AssignedIssuesCard() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssignedIssues = async () => {
            try {
                const response = await fetch('/api/github-data?type=issues');
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setIssues(data);
                }
            } catch (error) {
                console.error('Error fetching assigned issues:', error);
                setError('Failed to fetch assigned issues. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedIssues();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Card
            width={400}
            height={300}
            customTitle="Assigned Issues"
            titleColor="#9D00FF"
            textColor="#b8b9b9"
            bgColor="#1A1B26"
            borderColor="#9D00FF"
        >
            {issues.length > 0 ? (
                <ul className={styles.issuesList}>
                    {issues.map((issue, index) => (
                        <li key={index} className={styles.issueItem}>
                            <a
                                href={issue.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.issueLink}
                            >
                                {issue.title}
                            </a>
                            <span className={styles.issueRepo}>
                            ({issue.repository.name}) {issue.repository.private ? '🔒' : ''}
                        </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No assigned issues found.</p>
            )}
        </Card>
    );
}