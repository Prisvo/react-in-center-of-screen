//@flow
import React, { Component, type Node } from "react";
import createContext, { type Context } from "create-react-context";
import throttle from "lodash.throttle";

const OffsetYContext: Context<{
  offsetY: number,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number,
  listItemLowerBound?: number,
  listItemUpperBound?: number
}> = createContext({
  offsetY: 0,
  listItemHeight: 0,
  columnsPerRow: 1,
  centerYStart: 0,
  centerYEnd: 0,
  listItemLowerBound: 0,
  listItemUpperBound: 0
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
  centerYEnd: number,
  throttle?: number,
  listItemLowerBound?: number,
  listItemUpperBound?: number
};

type OffsetYProviderState = {
  offsetY: number,
  setOffsetY: (offsetY: number) => void
};

export class OffsetYProvider extends Component<
  OffsetYProviderProps,
  OffsetYProviderState
> {
  constructor(props: any) {
    super(props);
    let setOffsetY = offsetY => this.setState({ offsetY });
    if (this.props.throttle) {
      setOffsetY = throttle(setOffsetY, this.props.throttle);
    }
    this.state = {
      offsetY: 0,
      setOffsetY
    };
  }

  render() {
    const {
      state: { offsetY, setOffsetY },
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
        {children({ setOffsetY })}
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
                centerYEnd,
                listItemLowerBound = listItemHeight / 2,
                listItemUpperBound = listItemHeight / 2
              } = value;

              let isInCenter = false;
              const muliplier = Math.floor(index / columnsPerRow);
              const offsetTop = listItemHeight * muliplier;
              const positionRelativeToViewport = offsetTop - offsetY;

              const itemLowerY =
                positionRelativeToViewport + listItemLowerBound;

              const itemUpperY =
                positionRelativeToViewport + listItemUpperBound;

              if (
                (itemLowerY >= centerYStart || itemUpperY >= centerYStart) &&
                (itemLowerY <= centerYEnd || itemUpperY <= centerYEnd)
              ) {
                isInCenter = true;
              }
              return children({ isInCenter });
            }}
          </IndexContext.Consumer>
        )}
      </OffsetYContext.Consumer>
    );
  }
}
