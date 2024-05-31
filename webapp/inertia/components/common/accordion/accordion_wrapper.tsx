import styled from '@emotion/styled';
import { Accordion } from '@szhsin/react-accordion';
import { colors } from '~/styles/colors';

const AccordionWrapper = styled(Accordion)({
  border: `1px solid ${colors.lightGrey}`,
  borderRadius: '3px',
  marginBlock: '2.5rem',
  boxShadow: '3px 5px 15px -4px rgba(102, 102, 102, 0.3)',
});

export default AccordionWrapper;
