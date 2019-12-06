import React, { useState, memo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';

import { getInitialState, addGift, toggleReservation } from './gifts';

import './misc/index.css';
// [useCallback] We also notice that all those three gift components rerender, which is surprising because, if you think about it, only this one needs rerendering. If we zoom in, we see why it rerendered. It rerendered because we did pass it a new event handler. This is quite a common React problem if you are unaware of that, but there's an easy React-specific fix for that. It's using useCallback.

// [memo] Note - Because the parent component renders. This is the default behavior of React. If a parent component renders, in this case the gift list, all the children re-render as well. However, we want to leverage the fact that the gift that is being passed in, and user's collection, and the current user, and even on the reserve handle doesn't change over time in most cases. So no re-rendering is needed.
// We can use the memo function from React in which we can wrap our gift components. What memo does it memorizes over all the references that are being passed in here as properties to the components. If this gift is the same reference as this component received previously, we know for sure that nothing changes deep inside that tree. Hence, we can just skip rendering this component.
const Gift = memo(({ gift, users, currentUser, onReserve }) => (
  <div className={`gift ${gift.reservedBy ? 'reserved' : ''}`}>
    <img src={gift.image} alt="gift" />
    <div className="description">
      <h2>{gift.description}</h2>
    </div>
    <div className="reservation">
      {!gift.reservedBy || gift.reservedBy === currentUser.id ? (
        <button onClick={() => onReserve(gift.id)}>
          {gift.reservedBy ? 'Unreserve' : 'Reserve'}
        </button>
      ) : (
        <span>{users[gift.reservedBy].name}</span>
      )}
    </div>
  </div>
));

function GiftList() {
  const [state, setState] = useState(() => getInitialState());
  const { users, gifts, currentUser } = state;

  const handleAdd = () => {
    const description = prompt('Gift to add');
    if (description)
      setState(state =>
        addGift(
          state,
          uuidv4(),
          description,
          'https://picsum.photos/200?q=' + Math.random()
        )
      );
  };

  const handleReserve = useCallback(id => {
    setState(state => toggleReservation(state, id));
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>Hi, {currentUser.name}</h1>
      </div>
      <div className="actions">
        <button onClick={handleAdd}>Add</button>
      </div>
      <div className="gifts">
        {gifts.map(gift => (
          <Gift
            key={gift.id}
            gift={gift}
            users={users}
            currentUser={currentUser}
            onReserve={handleReserve}
          />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<GiftList />, document.getElementById('root'));
