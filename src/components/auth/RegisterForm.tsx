
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import RegisterFormFields from "./register/RegisterFormFields";
import AccountTypeSelection from "./register/AccountTypeSelection";
import TermsAndConditions from "./register/TermsAndConditions";
import SocialLoginButtons from "./register/SocialLoginButtons";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["consumer", "vendor"], {
      required_error: "Please select an account type",
    }),
    terms: z.boolean().refine((val) => val, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "consumer",
      terms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values.email, values.password, values.name, values.role);
      // Redirect is handled in the AuthContext based on role
    } catch (error) {
      console.error(error);
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-600 mt-2">Join WWE for the best shopping experience</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RegisterFormFields control={form.control} />
          <AccountTypeSelection control={form.control} />
          <TermsAndConditions control={form.control} />

          <Button
            type="submit"
            className="w-full bg-wwe-navy hover:bg-wwe-navy/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <SocialLoginButtons />

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-wwe-navy hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
