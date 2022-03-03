import React, { FC } from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface ILoaderButton {
  type?: 'submit' | 'reset' | 'button' | undefined;
  showLoader: boolean;
  children: React.ReactNode;
}

const LoaderButton: FC<ILoaderButton> = (props: ILoaderButton) => {
  return (
    <Button type={props.type}>
      {props.showLoader ? <Spinner animation="border" as="span" size="sm" /> : null}
      {props.children}
    </Button>
  );
};

LoaderButton.defaultProps = {
  type: 'button',
};

export default LoaderButton;
