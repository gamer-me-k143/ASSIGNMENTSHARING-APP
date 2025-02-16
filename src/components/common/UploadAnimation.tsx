import { motion } from "framer-motion";

interface UploadAnimationProps {
  show: boolean;
}

export const UploadAnimation = ({ show }: UploadAnimationProps) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1 }}
      className="fixed inset-x-0 bottom-0 z-50"
    >
      <img
        src="/lovable-uploads/2381ce0b-8001-4cc6-86ce-0c3a39f3193f.png"
        alt="Upload success"
        className="w-full h-auto"
      />
    </motion.div>
  );
};
