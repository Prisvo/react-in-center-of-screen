//@flow
import React, { Component, type Node } from "react";
import createContext, { type Context } from "create-react-context";

const OffsetYContext: Context<{
  offsetY: number,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number
}> = createContext({
  offsetY: 0,
  listItemHeight: 0,
  columnsPerRow: 1,
  centerYStart: 0,
  centerYEnd: 0
});

const IndexContext: Context<number> = createContext(0);

export type OffsetYProviderFaCCOptions = {
  setOffsetY: (offsetY: number) => void
};

export type OffsetYProviderProps = {
  children: (opts: OffsetYProviderFaCCOptions) => Node,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number
};

type OffsetYProviderState = {
  offsetY: number
};

export class OffsetYProvider extends Component<
  OffsetYProviderProps,
  OffsetYProviderState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      offsetY: 0
    };
  }

  render() {
    const {
      state: { offsetY },
      props: {
        children,
        listItemHeight,
        columnsPerRow,
        centerYStart,
        centerYEnd
      }
    } = this;
    return (
      <OffsetYContext.Provider
        value={{
          offsetY,
          listItemHeight,
          columnsPerRow,
          centerYStart,
          centerYEnd
        }}
      >
        {children({ setOffsetY: offsetY => this.setState({ offsetY }) })}
      </OffsetYContext.Provider>
    );
  }
}

export type IndexProviderProps = {
  index: number,
  children: () => Node
};

export class IndexProvider extends Component<IndexProviderProps> {
  render() {
    const {
      props: { children, index }
    } = this;
    return (
      <IndexContext.Provider value={index}>{children()}</IndexContext.Provider>
    );
  }
}

export type ConsumerProps = {
  children: (opts: { isInCenter: boolean }) => Node
};

export class InCenterConsumer extends Component<ConsumerProps> {
  render() {
    const {
      props: { children }
    } = this;

    return (
      <OffsetYContext.Consumer>
        {value => (
          <IndexContext.Consumer>
            {index => {
              const {
                offsetY,
                listItemHeight,
                columnsPerRow = 1,
                centerYStart,
                centerYEnd
              } = value;
              const muliplier = Math.floor(index / columnsPerRow) + 5;
              const offsetTop = listItemHeight * muliplier;
              const positionRelativeToViewport = offsetTop - offsetY;
              const isInCenter =
                positionRelativeToViewport >= centerYStart &&
                positionRelativeToViewport <= centerYEnd;
              return children({ isInCenter });
            }}
          </IndexContext.Consumer>
        )}
      </OffsetYContext.Consumer>
    );
  }
}
