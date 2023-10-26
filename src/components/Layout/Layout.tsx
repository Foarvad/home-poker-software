import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "../../stitches.config";

export const Layout = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#F5F5F5",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
});

export const Main = styled("main", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
  gap: "16px",
  flex: 1,

  // TODO: fix, header issue
  "@mobile": {
    marginTop: "-80px",
  },
});

export const CenterWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',

  '@desktop': {
    width: '250px',
  },
  '@tablet': {
    width: '250px',
  },
  '@mobile': {
    width: '100%',
  }
});

const StyledHeader = styled("header", {
  backgroundColor: "#FFFFFF",
  padding: "0 24px",
  height: "100px",
  borderBottom: "1px solid #E0E0E0",
  fontSize: "24px",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  // TODO: Main overflowing Header in mobile and not letting clicks to work
  zIndex: 9999,
});

const StyledLink = styled(Link, {
  textDecoration: 'none',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

type HeaderProps = {
  title?: string;
  children?: ReactNode | ReactNode[];
};

export const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <StyledHeader>
      <StyledLink to="/sessions">{title ?? "Home Poker Software"}</StyledLink>
      <div>{children}</div>
    </StyledHeader>
  );
};
