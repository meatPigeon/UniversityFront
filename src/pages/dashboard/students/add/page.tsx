import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api/auth";
import { useNavigate } from "react-router";

export function AddStudentPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // Registering a new user. By default they might be a student.
        // The API might not support setting name here.
        await authApi.register({ email, password, role: 'student' });
        alert("User registered successfully! They can now log in.");
        navigate("/dashboard/students");
    } catch (error) {
        alert("Failed to register user.");
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-6">Register New User</h3>
      <p className="text-muted-foreground mb-6">
          Create a new user account. Additional student details may need to be added by the user or admin later.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>

        <div className="flex flex-row items-end justify-end">
            <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register User"}
            </Button>
        </div>
      </form>
    </div>
  );
};