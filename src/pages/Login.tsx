import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Users, Building } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import FormField from "../components/auth/FormField";
import Button from "../components/common/Button";
import useForm from "../hooks/useForm";
import { loginValidationRules } from "../utils/authValidation";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation(["auth"]);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'passenger' | 'employee'>('passenger');

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validationRules: loginValidationRules,
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, userType }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || t("errors.loginFailed"));
        }

        login(data.token);
        showToast(t("loginSuccess"), "success");
        navigate("/dashboard");
      } catch (err) {
        showToast(err instanceof Error ? err.message : t("errors.loginFailed"), "error");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t(userType === 'passenger' ? "loginTitle" : "employeeLoginTitle")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t(userType === 'passenger' ? "loginSubtitle" : "employeeLoginSubtitle")}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant={userType === 'passenger' ? 'primary' : 'outline'}
            onClick={() => setUserType('passenger')}
            leftIcon={<Users className="w-4 h-4" />}
          >
            {t("passengerLogin")}
          </Button>
          <Button
            variant={userType === 'employee' ? 'primary' : 'outline'}
            onClick={() => setUserType('employee')}
            leftIcon={<Building className="w-4 h-4" />}
          >
            {t("employeeLogin")}
          </Button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <FormField
              label={t("email")}
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              placeholder={t("emailPlaceholder")}
            />

            <FormField
              label={t("password")}
              type="password"
              name="password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                {t("rememberMe")}
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t("forgotPassword")}
              </Link>
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} fullWidth size="lg">
            {t("loginButton")}
          </Button>

          {userType === 'passenger' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t("noAccount")}{" "}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  {t("registerNow")}
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;