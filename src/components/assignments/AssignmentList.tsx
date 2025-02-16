import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  code: string;
  year: number;
  semester: string;
  questions: string;
  answers: string;
  file_path: string;
  created_at: string;
}

interface AssignmentListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const AssignmentList = ({ searchQuery, setSearchQuery }: AssignmentListProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const { toast } = useToast();
  const welcomeImage = "https://juowzxgwkyjhsywosjdq.supabase.co/storage/v1/object/public/assignments/b23b2j3430871.jpg";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase fetch error:", error);
          toast({
            title: "Error",
            description: "Failed to fetch assignments",
            variant: "destructive",
          });
        } else {
          console.log("Fetched assignments:", data);
          setAssignments(data || []);
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch assignments",
          variant: "destructive",
        });
      }
    };

    fetchAssignments();
  }, [toast]);

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedAssignment) {
    const assignment = assignments.find(a => a.id === selectedAssignment);
    if (!assignment) return null;

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <button 
          onClick={() => setSelectedAssignment(null)}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to List
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          {/* Removed the image here */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {assignment.title}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-600 dark:text-gray-300">
              Course Code: {assignment.code}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Year: {assignment.year}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Questions</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap">
                {assignment.questions}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Answers</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap">
                {assignment.answers}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Home Assignments</h2>
      <img src={welcomeImage} alt="Welcome" className="w-full h-64 object-contain rounded-lg mb-6" /> {/* Increased height to h-64 */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by course code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-gray-500 focus:ring-0"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No assignments found.
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div 
              key={assignment.id} 
              onClick={() => setSelectedAssignment(assignment.id)}
              className="cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {assignment.title}
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Course Code: {assignment.code}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Year: {assignment.year}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
