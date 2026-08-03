// app/my-requests/page.tsx
import { getUserSubmissions } from "@/actions/submission-actions";

export default async function MyRequestsPage() {
  const submissions = await getUserSubmissions();

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Submitted Requests</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-600">You have not submitted any requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <li key={s.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-lg font-medium mb-1">{s.title}</h2>
              <p className="text-sm text-gray-500 mb-2">Submitted on {new Date(s.created_at).toLocaleDateString()}</p>
              <p className="mb-2">Status: <span className={
                s.status === "pending" ? "text-yellow-600" :
                s.status === "approved_and_posted" ? "text-green-600" :
                "text-red-600"
              }>{s.status.replace("_", " ").toUpperCase()}</span></p>
              {s.file_url && (
                <a
                  href={s.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:underline"
                >
                  View attached document
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
