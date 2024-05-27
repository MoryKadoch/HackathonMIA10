import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';
import Navbar from '~/components/common/navbar';
import TransitionLayout from '~/layout/_transition_layout';
import cssReset from '~/styles/css_reset';
import documentStyle from '~/styles/document';

const ContentLayoutStyle = styled(TransitionLayout)({
  height: '100%',
  width: '1200px',
  maxWidth: '100%',
  padding: '1em',
  display: 'flex',
  flexDirection: 'column',

  '& main': {
    flex: 1,
  },
});

const ContentLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <ContentLayoutStyle className={className}>
    <Global styles={[cssReset, documentStyle]} />
    <Navbar />
    <main>{children}</main>
    {/* <Footer /> */}
  </ContentLayoutStyle>
);

export default ContentLayout;
