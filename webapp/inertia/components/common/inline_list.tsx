import { Theme } from '@emotion/react';
import { Interpolation } from '@emotion/serialize';
import { Children, ReactNode } from 'react';

const InlineList = ({
  children,
  customCss = {},
}: {
  children: ReactNode | ReactNode[];
  customCss?: Interpolation<Theme>;
}) => (
  <ul
    css={[
      {
        display: 'flex',
        gap: '0.75em',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
      },
      customCss,
    ]}
  >
    {Children.map(
      children,
      (child, index) =>
        child && (
          <>
            {index !== 0 && (
              <li css={{ color: '#aaa', fontSize: '.8em' }}>•</li>
            )}
            <li key={child.toString()}>{child}</li>
          </>
        )
    )}
  </ul>
);

export default InlineList;
