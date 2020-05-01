import React from 'react';
import { createShallowRenderer, childrenOf } from './shallow';

describe('childrenOf', () => {
  it('returns no children', () => {
    expect(childrenOf(<div />)).toEqual([]);
  });

  it('returns direct children', () => {
    expect(childrenOf(<div><p>A</p><p>B</p></div>)).toEqual([<p>A</p>, <p>B</p>]);
  });

  it('return text as an array of one item', () => {
    expect(childrenOf(<div>text</div>)).toEqual(['text']);
  });

  it('returns no children for text', () => {
    expect(childrenOf('text')).toEqual([]);
  });

  it('return array with children for elements with one child', () => {
    expect(childrenOf(<div><p>A</p></div>)).toEqual([<p>A</p>]);
  })
});


const TestComponent = ({ children }) => <React.Fragment>{children}</React.Fragment>;
describe('createShallowRenderer', () => {
  let render, child;
  beforeEach(() => {
    ({ render, child } = createShallowRenderer());
  });

  it('return undefined if the child does not exist', () => {
    render(<TestComponent />);
    expect(child(0)).not.toBeDefined();
  });
});