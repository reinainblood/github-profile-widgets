export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>GitHub Profile Widgets</h1>
            <div>
                <h2>Assigned Issues</h2>
                <img src="/api/og?type=issues&username=reinainblood" alt="Assigned Issues" />
            </div>
            <div>
                <h2>Recent Activity</h2>
                <img src="/api/og?type=activity&username=reinainblood" alt="Recent Activity" />
            </div>
        </main>
    )
}