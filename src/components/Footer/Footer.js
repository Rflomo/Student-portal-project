// Footer.js
import React from "react";
import { Layout, Typography, Tooltip } from "antd";

const { Footer } = Layout;
const { Link } = Typography;

const AppFooter = () => {
  return (
    <Footer id="footer" style={{ textAlign: "center" }}>
      Portal ©2025 Created by{" "}
      <Tooltip title="Github">
        <Link href="https://github.com/Rflomo/Student-portal-project" target="_blank" style={{color: "black", textDecoration: "underline"}}>
        Roy Flomo
        </Link>
      </Tooltip>
    </Footer>
  );
};

export default AppFooter;
