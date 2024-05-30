import styled from '@emotion/styled';
import {
  AccordionItemProps,
  AccordionItem as Item,
} from '@szhsin/react-accordion';
import { FaChevronDown } from 'react-icons/fa';
import { rgba } from '~/lib/color';
import { colors } from '~/styles/colors';

const ItemWithChevron = ({
  header,
  ...rest
}: { header: string } & AccordionItemProps) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <FaChevronDown
          css={{ marginLeft: 'auto', transition: '.15s' }}
          className="chevron-down"
        />
      </>
    }
  />
);

const AccordionItem = styled(ItemWithChevron)({
  borderBottom: `1px solid ${colors.lightGrey}`,

  '.szh-accordion__item': {
    '&-btn': {
      cursor: 'pointer',
      width: '100%',
      fontSize: '1rem',
      fontWeight: 400,
      textAlign: 'left',
      color: 'purple',
      backgroundColor: 'transparent',
      padding: '1rem',
      border: 'none',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      transition: '.15s',

      '&:hover': {
        backgroundColor: rgba(colors.primary, 0.05),
      },
    },

    '&-content': {
      transition: 'height 0.25s cubic-bezier(0, 0, 0, 1)',
    },

    '&-panel': {
      padding: '1rem',
    },
  },

  '&.szh-accordion__item--expanded': {
    '.szh-accordion__item-btn': {
      backgroundColor: rgba(colors.primary, 0.15),
    },
    '.chevron-down': {
      transform: 'rotate(180deg)',
      transition: '.15s',
    },
  },
});

export default AccordionItem;
