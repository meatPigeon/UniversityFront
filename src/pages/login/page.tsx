import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/students" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard/students");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md rounded-lg shadow-sm border-border/50">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="mb-2 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Univer Front</CardTitle>
          <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground/80">
            Authenticate to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            {error && (
              <div className="rounded-sm bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="examplepassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 rounded-md"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full rounded-md h-9 font-medium" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              New user? {" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline hover:text-primary/80"
              >
                Create Account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
