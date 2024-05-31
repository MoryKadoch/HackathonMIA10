import styled from '@emotion/styled';
import { rgba } from '~/lib/color';
import { colors } from '~/styles/colors';

const TabItem = styled.li<{ active?: boolean }>(({ active }) => ({
  userSelect: 'none',
  cursor: 'pointer',
  padding: '10px 20px',
  border: `1px solid ${active ? rgba(colors.primary, 0.1) : colors.lightGrey}`,
  borderBottom: `1px solid ${active ? rgba(colors.primary, 0.25) : colors.lightGrey}`,
  backgroundColor: active ? rgba(colors.primary, 0.15) : 'transparent',
  transition: '.075s',
}));

export default TabItem;
