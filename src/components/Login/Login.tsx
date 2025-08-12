import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { Fetch } from "../../shared/Fetch";
import hrms from "../../assets/images/Hr Lense logo.png";
import '../../Style/Login.css';

interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  Features: { [key: string]: any };
}

export interface LoginData {
  employeeId: number;
  login: string;
  permissions: { [key: string]: Permission };
  roleId: number;
  token: string;
  roles: Array<{ role_ID: number }>,
}

interface IFormInputs {
  user_EmailID: string;
  login_Password: string;
}

const schema = yup.object({
  user_EmailID: yup.string().required("Email is required*"),
  login_Password: yup.string().required("Password is required*"),
});

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const toast = useRef<Toast>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmitLogin = async (data: IFormInputs) => {
    setLoading(true);
    const response = await Fetch("Employee_Detail/login", "POST", data, null, toast);
    if (response) {
      const result = await response.json();
      console.log(result);
      sessionStorage.setItem('token', result.token);
      sessionStorage.setItem('userName', result.employeeName);

      const loginData = {
        employeeId: result.employeeId,
        roleId: result.roleId,
        permissions: result.permissions,
        isFirstLogin: result.isFirstLogin
      };
      sessionStorage.setItem('loginData', JSON.stringify(loginData));

      if (result.isFirstLogin) {
        setIsAuthenticated(true);
        navigate('/training', { state: { employeeId: result.employeeId, } });
      } else {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    }
    setLoading(false);
  }

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="login-banner">
        <h1 style={{ marginBottom: "70%", color: "blueviolet", fontFamily: "Times New Roman , Times, serif", fontWeight: "bolder" }}>Tek Inspirations!
          <br />
          <span style={{ color: "teal" }}>Your Way To Technology</span>
        </h1>
      </div>
      <div className="login-form-container flex flex-column">
        {/* <div className="login-logo mb-3">
          <img
            // src={hrms}
            // alt="logo"
            width={256}
          />
        </div> */}
        <div className="login-form">
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Controller
                name="user_EmailID"
                control={control}
                defaultValue={""}
                render={({ field, fieldState }) => (
                  <InputText
                    {...field}
                    id="email"
                    type="text"
                    placeholder="Email address"
                    className={`form-input ${fieldState.invalid ? "invalid" : ""}`}
                  />
                )}
              />
              {errors.user_EmailID && (
                <small className="error-message">{errors.user_EmailID.message}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Controller
                name="login_Password"
                control={control}
                defaultValue={""}
                render={({ field, fieldState }) => (
                  <InputText
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Password"
                    className={`form-input ${fieldState.invalid ? "invalid" : ""}`}
                  />
                )}
              />
              {errors.login_Password && (
                <small className="error-message">
                  {errors.login_Password.message}
                </small>
              )}
            </div>
            <Button
              type="submit"
              label="Login"
              // icon="pi pi-user"
              className="login-button"
              // severity="primary"
              loading={loading}
            />
            {/* <Button text label="Forgot Password ?" className="p-button-link" onClick={() => navigate('/forgotpassword')} /> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;