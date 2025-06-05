
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterFormValues } from "@/types/auth";
import RegisterFormFields from "./register/RegisterFormFields";
import AccountTypeSelection from "./register/AccountTypeSelection";
import TermsAndConditions from "./register/TermsAndConditions";
import SocialLoginButtons from "./register/SocialLoginButtons";

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
