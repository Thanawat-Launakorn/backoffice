"use client";
import layoutComponent from "../component/layout";
import authProvider from "../provider/auth";

function Deliver() {
  const { AuthProvider } = authProvider;
  const { SidebarPage } = layoutComponent;
  return (
    <AuthProvider>
      <SidebarPage>
        <></>
      </SidebarPage>
    </AuthProvider>
  );
}

export default Deliver;
