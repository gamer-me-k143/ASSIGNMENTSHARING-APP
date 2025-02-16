import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

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

interface UploadFormProps {
  handleUpload: (e: React.FormEvent) => Promise<void>;
}

export const UploadForm = ({ handleUpload }: UploadFormProps) => {
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState("");
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedAssignments, setUploadedAssignments] = useState<Assignment[]>([]);
  const { toast } = useToast();
  const welcomeGif = "https://juowzxgwkyjhsywosjdq.supabase.co/storage/v1/object/public/assignments/bhrami.gif";

  useEffect(() => {
    fetchUploadedAssignments();
  }, []);

  const fetchUploadedAssignments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedAssignments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch uploaded assignments",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('assignments')
        .insert({
          user_id: user.id,
          title,
          code: courseCode,
          year: Number(year),
          semester,
          questions,
          answers,
          file_path: 'N/A'
        });

      if (error) throw error;

      await handleUpload(e);
      await fetchUploadedAssignments();

      toast({
        title: "Success",
        description: "Assignment uploaded successfully",
      });

      // Reset form
      setTitle("");
      setCourseCode("");
      setYear(new Date().getFullYear());
      setSemester("");
      setQuestions("");
      setAnswers("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Upload Assignment</h2>
      <img src={welcomeGif} alt="Welcome" className="w-full h-64 object-contain rounded-lg mb-6" /> {/* Increased height to h-64 */}
      
      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-4">
        <div>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min={2000}
            max={2100}
            className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
            required
          />
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
            required
          >
            <option value="">Select Semester</option>
            <option value="evensem">Even Semester</option>
            <option value="oddsem">Odd Semester</option>
            <option value="summerterm">Summer Term</option>
          </select>
        </div>
        <div>
          <Textarea
            placeholder="Enter your questions here..."
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            className="min-h-[200px] w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Enter your answers here..."
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
            className="min-h-[200px] w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 font-semibold rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Uploading..." : "Upload Assignment"}
        </button>
      </form>

      {/* Display uploaded assignments */}
      {uploadedAssignments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Uploaded Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg mb-2">{assignment.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Code: {assignment.code}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Year: {assignment.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
