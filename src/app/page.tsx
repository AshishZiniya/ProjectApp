// app/page.tsx
import Link from "next/link";
import Button from "@/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faUsers,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 p-6">
      <div className="text-center mb-12">
        <div className="mb-6 min-h-[80px] flex items-center justify-center">
          <FontAwesomeIcon
            icon={faRocket}
            className="text-6xl text-blue-600 mb-4"
          />
        </div>
        <h1 className="text-6xl font-extrabold text-center mb-6 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent min-h-[120px]">
          Welcome to Your <span className="block">Project Management</span> Hub
        </h1>
        <p className="text-xl text-center max-w-3xl mb-10 text-gray-600 leading-relaxed min-h-[60px]">
          Organize your tasks, manage projects, and collaborate seamlessly with
          your team. Streamline your workflow and boost productivity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center min-h-[60px]">
          <Link href="/projects">
            <Button
              size="lg"
              variant="primary"
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="lg"
              variant="secondary"
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[200px]">
          <div className="min-h-[60px] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-4xl text-green-500 mb-4"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">Task Management</h3>
          <p className="text-gray-600">
            Create, assign, and track tasks with ease.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[200px]">
          <div className="min-h-[60px] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-4xl text-blue-500 mb-4"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">Team Collaboration</h3>
          <p className="text-gray-600">
            Work together efficiently with your team members.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[200px]">
          <div className="min-h-[60px] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faRocket}
              className="text-4xl text-purple-500 mb-4"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">Project Tracking</h3>
          <p className="text-gray-600">
            Monitor project progress and milestones.
          </p>
        </div>
      </div>
    </div>
  );
}
