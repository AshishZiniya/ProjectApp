// app/auth/login/page.tsx
import Login from "./Login";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
      style={{ contain: "layout style" }}
    >
      <Login />
    </div>
  );
}
