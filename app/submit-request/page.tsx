// app/submit-request/page.tsx
import { createSubmission } from "@/actions/submission-actions";

export default function SubmitRequestPage() {
  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Citizen Document Submission</h1>
      <form
        action={createSubmission}
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
        {/* Request Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Request Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            className="w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Birth Certificate Verification">Birth Certificate Verification</option>
            <option value="Correction">Correction</option>
            <option value="Announcement Request">Announcement Request</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* File Attachment */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            File Attachment
          </label>
          <input
            type="file"
            name="file"
            id="file"
            accept="*/*"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="self-start px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Submit Request
        </button>
      </form>
    </section>
  );
}
