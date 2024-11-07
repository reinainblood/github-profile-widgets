import AssignedIssuesCard from './components/AssignedIssuesCard'
import RecentActivityCard from './components/RecentActivityCard'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>GitHub Profile Widgets</h1>
            <div className="flex flex-wrap justify-center gap-4">
                <AssignedIssuesCard />
                <RecentActivityCard />
            </div>
        </main>
    )
}