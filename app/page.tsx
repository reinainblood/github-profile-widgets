import AssignedIssuesCard from './components/AssignedIssuesCard'
import RecentActivityCard from './components/RecentActivityCard'
import RepositoryShowcaseCard from "./components/RepositoryShowcaseCard";


export default function Home() {
        const repositoryUrls = [
            'https://github.com/flipt-io',
            'https://github.com/f3d-app/f3d',
            'https://github.com/prometheus/prometheus'
        ]
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>GitHub Profile Widgets</h1>
            <div className="flex flex-wrap justify-center gap-4">
                <AssignedIssuesCard />
                <RecentActivityCard />
                <RepositoryShowcaseCard  repositoryUrls={
                    repositoryUrls
                }/>
            </div>
        </main>
    )
}