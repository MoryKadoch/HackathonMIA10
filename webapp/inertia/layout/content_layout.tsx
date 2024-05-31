import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';
import Footer from '~/components/common/footer';
import Navbar from '~/components/common/navbar';
import TransitionLayout from '~/layout/_transition_layout';
import cssReset from '~/styles/css_reset';
import documentStyle from '~/styles/document';
import { tableStyle } from '~/styles/table';

const ContentLayoutStyle = styled(TransitionLayout)({
  height: '100%',
  width: '1200px',
  maxWidth: '100%',
  padding: '1em',
  display: 'flex',
  flexDirection: 'column',

  '& main': {
    marginTop: '3em',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
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
    <Global styles={[cssReset, documentStyle, tableStyle]} />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </ContentLayoutStyle>
);

export default ContentLayout;
