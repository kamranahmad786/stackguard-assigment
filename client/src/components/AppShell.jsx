import { Layout, Button } from "antd";
import { useAuth } from "../context/AuthContext";
const { Header, Content } = Layout;

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between">
        <div className="text-white font-semibold">StackGuard</div>
        <div className="flex items-center gap-3">
          {user?.email && <span className="text-white">{user.email}</span>}
          <Button onClick={logout}>Logout</Button>
        </div>
      </Header>
      <Content className="p-6 bg-gray-50">{children}</Content>
    </Layout>
  );
}
