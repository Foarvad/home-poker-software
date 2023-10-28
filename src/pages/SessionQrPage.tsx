import React from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";

import { Layout, Header, Main, CenterWrapper } from "../components/Layout";

export const SessionQrPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <Layout>
      <Header />
      <Main>
        <CenterWrapper>
          <QRCode value={`http://192.168.1.39:3000/sessions/${sessionId}`} />
        </CenterWrapper>
      </Main>
    </Layout>
  );
};
