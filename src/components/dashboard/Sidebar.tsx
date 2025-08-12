import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import { IPageFeature } from "../../hooks/useAuth";
import '../../Style/Sidebar.css'

const Sidebar = ({ hasPermission, pageFeatures }: { hasPermission: (pageName: string, featureName?: string) => boolean, pageFeatures: IPageFeature[] }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const itemRenderer = (item: {
    to: string; icon: any; items: any; label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; badge: any; shortcut: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
  }, options: { onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined; }) => {
    const isActive = location.pathname === item.to;
    return (
      <a className={`flex align-items-center px-3 py-2 gap-2 mt-2 cursor-pointer rounded transition-all ${isActive ? 'active-sidebar-item' : 'hover:bg-custom-green/10'}`}
        onClick={options.onClick}>
        {/* <span className={`${item.icon} ${isActive ? 'text-white' : 'text-primary'}`} /> */}
        <span className={`${item.icon} ${isActive ? 'text-white' : 'text-custom-green'}`} />
        {!collapsed && <span className={`mx-2 ${item.items && 'font-bold'}`}>{item.label}</span>}
      </a>
    );
  };

  const dashboardUrls = ["dashboard"];
  const masterUrls = ["company", "payrollCompany", "branch", "department", "document", "bankName", "industryType", "bloodGroup", "degree", "awardCategory", "jobProfile", "gender", "maritalStatus", "score", "shift", "relation", "reference", "leaveMast", "businessProcess", "holidayMast", "balanceLeave", "employeeStatus", "candidateMaster", "documentCategory", "trainingDocument"];
  const settingUrls = ["role", "user", "page", "setting"];
  const projectUrls = ["project"];

  const breadcrumb = [
    { path: '/dashboard', parent: 'Dashboard', label: 'Dashboard' },
    { path: '/login', parent: 'Login', label: 'Login' },
    { path: '/profile', parent: 'Profile', label: 'Profile' }
  ];

  const menu: any = [];
  const menuMap: any = {};

  let itemKey = 0;

  const addMenuSection = (label: string, icon: string) => {
    if (!menuMap[label]) {
      let section = { key: itemKey++, label, icon, items: [], template: itemRenderer };
      menu.push(section);
      menuMap[label] = section;
    }
  };

  if (pageFeatures.some(page => (page.permission && dashboardUrls.includes(page.url ?? ''))))
    addMenuSection('Dashboard', 'pi pi-fw pi-home');
  if (pageFeatures.some(page => (page.permission && masterUrls.includes(page.url ?? ''))))
    addMenuSection('Masters', 'pi pi-briefcase');
  if (pageFeatures.some(page => (page.permission && settingUrls.includes(page.url ?? ''))))
    addMenuSection('Settings', 'pi pi-cog');
  if (pageFeatures.some(page => (page.permission && projectUrls.includes(page.url ?? ''))))
    addMenuSection('Projects', 'pi pi-cog');

  pageFeatures?.forEach(page => {
    if (page.permission && page.url !== "skip") {
      let category = 'Dashboard';
      if (masterUrls.includes(page.url ?? '')) category = 'Masters';
      else if (settingUrls.includes(page.url ?? '')) category = 'Settings';
      else if (projectUrls.includes(page.url ?? '')) category = 'Projects';

      breadcrumb.push({
        path: "/" + page.url,
        parent: category,
        label: page.label ?? ''
      });

      let menuItem = {
        label: page.label,
        icon: 'pi pi-fw pi-circle',
        template: itemRenderer,
        to: "/" + page.url,
        command: () => navigate("/" + page.url),
      };
      menuMap[category]?.items?.push(menuItem);
    }
  });

  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const expandNode = (node: any) => {
    if (node.items && node.items.length) {
      expandedKeys[node.key] = true;
      node.items.forEach(expandNode);
    }
  };

  return (
    <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      <div className="side">
        <PanelMenu model={menu} expandedKeys={expandedKeys} onExpandedKeysChange={setExpandedKeys} />
      </div>
    </div>
  );
};

export default Sidebar;