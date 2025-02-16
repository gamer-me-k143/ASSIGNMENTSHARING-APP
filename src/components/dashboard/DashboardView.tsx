import * as React from "react"

interface DashboardViewProps {
  uploadedAssignments: number
  uploadedAnswers: number
}

export const DashboardView = ({
  uploadedAssignments,
  uploadedAnswers,
}: DashboardViewProps) => {
  const welcomeImage =
    "https://juowzxgwkyjhsywosjdq.supabase.co/storage/v1/object/public/assignments/b23b2j3430871.jpg"

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Dashboard
      </h2>
      <img
        src={welcomeImage}
        alt="Welcome"
        className="w-full h-64 object-contain rounded-lg mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Uploaded Assignments
          </h3>
          <p className="text-4xl font-semibold text-gray-900 dark:text-white">
            {uploadedAssignments}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Uploaded Answers
          </h3>
          <p className="text-4xl font-semibold text-gray-900 dark:text-white">
            {uploadedAnswers}
          </p>
        </div>
      </div>
    </div>
  )
}
