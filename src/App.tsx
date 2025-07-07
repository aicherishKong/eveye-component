/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const ContainerCSS = css`
  color: red;
`;

function App() {
  return <div css={ContainerCSS}>hello</div>;
}

export default App;
