import styled from '@emotion/styled';

const Avatar = styled.img<{ size: number }>(({ size }) => ({
  height: `${size}px`,
  width: `${size}px`,
  borderRadius: '50%',
}));

export default Avatar;
