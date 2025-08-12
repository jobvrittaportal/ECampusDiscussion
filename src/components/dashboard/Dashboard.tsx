import React, { useEffect, useState } from "react";
import { Fetch } from "../../shared/Fetch";
import { format } from "date-fns";

function Dashboard({ hasPermission }: { hasPermission: (pageName: string, featureName?: string) => boolean }) {
  const [enableNotice, setEnableNotice] = useState([]);
  const userName = sessionStorage.getItem("userName") || "User";

  const enableNotices = async () => {
    const response = await Fetch("Setting", "GET", null, null, null);
    if (response) {
      const data = await response.json();
      const filteredSetting = data.filter((setting: { status: boolean }) => setting.status);
      setEnableNotice(filteredSetting[0]?.status);
    }
  };

  useEffect(() => {
    // notice();
    enableNotices();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-box">
        <h1>Hello, {userName} 👋</h1>
        <p>Welcome to your dashboard</p>
      </div>

    </div>
  );
}

export default Dashboard;
