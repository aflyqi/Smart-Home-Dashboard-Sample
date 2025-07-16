import React from 'react';
import styled from 'styled-components';
import { Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const PageContainer = styled(motion.div)`
  padding: 20px;
  width: 100%;
`;

const ContentPaper = styled(Paper)`
  padding: 24px;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  min-height: 400px;
`;

const Tips: React.FC = () => {
  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography variant="h4" sx={{ color: 'white', marginBottom: 3 }}>
        Tips
      </Typography>
      <ContentPaper elevation={3}>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Smart home usage tips and recommendations will be displayed here.
        </Typography>
      </ContentPaper>
    </PageContainer>
  );
};

export default Tips; 