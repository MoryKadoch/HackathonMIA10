import styled from '@emotion/styled';

const Avatar = styled.img<{ size: number }>(({ size }) => ({
  height: `${size}px`,
  width: `${size}px`,
}));

export default Avatar;
