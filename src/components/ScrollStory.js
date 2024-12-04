import React, { useEffect } from 'react';
import scrollama from 'scrollama';

const ScrollStory = ({ onStepEnter }) => {
  useEffect(() => {
    const scrollerInstance = scrollama();

    scrollerInstance
      .setup({
        step: '.step',
        offset: 0.5, // Trigger at 50% viewport height
        debug: false,
      })
      .onStepEnter(onStepEnter);

    // Cleanup function
    return () => scrollerInstance.destroy();
  }, [onStepEnter]);

  return (
  <div className="scroll-story">
    <div className="step" data-step="1"><p>The World: 2020<br />Had no idea what was about to happen.</p></div>
    <div className="step" data-step="2"><p>The World: 2020-2022<br />Things got messy.</p></div>
    <div className="step" data-step="3"><p>Europe: 2022<br />Always remembering the red dots are simply clusters of actual people.</p></div>
  </div>
  
  );
};

export default ScrollStory;
