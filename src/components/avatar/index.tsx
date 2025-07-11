/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const avatarContainer = (size: number) => css`
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  width: ${size}px;
  height: ${size}px;
`;

const avatarImg = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const avatarPlaceholder = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1890ff;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "avatar",
  size = 32,
  style,
  children,
}) => {
  return (
    <div css={avatarContainer(size)} style={style}>
      {src ? (
        <img src={src} alt={alt} css={avatarImg} />
      ) : (
        <div css={avatarPlaceholder}>
          {children || alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
