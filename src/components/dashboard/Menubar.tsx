import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import hrms from '../../assets/images/decryptLogo.png';
import '../../Style/Menubar.css';
import { baseUrl } from '../../shared/Fetch';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Topbar = ({ setIsAuthenticated }: LoginProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const [profileDialogVisible, setProfileDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem('userName');
    const storedProfile = sessionStorage.getItem('profileImgUrl');
    if (storedName) setUserName(storedName);
    if (storedProfile) setProfileImgUrl(storedProfile);
  }, []);

  const logout = async () => {

    const empId = sessionStorage.getItem('employeeId');
    const shiftDate = sessionStorage.getItem('shiftDate');
    const shiftStartTime = sessionStorage.getItem('shiftStartTime');

    await fetch(`${baseUrl}TimeTracker/CalculateShiftDuration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: empId, shiftDate, shiftStartTime }),
    });

    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate('/');

  };

  const handlePasswordChange = async () => {
    const empId = sessionStorage.getItem('employeeId');
    const response = await fetch(`${baseUrl}userDetails/change-password?empId=${empId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.ok) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Password updated' });
      setProfileDialogVisible(false);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update password' });
    }
  };

  const renderProfileImage = () => {
    if (profileImgUrl) {
      return (
        <img src={profileImgUrl} alt="User Avatar" className="rounded-circle" height={36} style={{ cursor: 'pointer' }} onClick={() => setProfileDialogVisible(true)} />
      );
    }
    return (
      <i className="pi pi-user fs-4  text-secondary" style={{ cursor: 'pointer' }} onClick={() => setProfileDialogVisible(true)} />
    );
  };

  return (
    <div className="menubar-custom p-3 bg-white shadow-sm border-bottom w-100">
      <Toast ref={toast} />

      <div className="container-fluid">
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center">
            <img src={hrms} alt="HRLense Logo" style={{ height: 40, marginRight: 10 }} />
          </div>

          <div className="flex align-items-center ms-auto gap-3">
            <span className="me-3 user-name"> {userName}</span>
            <div className=''>
              {renderProfileImage()}
            </div>
            <Button className="ms-3 btn-sm btn-outline-danger" onClick={logout} label="Logout" icon="pi pi-sign-out" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
